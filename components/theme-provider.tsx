'use client';

/**
 * Minimal theme provider — replaces `next-themes` to avoid webpack
 * module-resolution issues that were causing
 * `Cannot read properties of undefined (reading 'call')` under pnpm.
 *
 * Zero external dependencies. Pure React. Same API surface as next-themes:
 *   <ThemeProvider defaultTheme="dark">...</ThemeProvider>
 *   const { theme, setTheme, resolvedTheme } = useTheme();
 */

import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (t: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme';

function getSystemTheme(): Resolved {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(resolved: Resolved) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  attribute, // accepted for API compat; we always use class
  enableSystem = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  disableTransitionOnChange,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<Resolved>(
    defaultTheme === 'system' ? 'dark' : (defaultTheme as Resolved)
  );

  // Read from localStorage on mount + apply
  React.useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      // localStorage may be unavailable (private mode, SSR, sandboxed iframes)
    }
    const initial: Theme = stored ?? defaultTheme;
    setThemeState(initial);
    const resolved: Resolved =
      initial === 'system'
        ? enableSystem
          ? getSystemTheme()
          : 'dark'
        : initial;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [defaultTheme, enableSystem]);

  // Listen for system theme changes when theme === 'system'
  React.useEffect(() => {
    if (theme !== 'system' || !enableSystem) return;
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const r = getSystemTheme();
      setResolvedTheme(r);
      applyTheme(r);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme, enableSystem]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      setThemeState(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      const resolved: Resolved =
        next === 'system'
          ? enableSystem
            ? getSystemTheme()
            : 'dark'
          : next;
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [enableSystem]
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    return {
      theme: 'dark' as Theme,
      resolvedTheme: 'dark' as Resolved,
      setTheme: (_t: Theme) => {
        /* no-op */
      },
    };
  }
  return ctx;
}

/**
 * Inline script that runs BEFORE React hydrates, applying the stored theme
 * to <html> to prevent a flash of wrong theme on first paint.
 * Inject this in layout.tsx's <head>.
 */
export function ThemeScript({ defaultTheme = 'dark' }: { defaultTheme?: Theme }) {
  const code = `
    try {
      var s = localStorage.getItem('${STORAGE_KEY}') || '${defaultTheme}';
      var r = s === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : s;
      document.documentElement.classList.remove('light','dark');
      document.documentElement.classList.add(r);
      document.documentElement.style.colorScheme = r;
    } catch(e) {
      document.documentElement.classList.add('${defaultTheme}');
    }
  `.trim();
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
