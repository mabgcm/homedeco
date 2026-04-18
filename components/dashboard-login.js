"use client";

import { useState } from "react";

export function DashboardLogin() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState({
    loading: false,
    message: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setState({
      loading: true,
      message: ""
    });

    try {
      const response = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      window.location.reload();
    } catch (error) {
      setState({
        loading: false,
        message: error.message || "Login failed."
      });
    }
  }

  return (
    <main className="dashboard-gate-page">
      <div className="dashboard-gate-card">
        <p className="eyebrow">Protected dashboard</p>
        <h1>Enter dashboard password</h1>
        <p className="dashboard-copy">
          Products, sales, and delivery data are behind a password gate.
        </p>
        <form onSubmit={handleSubmit} className="dashboard-gate-form">
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Dashboard password"
            className="dashboard-input"
          />
          <button type="submit" className="primary-link" disabled={state.loading}>
            {state.loading ? "Checking..." : "Unlock dashboard"}
          </button>
        </form>
        {state.message ? <p className="gate-error">{state.message}</p> : null}
      </div>
    </main>
  );
}
