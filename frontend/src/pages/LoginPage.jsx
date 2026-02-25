import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/book");
    } catch (err) {
      setError(err?.response?.data?.message || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <h1>Connexion</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>E-mail</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <label>Mot de passe</label>
        <input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <p>
        Pas de compte ? <Link to="/register">Inscrivez-vous ici</Link>.
      </p>
    </section>
  );
}
