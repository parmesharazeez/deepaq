"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const emptySubscribe = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

let themeListeners: Array<() => void> = [];

function subscribeTheme(callback: () => void) {
  themeListeners.push(callback);
  window.addEventListener("storage", callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
    window.removeEventListener("storage", callback);
  };
}

function notifyThemeChange() {
  themeListeners.forEach((l) => l());
}

function getThemeSnapshot(): Theme {
  try {
    const saved = localStorage.getItem("deepaq_theme");
    if (saved === "light" || saved === "dark") return saved;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {}
  return "light";
}

function getThemeServerSnapshot(): Theme {
  return "light";
}

const applyThemeToDOM = (t: Theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const body = document.body;

  root.setAttribute("data-theme", t);
  body.setAttribute("data-theme", t);

  if (t === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    body.classList.add("dark");
    body.classList.remove("light");
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    body.classList.add("light");
    body.classList.remove("dark");
  }
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  mounted: false,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const mounted = useMounted();

  // Keep DOM classNames in sync when theme changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem("deepaq_theme", next);
    } catch {}
    applyThemeToDOM(next);
    notifyThemeChange();
  };

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, mounted, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
