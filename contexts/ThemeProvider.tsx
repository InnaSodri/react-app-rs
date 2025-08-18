'use client';
import {useEffect, useState} from 'react';
import type {ReactNode} from 'react';
import {ThemeContext, Theme} from './ThemeContext';

const initial = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved as Theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export function ThemeProvider({children}:{children: ReactNode}) {
  const [theme, setTheme] = useState<Theme>(initial());
  useEffect(() => {
    const b = document.body;
    b.classList.add('app-wrapper');
    b.classList.remove('light','dark');
    b.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext.Provider value={{theme, toggleTheme}}>{children}</ThemeContext.Provider>;
}
