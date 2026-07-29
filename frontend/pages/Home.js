import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ fontFamily: "sans-serif", padding: "3rem" }}>
      <h1>YieldSense AI</h1>
      <p>Crop Yield Prediction &amp; Agricultural Productivity Forecasting System</p>
      <p>Frontend scaffold — dashboard, farm management, and prediction views coming soon.</p>
      <Link to="/login" style={{ color: "#2E6B33", fontWeight: 600 }}>
        Log in →
      </Link>
    </main>
  );
}