import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Shield, Database, Trash2, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="glass-card p-6 sm:p-8">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-28 pb-16">
        <div className="section-container max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Home
          </Link>

          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </header>

          <div className="space-y-6">
            <SectionCard icon={Shield} title="Resumo">
              <p>
                A iSCOUT respeita sua privacidade. Esta página explica, de forma objetiva,
                quais dados coletamos no formulário de contato, para que usamos e como você
                pode solicitar a remoção a qualquer momento, conforme a LGPD (Lei nº 13.709/2018).
              </p>
            </SectionCard>

            <SectionCard icon={Database} title="Dados coletados no formulário">
              <p>Ao enviar o formulário de contato, coletamos apenas:</p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Nome</li>
                <li>E-mail</li>
                <li>Telefone</li>
                <li>Estado</li>
                <li>Função (dirigente, treinador, investidor ou outro)</li>
                <li>Motivo do contato (parcerias, dúvidas ou suporte)</li>
                <li>Mensagem enviada por você</li>
              </ul>
              <p>
                Esses dados são utilizados <strong>exclusivamente</strong> para responder
                à sua solicitação e manter um histórico de atendimento.
              </p>
            </SectionCard>

            <SectionCard icon={Clock} title="Por quanto tempo armazenamos">
              <p>
                Mantemos seus dados pelo tempo necessário para concluir o atendimento e cumprir
                obrigações legais. Como regra geral, mensagens enviadas pelo formulário de
                contato são <strong>excluídas após 180 dias</strong> da data de envio,
                por meio de uma rotina automática de expurgo.
              </p>
              <p>
                Você pode solicitar a exclusão antecipada a qualquer momento (veja a seção abaixo).
                Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins
                de marketing.
              </p>
            </SectionCard>

            <SectionCard icon={Trash2} title="Como solicitar a remoção dos seus dados">
              <p>
                Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer
                momento. Basta enviar um e-mail para o nosso canal de privacidade informando:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-1">
                <li>Nome completo usado no envio</li>
                <li>E-mail informado no formulário</li>
                <li>Solicitação desejada (ex.: "Solicito a exclusão dos meus dados")</li>
              </ul>
              <p>
                Responderemos em até <strong>15 dias úteis</strong> e confirmaremos a remoção
                por e-mail.
              </p>
            </SectionCard>

            <SectionCard icon={Mail} title="Canal de contato (privacidade)">
              <p>Para qualquer dúvida ou solicitação relacionada aos seus dados:</p>
              <a
                href="mailto:contato@iscout.tech"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Mail className="w-4 h-4" />
                contato@iscout.tech
              </a>
              <p className="text-sm">
                CNPJ: 10.538.909/0001-51
              </p>
            </SectionCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
