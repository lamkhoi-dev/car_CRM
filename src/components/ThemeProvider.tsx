import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderState {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeProviderState>({
  theme: "system",
  resolved: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as Theme) || "system";
  });

  const [resolved, setResolved] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    if (theme !== "system") return theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // Apply class on <html>
  useEffect(() => {
    const root = document.documentElement;
    let actual: "light" | "dark";

    if (theme === "system") {
      actual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      actual = theme;
    }

    root.classList.toggle("dark", actual === "dark");
    setResolved(actual);
  }, [theme]);

  // Listen to system preference changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const actual = e.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", actual === "dark");
      setResolved(actual);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem("theme", t);
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
