import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
export type Theme = 'light' | 'dark';
interface ThemeContextValue { theme: Theme; setTheme: (theme: Theme) => void; }
const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'norda.theme';
export function ThemeProvider({ children, defaultTheme='light' }: { children: ReactNode; defaultTheme?: Theme }): JSX.Element {
  const [theme,setThemeState] = useState<Theme>(() => {
    try { const saved=window.localStorage.getItem(STORAGE_KEY); return saved==='dark' || saved==='light' ? saved : defaultTheme; } catch { return defaultTheme; }
  });
  const setTheme = (next: Theme) => setThemeState(next);
  useEffect(() => {
    document.documentElement.dataset.theme=theme;
    try { window.localStorage.setItem(STORAGE_KEY,theme); } catch { /* storage can be unavailable */ }
  },[theme]);
  return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>;
}
export function useTheme(): ThemeContextValue {
  const value=useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}