import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      const data = await res.json();
      // TODO: store the JWT (data.access_token) and redirect to the dashboard
      console.log("Logged in:", data);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.eyebrow}>YieldSense AI</div>
        <h1 style={styles.heading}>Log in to your farm</h1>
        <p style={styles.subheading}>
          Track yield forecasts, weather, and soil health in one place.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@farm.com"
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p style={styles.footerText}>
          New here? <a href="/register" style={styles.link}>Create an account</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F6F4EE", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1.5rem" },
  card: { width: "100%", maxWidth: "380px", background: "#FFFFFF", border: "1px solid #E4E0D4", borderRadius: "10px", padding: "2.25rem", boxShadow: "0 1px 3px rgba(31, 77, 44, 0.08)" },
  eyebrow: { fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#3F7D3A", marginBottom: "0.75rem" },
  heading: { margin: 0, fontSize: "1.5rem", color: "#1F3D24" },
  subheading: { marginTop: "0.5rem", marginBottom: "1.75rem", fontSize: "0.9rem", color: "#6B6455" },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  label: { display: "flex", flexDirection: "column", fontSize: "0.85rem", color: "#3A362C", gap: "0.4rem" },
  input: { padding: "0.6rem 0.75rem", fontSize: "0.95rem", border: "1px solid #D8D3C4", borderRadius: "6px", outline: "none" },
  button: { marginTop: "0.5rem", padding: "0.7rem", fontSize: "0.95rem", fontWeight: 600, color: "#FFFFFF", background: "#2E6B33", border: "none", borderRadius: "6px", cursor: "pointer" },
  error: { fontSize: "0.85rem", color: "#B3261E" },
  footerText: { marginTop: "1.5rem", fontSize: "0.85rem", color: "#6B6455", textAlign: "center" },
  link: { color: "#2E6B33", fontWeight: 600, textDecoration: "none" },
};