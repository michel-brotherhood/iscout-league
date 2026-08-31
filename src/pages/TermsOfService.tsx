import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsOfService = () => {
  const { t, language } = useLanguage();

  const sections = language === 'pt' ? [
    {
      title: '1. Aceitação dos Termos',
      content: `Ao acessar e utilizar a plataforma iSCOUT, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Se você não concordar com qualquer parte destes termos, não poderá acessar ou utilizar nossos serviços.

Estes termos podem ser atualizados periodicamente. Recomendamos que você os revise regularmente.`,
    },
    {
      title: '2. Descrição do Serviço',
      content: `O iSCOUT é uma plataforma de tecnologia para scouting esportivo que oferece:

• Análise de vídeos utilizando Inteligência Artificial
• Armazenamento otimizado de conteúdo audiovisual
• Geração de relatórios técnicos de atletas
• Ferramentas de gestão para clubes, escolinhas e profissionais
• Marketplace de talentos (quando disponível)`,
    },
    {
      title: '3. Cadastro e Conta',
      content: `Para utilizar nossos serviços, você deve:

• Ter pelo menos 18 anos de idade
• Fornecer informações precisas e completas
• Manter suas credenciais de acesso seguras
• Notificar-nos imediatamente sobre qualquer uso não autorizado

Você é responsável por todas as atividades realizadas em sua conta.`,
    },
    {
      title: '4. Uso Aceitável',
      content: `Ao usar a plataforma, você concorda em NÃO:

• Violar leis ou regulamentos aplicáveis
• Infringir direitos de propriedade intelectual
• Carregar conteúdo ilegal, ofensivo ou prejudicial
• Tentar acessar sistemas ou dados sem autorização
• Usar o serviço para fins de spam ou fraude
• Interferir no funcionamento da plataforma
• Compartilhar credenciais com terceiros não autorizados`,
    },
    {
      title: '5. Propriedade Intelectual',
      content: `A plataforma iSCOUT, incluindo software, design, logos e conteúdo original, é propriedade da iSCOUT e seus licenciadores. Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização.

O conteúdo que você carrega permanece de sua propriedade, mas você nos concede licença para processá-lo conforme necessário para fornecer o serviço.`,
    },
    {
      title: '6. Pagamentos e Assinaturas',
      content: `Os planos pagos estão sujeitos aos seguintes termos:

• Cobrança recorrente conforme o plano escolhido
• Preços podem ser alterados com 30 dias de aviso prévio
• Reembolsos são avaliados caso a caso
• O não pagamento pode resultar em suspensão do serviço
• Você pode cancelar sua assinatura a qualquer momento`,
    },
    {
      title: '7. Limitação de Responsabilidade',
      content: `O iSCOUT é fornecido "como está". Não garantimos que:

• O serviço será ininterrupto ou livre de erros
• Os resultados das análises serão 100% precisos
• Decisões baseadas em nossos dados terão sucesso

Não nos responsabilizamos por perdas indiretas, consequenciais ou punitivas decorrentes do uso da plataforma.`,
    },
    {
      title: '8. Conteúdo de Menores',
      content: `Para conteúdo envolvendo atletas menores de idade:

• É necessário consentimento dos pais ou responsáveis legais
• O responsável legal deve manter a conta e gerenciar o acesso
• Cumprimos todas as leis de proteção de menores aplicáveis
• Temos direito de remover conteúdo que viole essas políticas`,
    },
    {
      title: '9. Encerramento',
      content: `Podemos suspender ou encerrar seu acesso se:

• Você violar estes termos
• Suspeitarmos de atividade fraudulenta
• For exigido por lei ou ordem judicial

Você pode encerrar sua conta a qualquer momento. Após o encerramento, seus dados serão tratados conforme nossa Política de Privacidade.`,
    },
    {
      title: '10. Disposições Gerais',
      content: `• Estes termos são regidos pelas leis do Brasil
• Disputas serão resolvidas no foro da comarca de São Paulo/SP
• A invalidade de qualquer cláusula não afeta as demais
• Nossa falha em exercer um direito não constitui renúncia

Para dúvidas sobre estes termos:
📧 E-mail: legal@iscout.com`,
    },
  ] : [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the iSCOUT platform, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services.

These terms may be updated periodically. We recommend that you review them regularly.`,
    },
    {
      title: '2. Service Description',
      content: `iSCOUT is a sports scouting technology platform that offers:

• Video analysis using Artificial Intelligence
• Optimized audiovisual content storage
• Generation of athlete technical reports
• Management tools for clubs, academies and professionals
• Talent marketplace (when available)`,
    },
    {
      title: '3. Registration and Account',
      content: `To use our services, you must:

• Be at least 18 years old
• Provide accurate and complete information
• Keep your access credentials secure
• Notify us immediately of any unauthorized use

You are responsible for all activities carried out on your account.`,
    },
    {
      title: '4. Acceptable Use',
      content: `When using the platform, you agree NOT to:

• Violate applicable laws or regulations
• Infringe intellectual property rights
• Upload illegal, offensive or harmful content
• Attempt to access systems or data without authorization
• Use the service for spam or fraud purposes
• Interfere with platform operation
• Share credentials with unauthorized third parties`,
    },
    {
      title: '5. Intellectual Property',
      content: `The iSCOUT platform, including software, design, logos and original content, is the property of iSCOUT and its licensors. You may not copy, modify or distribute our content without authorization.

Content you upload remains your property, but you grant us a license to process it as necessary to provide the service.`,
    },
    {
      title: '6. Payments and Subscriptions',
      content: `Paid plans are subject to the following terms:

• Recurring billing according to the chosen plan
• Prices may be changed with 30 days notice
• Refunds are evaluated case by case
• Non-payment may result in service suspension
• You can cancel your subscription at any time`,
    },
    {
      title: '7. Limitation of Liability',
      content: `iSCOUT is provided "as is". We do not guarantee that:

• The service will be uninterrupted or error-free
• Analysis results will be 100% accurate
• Decisions based on our data will be successful

We are not responsible for indirect, consequential or punitive losses arising from use of the platform.`,
    },
    {
      title: '8. Minor Content',
      content: `For content involving underage athletes:

• Parental or legal guardian consent is required
• The legal guardian must maintain the account and manage access
• We comply with all applicable child protection laws
• We have the right to remove content that violates these policies`,
    },
    {
      title: '9. Termination',
      content: `We may suspend or terminate your access if:

• You violate these terms
• We suspect fraudulent activity
• Required by law or court order

You can terminate your account at any time. After termination, your data will be handled according to our Privacy Policy.`,
    },
    {
      title: '10. General Provisions',
      content: `• These terms are governed by the laws of Brazil
• Disputes will be resolved in the court of São Paulo/SP
• The invalidity of any clause does not affect the others
• Our failure to exercise a right does not constitute waiver

For questions about these terms:
📧 Email: legal@iscout.com`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-24 pt-32">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t('terms.backToHome')}
        </Link>
        
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-helvetica-neue mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('terms.lastUpdate')}
            </p>
          </header>
          
          <div className="space-y-8">
            {sections.map((section, index) => (
              <section key={index} className="glass-card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
