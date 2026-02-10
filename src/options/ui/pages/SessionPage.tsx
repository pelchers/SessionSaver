import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { SavedSessionV1 } from "../../../lib/types";
import { bgCall } from "../chromeRpc";

export default function SessionPage(): JSX.Element {
  const { id } = useParams();
  const [session, setSession] = useState<SavedSessionV1 | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const res = await bgCall({ type: "GET_SESSION", id });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSession(res.session);
    })();
  }, [id]);

  if (error) {
    return (
      <div className="card">
        <h1>Session</h1>
        <div className="error">{error}</div>
        <Link to="/" className="link">
          Back to library
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="card">
        <div className="muted">Loading…</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>{session.name}</h1>
          <div className="muted">{session.description}</div>
        </div>
        <Link to="/" className="link">
          Back
        </Link>
      </div>

      <div style={{ marginTop: 14 }} className="muted">
        Phase 3 will replace this with the explorer tree. For now this is a raw snapshot preview.
      </div>

      <pre className="code">{JSON.stringify(session.windows, null, 2)}</pre>
    </div>
  );
}

