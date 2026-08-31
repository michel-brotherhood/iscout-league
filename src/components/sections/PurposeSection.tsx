import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';

const PurposeSection = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';

  return (
    <section id="proposito" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeIn">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              {t('purpose.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-helvetica-neue mb-12">
              {t('purpose.title')}
            </h2>

            <div className="space-y-8 text-lg sm:text-xl text-muted-foreground leading-relaxed">
              <ScrollReveal animation="fadeInUp" delay={0.2}>
                <p>
                  {isPt
                    ? 'Cada métrica em nossa plataforma representa uma história em construção.'
                    : 'Every metric on our platform represents a story being built.'}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.3}>
                <p>
                  {isPt ? (
                    <>Por trás dos dados, há <span className="text-foreground font-semibold">jovens com sonhos</span> que treinam todos os dias, <span className="text-foreground font-semibold">famílias que acreditam</span> e investem tudo que têm, <span className="text-foreground font-semibold">empresários que apostam</span> suas carreiras nesses talentos, e <span className="text-foreground font-semibold">comunidades inteiras</span> que torcem por eles.</>
                  ) : (
                    <>Behind the data, there are <span className="text-foreground font-semibold">young people with dreams</span> who train every day, <span className="text-foreground font-semibold">families who believe</span> and invest everything they have, <span className="text-foreground font-semibold">agents who bet</span> their careers on these talents, and <span className="text-foreground font-semibold">entire communities</span> cheering for them.</>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.4}>
                <p>
                  {isPt ? (
                    <>Nosso papel é <span className="gradient-text font-bold">transformar informação em oportunidade real.</span></>
                  ) : (
                    <>Our role is to <span className="gradient-text font-bold">transform information into real opportunity.</span></>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.5}>
                <p>
                  {isPt ? (
                    <>Com <span className="text-foreground font-semibold">respeito</span>, porque cada atleta merece avaliação justa.<br />Com <span className="text-foreground font-semibold">acolhimento</span>, porque famílias precisam de transparência.<br />Com <span className="text-foreground font-semibold">critério</span>, porque achismos destroem sonhos e investimentos.</>
                  ) : (
                    <>With <span className="text-foreground font-semibold">respect</span>, because every athlete deserves fair evaluation.<br />With <span className="text-foreground font-semibold">warmth</span>, because families need transparency.<br />With <span className="text-foreground font-semibold">rigor</span>, because guesswork destroys dreams and investments.</>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.6}>
                <p>
                  {isPt ? (
                    <>O iSCOUT nasceu para <span className="text-foreground font-semibold">enxergar o talento onde ele acontece:</span><br />no campo, na quadra, na vida real.</>
                  ) : (
                    <>iSCOUT was born to <span className="text-foreground font-semibold">see talent where it happens:</span><br />on the field, on the court, in real life.</>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.7}>
                <p className="text-primary font-semibold">
                  {isPt
                    ? 'Acreditamos que infraestrutura sem propósito é apenas commodity.'
                    : 'We believe that infrastructure without purpose is just a commodity.'}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.8}>
                <p>
                  {isPt ? (
                    <>Estamos aqui para transformar o olhar sobre o futebol, para que <span className="text-foreground font-semibold">talentos não sejam desperdiçados</span> — nem <span className="text-foreground font-semibold">oportunidades de negócio.</span></>
                  ) : (
                    <>We are here to transform the way we look at football, so that <span className="text-foreground font-semibold">talents are not wasted</span> — nor <span className="text-foreground font-semibold">business opportunities.</span></>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeInUp" delay={0.9}>
                <p className="text-xl sm:text-2xl text-foreground font-semibold mt-12">
                  {isPt ? (
                    <>Porque quando a infraestrutura serve ao humano,<br /><span className="gradient-text">todos ganham</span>: jogadores, famílias, clubes e o esporte.</>
                  ) : (
                    <>Because when infrastructure serves people,<br /><span className="gradient-text">everyone wins</span>: players, families, clubs and the sport.</>
                  )}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fadeIn" delay={1}>
                <p className="text-muted-foreground mt-8 italic">
                  {isPt ? (
                    <>Infraestrutura para descobrir talento com mais clareza e menos viés.<br /><span className="text-foreground font-medium">Tecnologia que amplia o olhar humano — não o substitui.</span></>
                  ) : (
                    <>Infrastructure to discover talent with more clarity and less bias.<br /><span className="text-foreground font-medium">Technology that expands the human eye — not replaces it.</span></>
                  )}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PurposeSection;
