import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { displayServiceDescription, displayServiceName } from "../lib/services";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let active = true;
    api
      .get("/services")
      .then((response) => {
        if (!active) return;
        setServices(response.data.services || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || "Impossible de charger les services.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    api
      .get("/feedback", { params: { limit: 3 } })
      .then((response) => {
        if (!active) return;
        setFeedback(response.data.feedback || []);
      })
      .catch(() => {
        if (!active) return;
        setFeedback([]);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="page">
      <div className="hero animate-rise">
        <div className="hero-glow" />
        <h1>Des experts habitat fiables, au bon moment</h1>
        <p>
          Plomberie, peinture, carrelage, electricite et plus. Reservez en ligne
          en quelques clics ou demandez un rappel par un agent.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <Link className="primary-btn link-btn" to="/book">
              Commencer une reservation
            </Link>
          ) : (
            <Link className="primary-btn link-btn" to="/register">
              Creer un compte
            </Link>
          )}
          <Link className="secondary-btn link-btn" to="/call-agent">
            Preferer un appel ?
          </Link>
        </div>
      </div>

      <h2>Services disponibles</h2>
      {loading && <p>Chargement des services...</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="cards-grid">
        {services.map((service, index) => (
          <Link
            className="service-card animated-card service-link-card"
            to={`/book?serviceId=${service.id}`}
            key={service.id}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {service.imageUrl && (
              <img
                className="service-image"
                src={service.imageUrl}
                alt={displayServiceName(service.name)}
                onError={(event) => {
                  event.currentTarget.src =
                    "https://images.pexels.com/photos/6474475/pexels-photo-6474475.jpeg?auto=compress&cs=tinysrgb&w=1200";
                }}
              />
            )}
            <h3>{displayServiceName(service.name)}</h3>
            <p>{displayServiceDescription(service.description)}</p>
            <p className="price">${Number(service.basePrice).toFixed(2)}</p>
            <p className="muted">{service.durationMin} min de duree estimee</p>
            <span className="muted">Cliquer pour reserver ce service</span>
          </Link>
        ))}
      </div>

      <section className="feature-strip animate-fade">
        <article>
          <h3>Intervention rapide</h3>
          <p>Disponibilites en direct et confirmation immediate.</p>
        </article>
        <article>
          <h3>Localisation precise</h3>
          <p>Coordonnees Google Maps pour des deplacements fiables.</p>
        </article>
        <article>
          <h3>Support au choix</h3>
          <p>Reservation autonome ou assistance telephonique par agent.</p>
        </article>
      </section>

      <section className="preview-grid">
        <article className="card animate-rise">
          <h3>Depuis notre blog</h3>
          <p>Conseils pratiques d'entretien et checklists saisonnieres.</p>
          <Link className="secondary-btn link-btn" to="/blog">
            Lire les articles
          </Link>
        </article>
        <article className="card animate-rise">
          <h3>Avis clients</h3>
          {feedback.length === 0 && <p className="muted">Aucun avis pour le moment.</p>}
          {feedback.map((item) => (
            <p key={item.id} className="quote-line">
              "{item.message.slice(0, 70)}..." - {item.name || item.user?.name || "Client"}
            </p>
          ))}
          <Link className="secondary-btn link-btn" to="/feedback">
            Voir les avis
          </Link>
        </article>
      </section>
    </section>
  );
}
