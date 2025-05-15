import { createContext, useContext, useEffect, useState } from 'react';
import { fetchTranslations } from '../services/translationService';

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState({});
  const [language, setLanguage] = useState('en'); 

  useEffect(() => {
    fetchTranslations().then(res => {
      const dict = {};
      res.data.forEach(item => {
        dict[item.key] = { en: item.en, es: item.es };
      });
      setTranslations(dict);
    });
  }, []);

  const t = (key) => {
    return translations[key]?.[language] || key;
  };

  return (
    <TranslationContext.Provider value={{ t, setLanguage, language }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => useContext(TranslationContext);
