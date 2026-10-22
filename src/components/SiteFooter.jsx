import { Link } from "react-router-dom";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>© {new Date().getFullYear()} Twingle.Live</span>
        <nav aria-label="Company and legal">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/refund-policy">Refunds</Link>
          <Link to="/shipping-policy">Delivery</Link>
          <Link to="/pricing">Pricing</Link>
        </nav>
      </div>
    </footer>
  );
}
