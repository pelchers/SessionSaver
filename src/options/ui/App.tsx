import React from "react";
import { Link, Route, Routes } from "react-router-dom";

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
          <Route path="/" element={<LibraryPlaceholder />} />
          <Route path="/session/:id" element={<SessionPlaceholder />} />
        </Routes>
      </main>
    </div>
  );
}

function LibraryPlaceholder(): JSX.Element {
  return (
    <div className="card">
      <h1>Library</h1>
      <p>Scaffold complete. Phase 1 will implement session capture and storage.</p>
    </div>
  );
}

function SessionPlaceholder(): JSX.Element {
  return (
    <div className="card">
      <h1>Session</h1>
      <p>Explorer tree UI will land in Phase 3.</p>
    </div>
  );
}

