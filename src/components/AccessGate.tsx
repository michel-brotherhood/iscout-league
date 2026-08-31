import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PUBLIC_PATHS = ["/hub"];

const STORAGE_KEY = "iscout-access";
const ATTEMPTS_KEY = "iscout-access-attempts";
const LOCKOUT_KEY = "iscout-access-lockout";
const ACCESS_PASSWORD = "I'll be back";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 60_000; // 1 minuto
const SUCCESS_DELAY_MS = 1200;

interface AccessGateProps {
  children: ReactNode;
}

const AccessGate = ({ children }: AccessGateProps) => {
  const location = useLocation();
  const isPublicPath = PUBLIC_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));
  const [granted, setGranted] = useState<boolean | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef<number | null>(null);

  // Hydrate from storage
  useEffect(() => {
    try {
      setGranted(localStorage.getItem(STORAGE_KEY) === "granted");
      const storedAttempts = parseInt(
        localStorage.getItem(ATTEMPTS_KEY) ?? "0",
        10,
      );
      if (!Number.isNaN(storedAttempts)) setAttempts(storedAttempts);
      const storedLock = parseInt(
        localStorage.getItem(LOCKOUT_KEY) ?? "0",
        10,
      );
      if (storedLock && storedLock > Date.now()) {
        setLockUntil(storedLock);
      } else if (storedLock) {
        localStorage.removeItem(LOCKOUT_KEY);
      }
    } catch {
      setGranted(false);
    }
  }, []);

  // Tick countdown while locked
  useEffect(() => {
    if (lockUntil === null) return;
    const update = () => {
      const current = Date.now();
      setNow(current);
      if (current >= lockUntil) {
        setLockUntil(null);
        setAttempts(0);
        try {
          localStorage.removeItem(LOCKOUT_KEY);
          localStorage.removeItem(ATTEMPTS_KEY);
        } catch {
          // ignore
        }
      }
    };
    update();
    tickRef.current = window.setInterval(update, 1000);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [lockUntil]);

  const isLocked = lockUntil !== null && now < lockUntil;
  const remainingSeconds = isLocked
    ? Math.max(0, Math.ceil((lockUntil! - now) / 1000))
    : 0;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - attempts);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLocked || success) return;

    if (value === ACCESS_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, "granted");
        localStorage.removeItem(ATTEMPTS_KEY);
        localStorage.removeItem(LOCKOUT_KEY);
      } catch {
        // ignore storage errors
      }
      setSuccess(true);
      setError(false);
      window.setTimeout(() => setGranted(true), SUCCESS_DELAY_MS);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setError(true);
    setShake(true);
    setValue("");
    window.setTimeout(() => setShake(false), 500);

    try {
      localStorage.setItem(ATTEMPTS_KEY, String(nextAttempts));
    } catch {
      // ignore
    }

    if (nextAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      setLockUntil(until);
      try {
        localStorage.setItem(LOCKOUT_KEY, String(until));
      } catch {
        // ignore
      }
    }
  };

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (granted === null) {
    return <div className="fixed inset-0 bg-background" />;
  }

  if (granted) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background px-6">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-iscout-lime/5 via-transparent to-iscout-cyan/5" />

      <div
        className={`relative w-full max-w-md glass-card p-8 md:p-10 space-y-6 ${
          shake ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
      >
        {success ? (
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-iscout-lime/15 border border-iscout-lime/40 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-8 h-8 text-iscout-lime" />
            </div>
            <h1 className="text-2xl font-bold gradient-text-iscout">
              Acesso liberado
            </h1>
            <p className="text-sm text-muted-foreground">
              Redirecionando você para o iSCOUT...
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                  isLocked
                    ? "bg-destructive/10 border-destructive/40"
                    : "bg-iscout-lime/10 border-iscout-lime/30"
                }`}
              >
                {isLocked ? (
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                ) : (
                  <Lock className="w-6 h-6 text-iscout-lime" />
                )}
              </div>
              <h1 className="text-2xl font-bold gradient-text-iscout">
                {isLocked ? "Acesso bloqueado" : "Acesso restrito"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLocked
                  ? `Muitas tentativas incorretas. Aguarde ${remainingSeconds}s para tentar novamente.`
                  : "Esta prévia do iSCOUT é privada. Digite a senha para continuar."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  autoFocus
                  placeholder="Senha de acesso"
                  value={value}
                  disabled={isLocked}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (error) setError(false);
                  }}
                  aria-invalid={error}
                  aria-describedby={error ? "access-error" : undefined}
                  className="h-12 text-base bg-background/60"
                />
                {error && !isLocked && (
                  <p
                    id="access-error"
                    className="text-sm text-destructive"
                    role="alert"
                  >
                    Senha incorreta.{" "}
                    {remainingAttempts > 0
                      ? `${remainingAttempts} ${
                          remainingAttempts === 1 ? "tentativa" : "tentativas"
                        } restante${remainingAttempts === 1 ? "" : "s"}.`
                      : "Limite atingido."}
                  </p>
                )}
                {isLocked && (
                  <p className="text-sm text-destructive" role="alert">
                    Bloqueado por {remainingSeconds}s.
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLocked}
                className="w-full h-12 btn-primary"
              >
                {isLocked ? `Aguarde ${remainingSeconds}s` : "Entrar"}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground/70">
              iSCOUT · Infraestrutura de Scouting
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccessGate;
