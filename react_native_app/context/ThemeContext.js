import { createContext, useContext, useState } from 'react';
import { COLORS, getLightColors } from '../styles/Theme.js';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false);

    const theme = {
        isDark,
        colors: isDark ? COLORS : getLightColors(),
    };

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);