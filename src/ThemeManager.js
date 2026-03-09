import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('music-theme') || 'dark'; // dark mode по умолчанию для музыкального сервиса
    });

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        localStorage.setItem('music-theme', theme);
        document.body.className = theme; // Для глобальных стилей
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Пользовательский хук для удобного использования контекста
export const useThemeContext = () => {
    return useContext(ThemeContext);
};

// Компонент кнопки переключения темы
export const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeContext();
    return (
        <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? '🌙 Темная тема' : '☀️ Светлая тема'}
        </button>
    );
};