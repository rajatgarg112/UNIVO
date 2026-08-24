import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 'light' | 'dark' | 'system'
  const [appearanceMode, setAppearanceMode] = useState(() => {
    return localStorage.getItem('uv_appearance_mode') || 'dark';
  });

  const [effectiveTheme, setEffectiveTheme] = useState('dark');

  useEffect(() => {
    localStorage.setItem('uv_appearance_mode', appearanceMode);

    let activeTheme = appearanceMode;
    if (appearanceMode === 'system') {
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = systemPrefersDark ? 'dark' : 'light';
    }

    setEffectiveTheme(activeTheme);
    localStorage.setItem('uv_theme', activeTheme);
    if (activeTheme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [appearanceMode]);

  // Listen for system theme preference changes if in 'system' mode
  useEffect(() => {
    if (appearanceMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const activeTheme = e.matches ? 'dark' : 'light';
      setEffectiveTheme(activeTheme);
      localStorage.setItem('uv_theme', activeTheme);
      if (activeTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [appearanceMode]);

  const setMode = (newMode) => {
    setAppearanceMode(newMode);
  };

  const toggleTheme = () => {
    setAppearanceMode((prev) => (effectiveTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: effectiveTheme,
        appearanceMode,
        setMode,
        toggleTheme,
        isDark: effectiveTheme === 'dark'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
