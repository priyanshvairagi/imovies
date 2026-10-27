import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  Film,
  Bell,
  MessageSquare,
  Ticket,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setUserDropdown(false);
  }, [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/movies", label: "Movies" },
    { to: "/theatres", label: "Theatres" },
    { to: "/my-bookings", label: "Orders" },
  ];

  return (
    <header className="ref-navbar">
      <div className="ref-navbar__inner">
        {/* Brand / Logo */}
        <Link to="/" className="ref-navbar__logo" id="navbar-logo">
          <span className="ref-navbar__logo-icon">
            <Film size={20} />
          </span>
          <span className="ref-navbar__logo-text">
            i<span className="ref-navbar__logo-accent">Movies</span>
          </span>
        </Link>

        {/* Center Compact Pill Menu */}
        <nav className="ref-navbar__nav" aria-label="Main Navigation">
          <ul className="ref-navbar__pill-menu">
            {navLinks.map((link) => {
              const isActive =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`ref-navbar__pill-item ${
                      isActive ? "ref-navbar__pill-item--active" : ""
                    }`}
                    id={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right utility controls */}
        <div className="ref-navbar__right">
          <button
            type="button"
            className="ref-navbar__icon-btn"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="ref-navbar__dot" />
          </button>

          <Link
            to="/my-bookings"
            className="ref-navbar__icon-btn"
            aria-label="Messages / Orders"
            title="Orders & Tickets"
          >
            <MessageSquare size={16} />
          </Link>

          {user ? (
            <div className="ref-navbar__user-wrap">
              <button
                type="button"
                className="ref-navbar__avatar-btn"
                onClick={() => setUserDropdown((v) => !v)}
                id="navbar-user-btn"
              >
                <div className="ref-navbar__avatar">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="ref-navbar__username">
                  {user.name?.split(" ")[0]}
                </span>
                <ChevronDown size={13} />
              </button>
              {userDropdown && (
                <div className="ref-navbar__dropdown" id="navbar-dropdown">
                  <Link to="/my-bookings" className="ref-navbar__dropdown-item">
                    <Ticket size={14} /> My Bookings
                  </Link>
                  <button
                    type="button"
                    className="ref-navbar__dropdown-item ref-navbar__dropdown-item--danger"
                    onClick={logout}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ref-navbar__auth-links">
              <Link to="/login" className="ref-navbar__auth-btn ref-navbar__auth-btn--ghost" id="navbar-login">
                Sign in
              </Link>
              <Link to="/register" className="ref-navbar__auth-btn ref-navbar__auth-btn--primary" id="navbar-register">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="ref-navbar__hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="ref-navbar__mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`ref-navbar__mobile-link ${
                location.pathname === link.to ? "ref-navbar__mobile-link--active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="ref-navbar__mobile-auth">
              <Link to="/login" className="ref-navbar__auth-btn ref-navbar__auth-btn--ghost">
                Sign in
              </Link>
              <Link to="/register" className="ref-navbar__auth-btn ref-navbar__auth-btn--primary">
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Thin divider beneath navigation */}
      <div className="ref-navbar__divider" />
    </header>
  );
}
