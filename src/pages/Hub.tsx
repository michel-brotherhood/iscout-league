import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Radar,
  Presentation,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  KeyRound,
  ArrowLeft,
  User as UserIcon,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import logo from "@/assets/iscout-logo-branca.png";

type CredentialKey = "bruno" | "rafael" | "bernardo";
type PitchCategory = "all" | "clube" | "outros";

const CREDENTIALS: Record<
  CredentialKey,
  { name: string; email: string; password: string }
> = {
  bruno: {
    name: "Bruno",
    email: "bruno@iscout.tech",
    password: "Nd%346Q7hDJEd@XT",
  },
  rafael: {
    name: "Rafael",
    email: "rafael@iscout.tech",
    password: "LBwT$$#$vRgBm8Gg",
  },
  bernardo: {
    name: "Bernardo",
    email: "bernardo@iscout.tech",
    password: "AYg9Zx!Ma4xuw3J7",
  },
};

const PITCHES: { label: string; href: string; category: Exclude<PitchCategory, "all"> }[] = [
  { label: "Pitch Embarque", href: "https://iscout.tech/pitch-embarque", category: "outros" },
  { label: "Pitch Empresas", href: "https://iscout.tech/pitch-empresas", category: "outros" },
  { label: "Pitch América", href: "https://iscout.tech/pitch-america", category: "clube" },
  { label: "Pitch BigSoccer", href: "https://iscout.tech/pitch-bigsoccer", category: "clube" },
  { label: "Pitch PSG", href: "https://iscout.tech/pitch-psg", category: "clube" },
  { label: "Pitch RedBull", href: "https://iscout.tech/pitch-redbull", category: "clube" },
];

const copy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  } catch {
    toast.error("Não foi possível copiar");
  }
};

const CopyUrlButton = ({ url, label = "URL" }: { url: string; label?: string }) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      copy(url, label);
    }}
    aria-label={`Copiar ${label}`}
    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-iscout-lime"
  >
    <Copy className="w-3.5 h-3.5" />
  </Button>
);

const CredentialsDialog = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CredentialKey | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => {
    setSelected(null);
    setShowPassword(false);
  };

  const cred = selected ? CREDENTIALS[selected] : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <KeyRound className="w-4 h-4" />
          Ver credenciais admin
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {cred ? `Credenciais de ${cred.name}` : "Quem é você?"}
          </DialogTitle>
          <DialogDescription>
            {cred
              ? "Use estas credenciais para acessar o painel admin do chatbot."
              : "Selecione seu nome para revelar suas credenciais."}
          </DialogDescription>
        </DialogHeader>

        {!cred ? (
          <div className="grid grid-cols-1 gap-2 pt-2">
            {(Object.keys(CREDENTIALS) as CredentialKey[]).map((k) => (
              <Button
                key={k}
                variant="outline"
                className="justify-start h-12 gap-3"
                onClick={() => setSelected(k)}
              >
                <UserIcon className="w-4 h-4 text-iscout-lime" />
                {CREDENTIALS[k].name}
              </Button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                E-mail
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={cred.email}
                  className="flex-1 h-10 px-3 rounded-md bg-background/60 border border-border/40 text-sm font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copy(cred.email, "E-mail")}
                  aria-label="Copiar e-mail"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Senha
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  type={showPassword ? "text" : "password"}
                  value={cred.password}
                  className="flex-1 h-10 px-3 rounded-md bg-background/60 border border-border/40 text-sm font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copy(cred.password, "Senha")}
                  aria-label="Copiar senha"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="w-full"
            >
              Trocar usuário
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ExternalLinkRow = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <div className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-background/60 hover:border-iscout-lime/50 hover:bg-iscout-lime/5 transition-colors">
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-2 text-sm"
    >
      <ExternalLink className="w-3.5 h-3.5 text-iscout-lime" />
      {children}
    </a>
    <CopyUrlButton url={href} />
  </div>
);

const Hub = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PitchCategory>("all");

  const filteredPitches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PITCHES.filter((p) => {
      const matchesCat = category === "all" || p.category === category;
      const matchesQuery =
        !q ||
        p.label.toLowerCase().includes(q) ||
        p.href.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  const filters: { id: PitchCategory; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: PITCHES.length },
    { id: "clube", label: "Clubes", count: PITCHES.filter((p) => p.category === "clube").length },
    { id: "outros", label: "Outros", count: PITCHES.filter((p) => p.category === "outros").length },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-iscout-lime/5 via-transparent to-iscout-cyan/5 pointer-events-none" />

      <header className="relative z-10 border-b border-border/30">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="iSCOUT" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-12">
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-iscout-lime">
            Hub interno
          </p>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text-iscout">
            Aplicações & Pitches iSCOUT
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Central de links rápidos para as aplicações e apresentações do
            ecossistema iSCOUT.
          </p>
        </section>

        {/* Aplicações */}
        <section className="space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Aplicações
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chatbot */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-iscout-lime/10 border border-iscout-lime/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-iscout-lime" />
                </div>
                <div>
                  <h3 className="font-semibold">Chatbot</h3>
                  <p className="text-xs text-muted-foreground">
                    Interface pública e painel admin
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ExternalLinkRow href="https://iscout.tech/chatbot">
                  iscout.tech/chatbot
                </ExternalLinkRow>
                <ExternalLinkRow href="https://iscout.tech/chatbot/admin">
                  iscout.tech/chatbot/admin
                </ExternalLinkRow>
              </div>

              <div className="pt-2 border-t border-border/30">
                <CredentialsDialog />
              </div>
            </div>

            {/* Escolinhas Radar */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-iscout-cyan/10 border border-iscout-cyan/30 flex items-center justify-center">
                  <Radar className="w-5 h-5 text-iscout-cyan" />
                </div>
                <div>
                  <h3 className="font-semibold">Escolinhas Radar</h3>
                  <p className="text-xs text-muted-foreground">
                    Mapeamento de escolinhas
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <ExternalLinkRow href="https://iscout.tech/escolinhas-radar">
                  iscout.tech/escolinhas-radar
                </ExternalLinkRow>
              </div>
            </div>
          </div>
        </section>

        {/* Pitches */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
              Pitches
            </h2>
            <span className="text-xs text-muted-foreground/70">
              {filteredPitches.length} de {PITCHES.length}
            </span>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar pitch por nome ou URL..."
                className="pl-9 pr-9 h-10 bg-background/60"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/30"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {filters.map((f) => {
                const active = category === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategory(f.id)}
                    className={`px-3 h-10 rounded-md text-xs font-medium border transition-colors ${
                      active
                        ? "bg-iscout-lime/15 border-iscout-lime/50 text-iscout-lime"
                        : "bg-background/60 border-border/40 text-muted-foreground hover:border-iscout-lime/40 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                    <span className="ml-1.5 opacity-60">{f.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredPitches.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum pitch encontrado para "{query}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredPitches.map((p) => (
                <div
                  key={p.href}
                  className="group glass-card p-4 flex items-center justify-between gap-2 hover:border-iscout-lime/40 transition-colors"
                >
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-9 h-9 rounded-md bg-iscout-lime/10 border border-iscout-lime/20 flex items-center justify-center shrink-0">
                      <Presentation className="w-4 h-4 text-iscout-lime" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-medium block truncate">
                        {p.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                        {p.category}
                      </span>
                    </div>
                  </a>
                  <div className="flex items-center gap-1 shrink-0">
                    <CopyUrlButton url={p.href} label={p.label} />
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${p.label}`}
                      className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-iscout-lime hover:bg-iscout-lime/5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="pt-8 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground/70">
            iSCOUT · Hub interno · uso restrito
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Hub;
