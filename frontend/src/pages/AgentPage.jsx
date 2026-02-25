import { useState } from "react";
import { api, authHeaders } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AgentPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    phone: "",
    preferredTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post(
        "/agent-requests",
        {
          phone: form.phone,
          preferredTime: form.preferredTime || undefined,
          message: form.message || undefined,
        },
        { headers: authHeaders(token) }
      );
      setSuccess("Demande envoyee. Un agent vous rappelle rapidement.");
      setForm({ phone: "", preferredTime: "", message: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible d'envoyer la demande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <h1>Contacter un agent</h1>
      <p className="muted">
        Vous preferez reserver par telephone ? Laissez vos coordonnees et nous vous rappelons.
      </p>
      <p>
        Assistance immediate : <a href="tel:+10000000000">+1 (000) 000-0000</a>
      </p>
      <form className="form card" onSubmit={onSubmit}>
        <label>Numero de telephone</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
        />
        <label>Heure de rappel souhaitee (optionnel)</label>
        <input
          type="datetime-local"
          value={form.preferredTime}
          onChange={(e) => {
            const iso = e.target.value
              ? new Date(e.target.value).toISOString()
              : "";
            setForm((prev) => ({ ...prev, preferredTime: iso }));
          }}
        />
        <label>Message (optionnel)</label>
        <textarea
          rows="4"
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        />
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <button className="primary-btn" disabled={loading}>
          {loading ? "Envoi..." : "Demander un rappel"}
        </button>
      </form>
    </section>
  );
}
