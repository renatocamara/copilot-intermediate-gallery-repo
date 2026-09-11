"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  type Theme,
  THEME_STORAGE_KEY,
  getStoredTheme,
  getToggleAriaLabel,
  resolveTheme,
} from "@/lib/theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  root.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = getStoredTheme(window.localStorage);
    const initialTheme = resolveTheme(storedTheme, mediaQuery.matches);

    setTheme(initialTheme);
    setHasExplicitPreference(Boolean(storedTheme));
    applyTheme(initialTheme);

    if (storedTheme) return;

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      const nextTheme: Theme = event.matches ? "dark" : "light";
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  const handleThemeToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    setHasExplicitPreference(true);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const accessibleLabel = getToggleAriaLabel(theme);

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      className="btn-secondary inline-flex items-center gap-2"
      aria-label={accessibleLabel}
      aria-pressed={theme === "dark"}
      title={accessibleLabel}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="text-sm">{theme === "dark" ? "Light" : "Dark"} mode</span>
      <span className="sr-only">Current mode: {theme}</span>
      {!hasExplicitPreference && <span className="sr-only">Using system theme preference.</span>}
    </button>
  );
}
