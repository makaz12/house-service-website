import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/book");
    } catch (err) {
      setError(err?.response?.data?.message || "Inscription impossible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <h1>Creer un compte</h1>
      <form className="form" onSubmit={onSubmit}>
        <label>Nom complet</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <label>E-mail</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <label>Telephone</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
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
          {loading ? "Creation..." : "S'inscrire"}
        </button>
      </form>
      <p>
        Vous avez deja un compte ? <Link to="/login">Connectez-vous</Link>.
      </p>
    </section>
  );
}
