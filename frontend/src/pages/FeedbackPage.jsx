import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api, authHeaders } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function stars(rating) {
  return "*".repeat(rating) + "-".repeat(5 - rating);
}

export default function FeedbackPage() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    rating: 5,
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const response = await api.get("/feedback", { params: { limit: 12 } });
      setItems(response.data.feedback || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les avis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post(
        "/feedback",
        {
          ...form,
          rating: Number(form.rating),
        },
        { headers: authHeaders(token) }
      );
      setSuccess("Avis envoye. Merci pour votre retour.");
      setForm((prev) => ({ ...prev, rating: 5, message: "" }));
      await loadFeedback();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible d'envoyer l'avis.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page">
      <h1>Avis clients</h1>
      <div className="preview-grid">
        <form className="form card animate-rise" onSubmit={onSubmit}>
          <h3>Partagez votre experience</h3>
          <label>Nom</label>
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
          <label>Note</label>
          <select
            value={form.rating}
            onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
          <label>Message</label>
          <textarea
            required
            minLength={10}
            rows="4"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          />
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button className="primary-btn" disabled={saving}>
            {saving ? "Envoi..." : "Envoyer l'avis"}
          </button>
        </form>

        <section className="card animate-rise">
          <h3>Avis recents</h3>
          {loading && <p>Chargement...</p>}
          {!loading && items.length === 0 && (
            <p className="muted">Aucun avis pour le moment.</p>
          )}
          <div className="feedback-list">
            {items.map((item) => (
              <article className="feedback-item" key={item.id}>
                <p className="rating">{stars(item.rating)}</p>
                <p>{item.message}</p>
                <p className="muted">
                  {item.name || item.user?.name || "Client"} -{" "}
                  {dayjs(item.createdAt).format("MMM D, YYYY")}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
