import { createContext, useState, useEffect, ReactNode } from 'react';
import { pt } from '@/locales/pt';
import { en } from '@/locales/en';

export type Language = 'pt' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
  locale: typeof pt;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = { pt, en };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return typeof result === 'string' ? result : path;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('iscout-language');
      if (saved === 'pt' || saved === 'en') {
        return saved;
      }
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('iscout-language', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'pt' ? 'en' : 'pt'));
  };

  const t = (key: string): string => {
    return getNestedValue(translations[language] as Record<string, unknown>, key);
  };

  const locale = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage, locale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { useLanguage } from './useLanguage';
