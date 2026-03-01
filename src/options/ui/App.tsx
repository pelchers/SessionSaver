import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import SessionPage from "./pages/SessionPage";

type ThemeMode = "light" | "dark";
const THEME_STORAGE_KEY = "sessionsaver.theme";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/" className="brand-link">
            SessionSaver
          </Link>
        </div>
        <button
          className="ghost theme-toggle"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/session/:id" element={<SessionPage />} />
        </Routes>
      </main>
    </div>
  );
}
