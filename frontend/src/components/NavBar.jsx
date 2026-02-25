import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { t } from "../lib/i18n";
import { displayServiceName } from "../lib/services";

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, language } = useAuth();
  const [services, setServices] = useState([]);
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const serviceMenuRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/services")
      .then((response) => {
        if (!mounted) return;
        setServices(response.data.services || []);
      })
      .catch(() => {
        if (!mounted) return;
        setServices([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!serviceMenuRef.current) return;
      if (!serviceMenuRef.current.contains(event.target)) {
        setIsServiceMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocumentClick);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, []);

  return (
    <header className="nav">
      <div className="nav-brand">
        <Link to="/">FixNow</Link>
      </div>
      <nav className="nav-links">
        <div
          className={`service-menu ${isServiceMenuOpen ? "menu-open" : ""}`}
          ref={serviceMenuRef}
        >
          <button
            className="nav-menu-btn"
            type="button"
            onClick={() => setIsServiceMenuOpen((prev) => !prev)}
            aria-expanded={isServiceMenuOpen}
          >
            {t(language, "services")}
          </button>
          <div className="service-menu-list">
            <Link
              to="/"
              onClick={() => {
                setIsServiceMenuOpen(false);
              }}
            >
              {t(language, "allServices")}
            </Link>
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/book?serviceId=${service.id}`}
                onClick={() => {
                  setIsServiceMenuOpen(false);
                }}
              >
                {displayServiceName(service.name)}
              </Link>
            ))}
          </div>
        </div>
        <Link to="/blog">{t(language, "blog")}</Link>
        <Link to="/feedback">{t(language, "feedback")}</Link>
        <Link to="/about">{t(language, "about")}</Link>
        <Link to="/call-agent">{t(language, "callAgent")}</Link>
        {isAuthenticated && <Link to="/book">{t(language, "book")}</Link>}
        {isAuthenticated && <Link to="/dashboard">{t(language, "dashboard")}</Link>}
      </nav>
      <div className="nav-auth">
        {isAuthenticated ? (
          <>
            <Link className="settings-icon-btn" to="/settings" title={t(language, "settings")}>
              ⚙
            </Link>
            <span className="user-pill">{user?.name}</span>
            <button
              className="secondary-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              {t(language, "logout")}
            </button>
          </>
        ) : (
          <>
            <Link className="secondary-btn link-btn" to="/login">
              {t(language, "login")}
            </Link>
            <Link className="primary-btn link-btn" to="/register">
              {t(language, "register")}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
