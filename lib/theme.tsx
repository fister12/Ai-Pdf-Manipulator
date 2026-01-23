'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyThemeToDOM = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('dark');
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Apply dark mode on mount
  useEffect(() => {
    applyThemeToDOM();
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // No-op - dark mode only
  };

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return { theme: 'dark' as const, toggleTheme: () => {} };
  }
  return context;
}
