// Theme configuration and management

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface Theme {
  name: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  logo?: string;
  favicon?: string;
}

// Default NDISE theme
export const ndiseTheme: Theme = {
  name: 'NDISE',
  colors: {
    light: {
      primary: '#002868', // Blue from Liberian flag
      primaryHover: '#001f4d',
      secondary: '#CC0000', // Red from Liberian flag
      accent: '#FFD700', // Gold
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
    },
    dark: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#ef4444',
      accent: '#fbbf24',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  },
};

// Generic blue theme (for other projects)
export const defaultTheme: Theme = {
  name: 'Default',
  colors: {
    light: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
    },
    dark: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  },
};

// Green theme
export const greenTheme: Theme = {
  name: 'Green',
  colors: {
    light: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#0891b2',
      accent: '#84cc16',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#6b7280',
      border: '#d1fae5',
    },
    dark: {
      primary: '#10b981',
      primaryHover: '#059669',
      secondary: '#06b6d4',
      accent: '#84cc16',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
      background: '#064e3b',
      surface: '#065f46',
      text: '#f0fdf4',
      textSecondary: '#a7f3d0',
      border: '#047857',
    },
  },
};

export const themes = {
  ndise: ndiseTheme,
  default: defaultTheme,
  green: greenTheme,
};

export type ThemeMode = 'light' | 'dark';
export type ThemeName = keyof typeof themes;

/**
 * Apply theme to document root
 */
export function applyTheme(themeName: ThemeName, mode: ThemeMode) {
  const theme = themes[themeName];
  const colors = theme.colors[mode];

  const root = document.documentElement;

  // Apply CSS variables
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-hover', colors.primaryHover);
  root.style.setProperty('--color-secondary', colors.secondary);
  root.style.setProperty('--color-accent', colors.accent);
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-error', colors.error);
  root.style.setProperty('--color-info', colors.info);
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-text-secondary', colors.textSecondary);
  root.style.setProperty('--color-border', colors.border);

  // Set dark mode class
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Get current theme from localStorage
 */
export function getSavedTheme(): { name: ThemeName; mode: ThemeMode } {
  const savedTheme = localStorage.getItem('theme');
  const savedMode = localStorage.getItem('themeMode');

  return {
    name: (savedTheme as ThemeName) || 'ndise',
    mode: (savedMode as ThemeMode) || 'light',
  };
}

/**
 * Save theme to localStorage
 */
export function saveTheme(themeName: ThemeName, mode: ThemeMode) {
  localStorage.setItem('theme', themeName);
  localStorage.setItem('themeMode', mode);
}
