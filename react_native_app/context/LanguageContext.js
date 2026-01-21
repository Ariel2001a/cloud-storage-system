import { createContext, useContext, useState } from 'react';
import { translations } from '../styles/translation.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [locale, setLocale] = useState('en');

    const t = (key) => {
        return translations[locale][key] || key;
    };

    const switchLanguage = (lang) => {
        setLocale(lang);
    };

    return (
        <LanguageContext.Provider value={{ t, locale, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);


