import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import LibraryPage from "./pages/LibraryPage";
import SessionPage from "./pages/SessionPage";

export default function App(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <Link to="/" className="brand-link">
            SessionSaver
          </Link>
        </div>
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
