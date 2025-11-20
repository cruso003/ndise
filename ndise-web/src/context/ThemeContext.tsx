import React, { createContext, useContext, useState, useEffect } from 'react';
import { applyTheme, getSavedTheme, saveTheme, type ThemeName, type ThemeMode } from '../lib/theme';

interface ThemeContextType {
  theme: ThemeName;
  mode: ThemeMode;
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('ndise');
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = getSavedTheme();
    setThemeState(saved.name);
    setModeState(saved.mode);
    applyTheme(saved.name, saved.mode);
    setIsInitialized(true);
  }, []);

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    saveTheme(newTheme, mode);
    applyTheme(newTheme, mode);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    saveTheme(theme, newMode);
    applyTheme(theme, newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const value: ThemeContextType = {
    theme,
    mode,
    setTheme,
    setMode,
    toggleMode,
  };

  // Don't render children until theme is initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
