import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/iscout-logo-branca.png';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Info,
  Bug,
  HelpCircle,
  KeyRound,
  CreditCard,
  UserCog,
  Video,
  Gauge,
  Plug,
  Smartphone,
  ShieldAlert,
  FileQuestion,
  MoreHorizontal,
  Building2,
  ClipboardList,
  TrendingUp,
  User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const COOLDOWN_KEY = 'iscout:contact-cooldown-until';
const COOLDOWN_MS = 60_000;
// Tempo mínimo entre abrir o dialog e enviar (anti-bot, complementa o rate-limit do backend).
const MIN_FILL_MS = 3_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s()+\-]{5,40}$/;

// hCaptcha public site key (segura para o bundle — chave pública por design).
// Configurada em dashboard.hcaptcha.com.
const HCAPTCHA_SITE_KEY = '0624644c-7ec4-48ae-849a-36845f929c96';

const roleOptions = [
  { value: 'dirigente', label: 'Dirigente de escolinha', icon: Building2 },
  { value: 'treinador', label: 'Treinador', icon: ClipboardList },
  { value: 'investidor', label: 'Investidor', icon: TrendingUp },
  { value: 'outro', label: 'Outro', icon: User },
] as const;

const reasonOptions = [
  { value: 'demonstracao', label: 'Demo', tooltip: 'Agendar uma demonstração' },
  { value: 'parcerias', label: 'Parcerias', tooltip: 'Conversar sobre uma parceria' },
  { value: 'suporte', label: 'Suporte', tooltip: 'Quero ajuda com a usabilidade ou reportar erro' },
] as const;

const supportTypeOptions = [
  { value: 'bug', label: 'Bug / erro no sistema', icon: Bug, hint: 'Algo quebrou ou comporta-se errado' },
  { value: 'usabilidade', label: 'Dúvida de usabilidade', icon: HelpCircle, hint: 'Como usar uma funcionalidade' },
  { value: 'acesso', label: 'Acesso / login', icon: KeyRound, hint: 'Não consigo entrar na conta' },
  { value: 'pagamento', label: 'Pagamento / cobrança', icon: CreditCard, hint: 'Fatura, plano, reembolso' },
  { value: 'cadastro', label: 'Cadastro / dados do atleta', icon: UserCog, hint: 'Editar perfil, ficha técnica' },
  { value: 'video', label: 'Upload / análise de vídeo', icon: Video, hint: 'Envio ou análise de partidas' },
  { value: 'performance', label: 'Lentidão / performance', icon: Gauge, hint: 'App lento ou travando' },
  { value: 'integracao', label: 'Integração / API', icon: Plug, hint: 'Conexão com sistemas externos' },
  { value: 'mobile', label: 'App mobile', icon: Smartphone, hint: 'Problemas no celular' },
  { value: 'seguranca', label: 'Segurança / privacidade', icon: ShieldAlert, hint: 'LGPD, dados pessoais' },
  { value: 'sugestao', label: 'Sugestão de melhoria', icon: FileQuestion, hint: 'Ideia ou nova funcionalidade' },
  { value: 'outro', label: 'Outro', icon: MoreHorizontal, hint: 'Outro tipo de problema' },
] as const;

const PARTNERSHIP_WHATSAPP = '5511976526105';

const schema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome').max(120),
  email: z.string().trim().max(255).regex(EMAIL_REGEX, 'E-mail inválido'),
  phone: z.string().trim().regex(PHONE_REGEX, 'Telefone inválido'),
  state: z.string().trim().min(2, 'Informe seu estado').max(60),
  role: z.enum(['dirigente', 'treinador', 'investidor', 'outro']),
  role_other: z.string().trim().max(120).optional(),
  reason: z.enum(['demonstracao', 'parcerias', 'suporte'], {
    errorMap: () => ({ message: 'Selecione um motivo' }),
  }),
  support_type: z.enum(['bug', 'usabilidade', 'acesso', 'pagamento', 'cadastro', 'video', 'performance', 'integracao', 'mobile', 'seguranca', 'sugestao', 'outro']).optional(),
  message: z.string().trim().min(1, 'Escreva uma mensagem').max(2000),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Você precisa aceitar a política de privacidade' }),
  }),
})
  .refine(
    (data) => data.role !== 'outro' || (data.role_other && data.role_other.length > 0),
    { message: 'Descreva sua função', path: ['role_other'] }
  )
  .refine(
    (data) => data.reason !== 'suporte' || !!data.support_type,
    { message: 'Selecione o tipo de problema', path: ['support_type'] }
  );

