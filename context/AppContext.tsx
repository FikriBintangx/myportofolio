'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Theme = 'dark' | 'light';
type Language = 'en' | 'id';

interface AppContextType {
    theme: Theme;
    language: Language;
    cvUrl: string | null;
    toggleTheme: () => void;
    toggleLanguage: () => void;
    setCvUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('dark');
    const [language, setLanguage] = useState<Language>('id');
    const [cvUrl, setCvUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchCv = async () => {
            const { data } = createClient().storage.from('documents').getPublicUrl('cv.pdf');
            if (data) setCvUrl(data.publicUrl);
        };
        fetchCv();
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedLang = localStorage.getItem('lang') as Language;
        if (savedTheme) setTheme(savedTheme);
        if (savedLang) setLanguage(savedLang);
    }, []);

    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('lang', language);
    }, [language]);

    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    const toggleLanguage = () => setLanguage(prev => (prev === 'id' ? 'en' : 'id'));

    return (
        <AppContext.Provider value={{ theme, language, cvUrl, toggleTheme, toggleLanguage, setCvUrl }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
