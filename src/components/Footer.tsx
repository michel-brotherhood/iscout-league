import { Link } from 'react-router-dom';
import { Mail, LifeBuoy, Handshake } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/iscout-logo-branca.png';

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    institucional: [
      { label: t('footer.links.about'), href: '#' },
      { label: t('footer.links.technology'), href: '#' },
      { label: t('footer.links.cases'), href: '#' },
      { label: t('footer.partnership'), href: '/#parceria' },
      { label: 'FAQ', href: '/#faq' },
    ],
    legal: [
      { label: t('footer.links.terms'), href: '/terms', isInternal: true },
      { label: t('footer.links.privacy'), href: '/privacy', isInternal: true },
      { label: t('footer.links.lgpd'), href: '#' },
      { label: t('footer.links.security'), href: '#' },
    ],
  };

  const renderLink = (link: { label: string; href: string; isInternal?: boolean }) => {
    if (link.isInternal) {
      return (
        <Link
          to={link.href}
          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          {link.label}
        </Link>
      );
    }
    return (
      <a
        href={link.href}
        onClick={(e) => {
          if (link.href === '#') e.preventDefault();
        }}
        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
      >
        {link.label}
      </a>
    );
  };

  const emails = [
    { icon: Mail, label: 'contato@iscout.tech' },
    { icon: Handshake, label: 'parcerias@iscout.tech' },
    { icon: LifeBuoy, label: 'suporte@iscout.tech' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2 text-center md:text-left">
            <Link to="/" aria-label="iSCOUT - Página inicial" className="inline-block">
              <img src={logo} alt="iSCOUT" className="h-10 w-auto mb-4 mx-auto md:mx-0" />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {t('footer.description')}
            </p>
            <p className="text-sm font-medium text-foreground/80">CNPJ: 10.538.909/0001-51</p>
          </div>

          {/* Institucional */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-foreground mb-4">{t('footer.institutional')}</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              {emails.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <a
                    href={`mailto:${label}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start group"
                  >
                    <Icon className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-foreground mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('footer.madeWith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
