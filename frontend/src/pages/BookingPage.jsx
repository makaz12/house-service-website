import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { api, authHeaders } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { displayServiceName } from "../lib/services";

const mapContainerStyle = { width: "100%", height: "280px" };
const defaultCenter = { lat: 40.7128, lng: -74.006 };
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

function dateOptions() {
  return Array.from({ length: 10 }).map((_, index) => {
    const value = dayjs().add(index, "day").format("YYYY-MM-DD");
    return { value, label: dayjs(value).format("ddd, MMM D") };
  });
}

export default function BookingPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    serviceId: "",
    date: dayjs().format("YYYY-MM-DD"),
    scheduledAt: "",
    addressText: "",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    placeId: "",
    notes: "",
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });

  const selectedService = useMemo(
    () => services.find((service) => service.id === Number(form.serviceId)),
    [services, form.serviceId]
  );

  useEffect(() => {
    api
      .get("/services")
      .then((response) => {
        const nextServices = response.data.services || [];
        setServices(nextServices);
        const serviceFromQuery = searchParams.get("serviceId");
        const exists = nextServices.some(
          (service) => service.id === Number(serviceFromQuery)
        );
        if (serviceFromQuery && exists) {
          setForm((prev) => ({ ...prev, serviceId: String(serviceFromQuery) }));
        }
      })
      .catch(() => setError("Impossible de charger les services."));
  }, [searchParams]);

  useEffect(() => {
    if (!form.serviceId || !form.date) return;
    setLoadingSlots(true);
    setError("");
    setMessage("");
    setAvailableSlots([]);
    setForm((prev) => ({ ...prev, scheduledAt: "" }));

    api
      .get(`/services/${form.serviceId}/availability`, {
        params: { date: form.date },
      })
      .then((response) => {
        setAvailableSlots(response.data.availableSlots || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Impossible de charger les horaires.");
      })
      .finally(() => setLoadingSlots(false));
  }, [form.serviceId, form.date]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await api.post(
        "/appointments",
        {
          serviceId: Number(form.serviceId),
          scheduledAt: form.scheduledAt,
          notes: form.notes || undefined,
          location: {
            addressText: form.addressText,
            lat: Number(form.lat),
            lng: Number(form.lng),
            placeId: form.placeId || undefined,
          },
        },
        {
          headers: authHeaders(token),
        }
      );

      setMessage("Reservation confirmee avec succes.");
      setForm((prev) => ({ ...prev, scheduledAt: "", notes: "" }));
    } catch (err) {
      setError(err?.response?.data?.message || "La reservation a echoue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <h1>Reserver un service</h1>
      <p className="muted">
        Choisissez un service, un horaire disponible et l'adresse d'intervention.
      </p>

      <form className="form card" onSubmit={onSubmit}>
        <label>Service</label>
        <select
          required
          value={form.serviceId}
          onChange={(e) => setForm((prev) => ({ ...prev, serviceId: e.target.value }))}
        >
          <option value="">Selectionner un service</option>
          {services.map((service) => (
            <option value={service.id} key={service.id}>
              {displayServiceName(service.name)} (${Number(service.basePrice).toFixed(2)})
            </option>
          ))}
        </select>

        <label>Date</label>
        <select
          required
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
        >
          {dateOptions().map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>

        <label>Horaires disponibles</label>
        {loadingSlots && <p>Chargement des horaires...</p>}
        {!loadingSlots && availableSlots.length === 0 && (
          <p className="muted">Aucun horaire disponible pour cette date.</p>
        )}
        {!loadingSlots && availableSlots.length > 0 && (
          <div className="slots">
            {availableSlots.map((slot) => (
              <button
                type="button"
                key={slot}
                className={
                  form.scheduledAt === slot ? "slot-btn active-slot" : "slot-btn"
                }
                onClick={() => setForm((prev) => ({ ...prev, scheduledAt: slot }))}
              >
                {dayjs(slot).format("h:mm A")}
              </button>
            ))}
          </div>
        )}

        {selectedService && (
          <p className="muted">Duree estimee : {selectedService.durationMin} minutes</p>
        )}

        <label>Adresse</label>
        <input
          required
          placeholder="Rue, ville, code postal"
          value={form.addressText}
          onChange={(e) => setForm((prev) => ({ ...prev, addressText: e.target.value }))}
        />

        <div className="two-col">
          <div>
            <label>Latitude</label>
            <input
              type="number"
              step="any"
              required
              value={form.lat}
              onChange={(e) => setForm((prev) => ({ ...prev, lat: e.target.value }))}
            />
          </div>
          <div>
            <label>Longitude</label>
            <input
              type="number"
              step="any"
              required
              value={form.lng}
              onChange={(e) => setForm((prev) => ({ ...prev, lng: e.target.value }))}
            />
          </div>
        </div>

        <label>Google Place ID (optionnel)</label>
        <input
          value={form.placeId}
          onChange={(e) => setForm((prev) => ({ ...prev, placeId: e.target.value }))}
        />

        {googleMapsApiKey ? (
          <div className="map-wrap">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: Number(form.lat), lng: Number(form.lng) }}
                zoom={12}
                onClick={(event) => {
                  const lat = event.latLng?.lat();
                  const lng = event.latLng?.lng();
                  if (typeof lat === "number" && typeof lng === "number") {
                    setForm((prev) => ({ ...prev, lat, lng }));
                  }
                }}
              >
                <Marker position={{ lat: Number(form.lat), lng: Number(form.lng) }} />
              </GoogleMap>
            ) : (
              <p>Chargement de la carte...</p>
            )}
          </div>
        ) : (
          <p className="muted">
            Ajoutez `VITE_GOOGLE_MAPS_API_KEY` dans `frontend/.env` pour activer la carte.
          </p>
        )}

        <label>Notes (optionnel)</label>
        <textarea
          rows="4"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />

        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}

        <button
          className="primary-btn"
          disabled={submitting || !form.serviceId || !form.scheduledAt}
        >
          {submitting ? "Reservation..." : "Confirmer la reservation"}
        </button>
      </form>
    </section>
  );
}
