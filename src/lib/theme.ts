export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function getStoredTheme(storage: Pick<Storage, "getItem"> | null): Theme | null {
  if (!storage) return null;

  try {
    const value = storage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function resolveTheme(storedTheme: Theme | null, systemPrefersDark: boolean): Theme {
  if (storedTheme) return storedTheme;
  return systemPrefersDark ? "dark" : "light";
}

export function getToggleAriaLabel(theme: Theme): string {
  return theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

export function getThemeInitScript(): string {
  return `(function () {
  try {
    var storedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
    var hasStoredTheme = storedTheme === "light" || storedTheme === "dark";
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = hasStoredTheme ? storedTheme : (prefersDark ? "dark" : "light");
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    root.setAttribute("data-theme", theme);
  } catch (_) {}
})();`;
}
