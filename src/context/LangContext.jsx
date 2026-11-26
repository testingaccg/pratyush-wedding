import { createContext, useContext, useState } from 'react';

const LangContext = createContext({ lang: 'en', toggleLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggleLang = () => setLang((l) => (l === 'en' ? 'bn' : 'en'));
  return (
    <LangContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
