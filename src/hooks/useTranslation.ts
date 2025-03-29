import { useState, useEffect, useCallback } from 'react';
import { translations, Language } from '@/i18n/translations';

// Key to store the language preference in localStorage
const LANGUAGE_STORAGE_KEY = 'mental-care-language';

export const useTranslation = () => {
  // Default to Arabic or get from localStorage
  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') return 'ar';
    
    const storedLang = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    return storedLang === 'en' ? 'en' : 'ar';
  };
  
  const [lang, setLang] = useState<Language>(getInitialLanguage());
  
  // Check if the current language is RTL
  const isRTL = lang === 'ar';
  
  // Function to set the HTML dir attribute based on language
  const setDocumentDirection = (language: Language) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  };
  
  // Set initial direction on mount
  useEffect(() => {
    setDocumentDirection(lang);
  }, []);
  
  // Translation function
  const t = useCallback(
    (key: string): string => {
      const translation = translations[lang][key];
      if (!translation) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      return translation;
    },
    [lang]
  );
  
  // Set language and update localStorage
  const setLanguage = useCallback((language: Language) => {
    setLang(language);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    setDocumentDirection(language);
  }, []);
  
  // Toggle language function
  const toggleLanguage = useCallback(() => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  }, [lang, setLanguage]);
  
  return {
    lang,
    t,
    isRTL,
    setLanguage,
    toggleLanguage,
  };
}; 