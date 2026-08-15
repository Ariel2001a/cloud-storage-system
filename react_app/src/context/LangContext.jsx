import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext();

export function LangProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "he");
    const isRtl = lang === "he";

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    return (
        <LangContext.Provider value={{ lang, setLang, isRtl }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}