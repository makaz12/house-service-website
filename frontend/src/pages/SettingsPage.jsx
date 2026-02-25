import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const themes = [
  { value: "ocean", label: "Bleu ocean" },
  { value: "sunset", label: "Soleil couchant" },
  { value: "forest", label: "Vert foret" },
];

const languages = [
  { value: "fr", label: "Francais" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    theme: user?.theme || "ocean",
    language: user?.language || "fr",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dangerLoading, setDangerLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile({
        ...form,
        phone: form.phone || null,
      });
      setSuccess("Parametres mis a jour.");
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de mettre a jour les parametres.");
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAccount = async (event) => {
    event.preventDefault();
    if (!password) {
      setError("Saisissez votre mot de passe pour supprimer le compte.");
      return;
    }
    setDangerLoading(true);
    setError("");
    try {
      await deleteAccount(password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de supprimer le compte.");
    } finally {
      setDangerLoading(false);
    }
  };

  return (
    <section className="page">
      <h1>Parametres</h1>

      <div className="preview-grid">
        <form className="form card animate-rise" onSubmit={onSave}>
          <h3>Profil et preferences</h3>
          <label>Nom complet</label>
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <label>E-mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <label>Telephone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <label>Theme</label>
          <select
            value={form.theme}
            onChange={(e) => setForm((prev) => ({ ...prev, theme: e.target.value }))}
          >
            {themes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <label>Langue</label>
          <select
            value={form.language}
            onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value }))}
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button className="primary-btn" disabled={loading}>
            {loading ? "Sauvegarde..." : "Enregistrer les parametres"}
          </button>
        </form>

        <form className="form card danger-card animate-rise" onSubmit={onDeleteAccount}>
          <h3>Supprimer le compte</h3>
          <p className="muted">
            Cette action est definitive. Vos reservations et votre profil seront supprimes.
          </p>
          <label>Confirmer avec le mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="danger-btn" disabled={dangerLoading}>
            {dangerLoading ? "Suppression..." : "Supprimer mon compte"}
          </button>
        </form>
      </div>
    </section>
  );
}
