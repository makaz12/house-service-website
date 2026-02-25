import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api, authHeaders } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { displayServiceName } from "../lib/services";

export default function DashboardPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/appointments/me", {
        headers: authHeaders(token),
      });
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible de charger les reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    setError("");
    try {
      await api.patch(
        `/appointments/${id}/cancel`,
        {},
        { headers: authHeaders(token) }
      );
      await fetchAppointments();
    } catch (err) {
      setError(err?.response?.data?.message || "Impossible d'annuler la reservation.");
    }
  };

  return (
    <section className="page">
      <h1>Mes reservations</h1>
      {loading && <p>Chargement...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && appointments.length === 0 && (
        <p className="muted">Aucune reservation pour l'instant. Ouvrez "Reserver" pour commencer.</p>
      )}

      <div className="cards-grid">
        {appointments.map((item) => (
          <article key={item.id} className="service-card">
            <h3>{displayServiceName(item.service?.name || "Service")}</h3>
            <p>{dayjs(item.scheduledAt).format("ddd, MMM D, YYYY h:mm A")}</p>
            <p className="muted">{item.location?.addressText}</p>
            <p>Statut : {item.status}</p>
            {item.status !== "CANCELLED" && (
              <button
                className="secondary-btn"
                onClick={() => cancelAppointment(item.id)}
              >
                Annuler
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
