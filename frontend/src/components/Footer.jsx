import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <Link to="/">Services</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/feedback">Avis clients</Link>
        <Link to="/about">A propos</Link>
        <Link to="/call-agent">Assistance</Link>
      </div>
      <p className="muted">© 2026 FixNow Habitat. Tous droits reserves.</p>
    </footer>
  );
}