type FormState = {
  name: string;
  email: string;
  phone: string;
  state: string;
  role: '' | 'dirigente' | 'treinador' | 'investidor' | 'outro';
  role_other: string;
  reason: '' | 'demonstracao' | 'parcerias' | 'suporte';
  support_type: '' | 'bug' | 'usabilidade' | 'acesso' | 'pagamento' | 'cadastro' | 'video' | 'performance' | 'integracao' | 'mobile' | 'seguranca' | 'sugestao' | 'outro';
  message: string;
  acceptTerms: boolean;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  state: '',
  role: '',
  role_other: '',
  reason: '',
  support_type: '',
  message: '',
  acceptTerms: true,
};

const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(1, local.length - visible.length))}@${domain}`;
};

const isOnCooldown = () => {
  try {
    const until = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
};

const setCooldown = () => {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(Date.now() + COOLDOWN_MS));
  } catch {
    // ignore
  }
};

const ContactDialog = () => {
  const { isOpen, closeContact } = useContactDialog();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const mountedAtRef = useRef<number>(0);
  const captchaRef = useRef<HCaptcha | null>(null);

  // Reset time-trap whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      mountedAtRef.current = Date.now();
    }
  }, [isOpen]);

  const handleClose = (open: boolean) => {
    if (!open) {
      closeContact();
      setTimeout(() => {
        setForm(emptyForm);
        setHoneypot('');
        setErrors({});
        setSubmitting(false);
        try {
          captchaRef.current?.resetCaptcha();
        } catch {
          // ignore
        }
      }, 200);
    }
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Pretend success without hitting the network — used by honeypot/time-trap/cooldown.
  const fakeSuccess = (name: string, email: string) => {
    closeContact();
    setTimeout(() => {
      setForm(emptyForm);
      setErrors({});
      navigate('/obrigado', {
        state: { name: name || 'Visitante', emailMasked: email ? maskEmail(email) : '' },
      });
    }, 150);
  };

  // Executes the invisible captcha and resolves with the token (or '' on failure).
  const getCaptchaToken = (): Promise<string> =>
    new Promise((resolve) => {
      const ref = captchaRef.current;
      if (!ref) {
        resolve('');
        return;
      }
      let settled = false;
      const finish = (token: string) => {
        if (settled) return;
        settled = true;
        resolve(token);
      };
      // Safety timeout — never block the UI more than 15s
      const timeout = setTimeout(() => finish(''), 15_000);
      try {
        ref
          .execute({ async: true })
          .then((res: { response?: string } | undefined) => {
            clearTimeout(timeout);
            finish(res?.response ?? '');
          })
          .catch(() => {
            clearTimeout(timeout);
            finish('');
          });
      } catch {
        clearTimeout(timeout);
        finish('');
      }
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot — bot filled the hidden field
    if (honeypot.trim().length > 0) {
      fakeSuccess(form.name, form.email);
      return;
    }

    // Time-trap — submitted impossibly fast (now 3s minimum)
    if (Date.now() - mountedAtRef.current < MIN_FILL_MS) {
      fakeSuccess(form.name, form.email);
      return;
    }

    // Local cooldown (mirrors backend rate-limit so UX stays consistent)
    if (isOnCooldown()) {
      fakeSuccess(form.name, form.email);
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    // 1) Resolve invisible captcha token
    const captchaToken = await getCaptchaToken();
    if (!captchaToken) {
      setSubmitting(false);
      toast({
        title: 'Não foi possível validar o envio',
        description: 'Recarregue a página e tente novamente.',
        variant: 'destructive',
      });
      return;
    }

    // Build message — append support_type so it's persisted in DB along with the rest.
    const supportLabel = parsed.data.support_type
      ? supportTypeOptions.find((o) => o.value === parsed.data.support_type)?.label ?? parsed.data.support_type
      : null;
    const finalMessage = supportLabel
      ? `[Suporte: ${supportLabel}]\n\n${parsed.data.message}`
      : parsed.data.message;

    // 2) Call edge function (verifies captcha server-side, then inserts)
    const { data, error } = await supabase.functions.invoke('verify-contact', {
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        state: parsed.data.state,
        role: parsed.data.role,
        role_other: parsed.data.role === 'outro' ? parsed.data.role_other ?? null : null,
        reason: parsed.data.reason,
        message: finalMessage,
        captchaToken,
      },
    });

    setSubmitting(false);
    try {
      captchaRef.current?.resetCaptcha();
    } catch {
      // ignore
    }

    // Non-2xx responses come through as `error` from supabase.functions.invoke.
    // We treat captcha/rate-limit failures as silent success to avoid leaking the rule.
    if (error || (data && (data as { ok?: boolean }).ok !== true)) {
      const reason = (data as { error?: string } | null)?.error ?? '';
      const isSilent =
        /captcha_invalid|captcha_required|rate_limited|spam_links/i.test(reason) ||
        /non-?2xx|FunctionsHttpError/i.test(error?.message ?? '');
      if (isSilent) {
        setCooldown();
        fakeSuccess(parsed.data.name, parsed.data.email);
        return;
      }
      toast({
        title: 'Erro ao enviar',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      });
      return;
    }

    setCooldown();

    // Parcerias → abre o WhatsApp com mensagem padrão de parceria
    if (parsed.data.reason === 'parcerias') {
      const waText =
        `Olá! Sou ${parsed.data.name} (${parsed.data.state}) e tenho interesse em uma parceria com a iSCOUT.\n\n` +
        `Função: ${parsed.data.role === 'outro' ? parsed.data.role_other : parsed.data.role}\n` +
        `E-mail: ${parsed.data.email}\n` +
        `Telefone: ${parsed.data.phone}\n\n` +
        `Mensagem:\n${parsed.data.message}`;
      const waUrl = `https://wa.me/${PARTNERSHIP_WHATSAPP}?text=${encodeURIComponent(waText)}`;
      closeContact();
      setTimeout(() => {
        setForm(emptyForm);
        setErrors({});
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        navigate('/obrigado', {
          state: {
            name: parsed.data.name,
            emailMasked: maskEmail(parsed.data.email),
            reason: parsed.data.reason,
            whatsappUrl: waUrl,
          },
        });
      }, 150);
      return;
    }

    closeContact();
    setTimeout(() => {
      setForm(emptyForm);
      setErrors({});
      navigate('/obrigado', {
        state: {
          name: parsed.data.name,
          emailMasked: maskEmail(parsed.data.email),
          reason: parsed.data.reason,
          supportType: parsed.data.reason === 'suporte' ? supportLabel : null,
        },
      });
    }, 150);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={logo} alt="iSCOUT" className="h-7 w-auto object-contain" />
            <span className="sr-only">Fale com a iSCOUT</span>
          </DialogTitle>
          <DialogDescription>
            Preencha o formulário e retornaremos em breve.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot — invisible to humans, irresistible to naive bots */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              top: 'auto',
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-name">Nome *</Label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              maxLength={120}
              required
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">E-mail *</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                maxLength={255}
                required
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-phone">Telefone *</Label>
              <Input
                id="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                maxLength={40}
                required
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-state">Estado *</Label>
            <Input
              id="contact-state"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              placeholder="Ex: SP"
              maxLength={60}
              required
            />
            {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
          </div>

          <div className="space-y-2">
            <Label>Sou *</Label>
            <TooltipProvider delayDuration={200}>
              <div
                role="radiogroup"
                aria-label="Sou"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2"
              >
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = form.role === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => update('role', opt.value)}
                      className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                        selected
                          ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_4px_20px_-4px_hsl(var(--primary)/0.35)]'
                          : 'border-input bg-background/40 hover:border-primary/40 hover:bg-muted/40'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          selected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      <span
                        className={`text-[11px] leading-tight font-medium ${
                          selected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </TooltipProvider>
            {errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
          </div>

          {form.role === 'outro' && (
            <div className="space-y-1.5">
              <Label htmlFor="contact-role-other">Qual sua função? *</Label>
              <Input
                id="contact-role-other"
                value={form.role_other}
                onChange={(e) => update('role_other', e.target.value)}
                maxLength={120}
                required
              />
              {errors.role_other && <p className="text-xs text-destructive">{errors.role_other}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label>Motivo do contato *</Label>
            <TooltipProvider delayDuration={150}>
              <RadioGroup
                value={form.reason}
                onValueChange={(v) => {
                  const next = v as FormState['reason'];
                  setForm((prev) => ({
                    ...prev,
                    reason: next,
                    // Pré-seleciona "Bug" como tipo padrão ao escolher Suporte;
                    // limpa caso o usuário troque para outro motivo.
                    support_type: next === 'suporte' ? (prev.support_type || 'bug') : '',
                  }));
                  if (errors.reason) setErrors((e) => ({ ...e, reason: undefined }));
                  if (errors.support_type) setErrors((e) => ({ ...e, support_type: undefined }));
                }}
                className="grid grid-cols-3 gap-2"
              >
                {reasonOptions.map((opt) => (
                  <Label
                    key={opt.value}
                    htmlFor={`reason-${opt.value}`}
                    className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={opt.value} id={`reason-${opt.value}`} />
                    <span className="text-sm font-normal flex-1">{opt.label}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Saiba mais sobre ${opt.label}`}
                          onClick={(e) => e.preventDefault()}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[220px] text-xs">
                        {opt.tooltip}
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                ))}
              </RadioGroup>
            </TooltipProvider>
            {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
          </div>

          {form.reason === 'suporte' && (
            <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-1 duration-300">
              <Label>Tipo de problema *</Label>
              <TooltipProvider delayDuration={200}>
                <div
                  role="radiogroup"
                  aria-label="Tipo de problema"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                >
                  {supportTypeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = form.support_type === opt.value;
                    return (
                      <Tooltip key={opt.value}>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update('support_type', opt.value)}
                            className={`group relative flex flex-col items-center justify-center gap-1.5 rounded-lg border px-2 py-3 text-center transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                              selected
                                ? 'border-primary bg-primary/10 shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_4px_20px_-4px_hsl(var(--primary)/0.35)]'
                                : 'border-input bg-background/40 hover:border-primary/40 hover:bg-muted/40'
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 transition-colors ${
                                selected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                              }`}
                            />
                            <span
                              className={`text-[11px] leading-tight font-medium ${
                                selected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                              }`}
                            >
                              {opt.label}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[220px] text-xs">
                          {opt.hint}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
              {errors.support_type && (
                <p className="text-xs text-destructive">{errors.support_type}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Mensagem *</Label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={4}
              maxLength={2000}
              required
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
          </div>

          <div className="flex items-start gap-2 pt-1">
            <Checkbox
              id="contact-terms"
              checked={form.acceptTerms}
              onCheckedChange={(v) => update('acceptTerms', v === true)}
              className="mt-0.5"
            />
            <Label htmlFor="contact-terms" className="text-xs sm:text-sm font-normal leading-snug cursor-pointer">
              Li e concordo com a{' '}
              <Link
                to="/privacy"
                className="text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  closeContact();
                }}
              >
                Política de Privacidade
              </Link>{' '}
              da iSCOUT.
            </Label>
          </div>
          {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms}</p>}

          {/* Invisible hCaptcha — only triggered on submit via captchaRef.execute() */}
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            size="invisible"
            onError={() => { /* swallow — handled in submit */ }}
            onExpire={() => { try { captchaRef.current?.resetCaptcha(); } catch { /* ignore */ } }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
