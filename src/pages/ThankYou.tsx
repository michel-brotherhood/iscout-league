import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Mail, User, MessageCircle, LifeBuoy, Clock, BadgeCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type ThankYouState = {
  name?: string;
  emailMasked?: string;
  reason?: 'demonstracao' | 'parcerias' | 'suporte';
  whatsappUrl?: string;
  supportType?: string | null;
};

const reasonCopy: Record<NonNullable<ThankYouState['reason']>, string> = {
  demonstracao:
    'Recebemos sua solicitação de demonstração. Em breve nossa equipe iSCOUT entrará em contato para agendar.',
  suporte:
    'Recebemos seu chamado de suporte. Em breve nossa equipe iSCOUT retornará o contato pelo e-mail e telefone informados.',
  parcerias:
    'Tudo certo! Estamos abrindo o WhatsApp do nosso time de parcerias. Caso a janela não abra automaticamente, use o botão abaixo.',
};

// Previsão de retorno por motivo — alinha expectativa do usuário.
const reasonETA: Record<NonNullable<ThankYouState['reason']>, string> = {
  demonstracao: 'até 1 dia útil',
  suporte: 'até 24 horas úteis',
  parcerias: 'mesmo dia útil pelo WhatsApp',
};

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submission, setSubmission] = useState<ThankYouState | null>(null);

  // Read PII-safe summary from router state only — no sessionStorage, no full PII.
  useEffect(() => {
    const state = (location.state ?? null) as ThankYouState | null;
    if (state && (state.name || state.emailMasked)) {
      setSubmission(state);
    }
  }, [location.state]);

  // Auto-redirect to home after 12s — exceto para parcerias (precisa do botão de WhatsApp acessível)
  useEffect(() => {
    if (submission?.reason === 'parcerias') return;
    const timer = setTimeout(() => navigate('/'), 12000);
    return () => clearTimeout(timer);
  }, [navigate, submission?.reason]);

  const isParcerias = submission?.reason === 'parcerias';
  const isSuporte = submission?.reason === 'suporte';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-10 rounded-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-3xl sm:text-4xl font-bold font-helvetica-neue mb-3">
              Obrigado pelo contato! ⚽
            </h1>
            <p className="text-muted-foreground mb-8">
              {submission?.reason
                ? reasonCopy[submission.reason]
                : 'Sua mensagem foi recebida com sucesso. Nossa equipe iSCOUT vai analisar seu pedido e retornar em breve no e-mail e telefone informados.'}
            </p>

            {isSuporte && submission?.supportType && (
              <div className="text-left bg-primary/5 border border-primary/30 rounded-xl p-5 sm:p-6 mb-4">
                <div className="flex items-start gap-3">
                  <LifeBuoy className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h2 className="text-sm font-semibold text-foreground mb-1">
                      Chamado de suporte registrado
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Tipo de problema:{' '}
                      <span className="text-foreground font-medium">{submission.supportType}</span>
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-2">
                      Retornaremos o contato pelo e-mail e telefone informados.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Segunda confirmação — categoria + previsão de retorno destacada */}
            {isSuporte && submission?.supportType && (
              <div className="text-left bg-gradient-to-br from-primary/10 via-background/40 to-background/40 border border-primary/40 rounded-xl p-5 sm:p-6 mb-6">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-sm font-semibold text-foreground mb-1">
                        Confirmação do atendimento
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Recebemos os detalhes do seu chamado e ele já está na fila do time de suporte.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-background/40 border border-border/40 rounded-lg p-3">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wide block mb-1">
                          Categoria
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          {submission.supportType}
                        </span>
                      </div>
                      <div className="bg-background/40 border border-border/40 rounded-lg p-3">
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wide block mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Previsão de retorno
                        </span>
                        <span className="text-sm text-foreground font-medium">
                          {reasonETA.suporte}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Para demo / parcerias — exibe a previsão de retorno como segunda confirmação */}
            {!isSuporte && submission?.reason && (
              <div className="text-left bg-primary/5 border border-primary/30 rounded-xl p-4 sm:p-5 mb-6 flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-0.5">
                    Previsão de retorno
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Nosso time entrará em contato{' '}
                    <span className="text-foreground font-medium">
                      {reasonETA[submission.reason]}
                    </span>
                    .
                  </p>
                </div>
              </div>
            )}

            {submission && (submission.name || submission.emailMasked) && (
              <div className="text-left bg-background/40 border border-border/40 rounded-xl p-5 sm:p-6 space-y-3 mb-8">
                <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide mb-3">
                  Resumo do envio
                </h2>
                {submission.name && (
                  <SummaryRow icon={User} label="Nome" value={submission.name} />
                )}
                {submission.emailMasked && (
                  <SummaryRow icon={Mail} label="E-mail" value={submission.emailMasked} />
                )}
                <p className="text-xs text-muted-foreground/70 pt-2">
                  Por privacidade, exibimos apenas um resumo. Seus dados completos estão protegidos
                  e serão usados somente para responder seu contato.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isParcerias && submission?.whatsappUrl && (
                <a
                  href={submission.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp
                </a>
              )}
              <Link
                to="/"
                className={
                  isParcerias && submission?.whatsappUrl
                    ? 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-border text-foreground hover:bg-muted/40 transition-colors'
                    : 'btn-primary inline-flex items-center justify-center gap-2'
                }
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para a home
              </Link>
            </div>

            {!isParcerias && (
              <p className="text-xs text-muted-foreground/60 mt-6">
                Você será redirecionado automaticamente em alguns segundos...
              </p>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const SummaryRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) => (
  <div className="flex gap-3 items-start text-sm">
    <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <span className="text-muted-foreground text-xs block">{label}</span>
      <span className="text-foreground truncate block">{value}</span>
    </div>
  </div>
);

export default ThankYou;
