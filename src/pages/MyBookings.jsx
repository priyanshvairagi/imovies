import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ticket, Calendar, MapPin, Clock, CheckCircle, XCircle,
  Film, ArrowRight, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./MyBookings.css";

export default function MyBookings() {
  const { user, bookings, bookingsLoading, cancelBooking, fetchBookings } = useApp();

  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError]   = useState(null);

  // Refresh bookings when the page mounts (user may have booked on another page)
  useEffect(() => {
    if (user) fetchBookings();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className="my-bookings">
        <div className="my-bookings__empty-auth">
          <Film size={60} />
          <h2>Sign In to View Bookings</h2>
          <p>You need to be logged in to see your ticket history.</p>
          <div className="my-bookings__empty-actions">
            <Link to="/login"    className="my-bookings__btn-primary" id="mb-login-btn">Sign In</Link>
            <Link to="/register" className="my-bookings__btn-ghost"   id="mb-register-btn">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();

  const isConfirmedPaid = (b) => b.status === "confirmed" && b.paymentStatus === "paid";
  const isFailedOrExpired = (b) =>
    b.status === "expired" ||
    b.paymentStatus === "failed" ||
    (b.status === "pending_payment" && b.expiresAt && new Date(b.expiresAt) <= now);

  // Active upcoming tickets: strictly future showtime, not cancelled, not expired/failed, must be confirmed & paid (or active pending hold)
  const upcoming = bookings.filter((b) => {
    if (b.status === "cancelled") return false;
    if (isFailedOrExpired(b)) return false;
    const start = b.showtime?.startTime ? new Date(b.showtime.startTime) : null;
    if (start && start < now) return false;
    return isConfirmedPaid(b) || b.status === "pending_payment";
  });

  // History: past shows, plus failed/expired records
  const past = bookings.filter((b) => {
    if (b.status === "cancelled") return false;
    if (upcoming.some((u) => (u._id || u.id) === (b._id || b.id))) return false;
    return true;
  });

  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const formatTime = (iso) =>
    iso ? new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : "";

  const handleCancel = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This cannot be undone.")) return;
    const bookingId = booking._id || booking.id;
    setCancellingId(bookingId);
    setCancelError(null);
    try {
      await cancelBooking(bookingId, "Cancelled by user");
    } catch (err) {
      setCancelError(err.message || "Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (booking) => {
    if (!isConfirmedPaid(booking)) return false;
    const start = booking.showtime?.startTime ? new Date(booking.showtime.startTime) : null;
    return start ? start > now : false;
  };

  const getBadgeInfo = (booking, isPastShow) => {
    if (booking.status === "cancelled") {
      return {
        label: "Cancelled",
        icon: <XCircle size={13} />,
        className: "booking-card__badge booking-card__badge--past",
      };
    }
    if (booking.status === "expired" || booking.paymentStatus === "failed") {
      return {
        label: booking.status === "expired" ? "Expired (Unpaid)" : "Payment Failed",
        icon: <XCircle size={13} />,
        className: "booking-card__badge",
        style: {
          background: "rgba(245, 34, 45, 0.12)",
          color: "#ff4d4f",
          border: "1px solid rgba(245, 34, 45, 0.3)",
        },
      };
    }
    if (booking.status === "pending_payment") {
      return {
        label: "Payment Pending",
        icon: <Clock size={13} />,
        className: "booking-card__badge",
        style: {
          background: "rgba(245, 197, 24, 0.12)",
          color: "#f5c518",
          border: "1px solid rgba(245, 197, 24, 0.3)",
        },
      };
    }
    if (isConfirmedPaid(booking)) {
      if (isPastShow) {
        return {
          label: "Past",
          icon: <Clock size={13} />,
          className: "booking-card__badge booking-card__badge--past",
        };
      }
      return {
        label: "Confirmed",
        icon: <CheckCircle size={13} />,
        className: "booking-card__badge booking-card__badge--upcoming",
      };
    }
    return {
      label: isPastShow ? "Past" : "Pending",
      icon: <Clock size={13} />,
      className: "booking-card__badge booking-card__badge--past",
    };
  };

  const getPaymentStyle = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return { background: "rgba(0, 200, 83, 0.15)", color: "#00c853" };
      case "refunded":
        return { background: "rgba(100, 100, 255, 0.15)", color: "#9fa8da" };
      case "failed":
        return { background: "rgba(245, 34, 45, 0.15)", color: "#f5222d" };
      case "pending":
      default:
        return { background: "rgba(255, 180, 0, 0.15)", color: "#ffb300" };
    }
  };

  const BookingCard = ({ booking, isPast, isCancelled }) => {
    const bookingId = booking._id || booking.id;
    const isCancelling = cancellingId === bookingId;
    const seats = booking.seats?.map((s) => s.seatId).join(", ") || "—";
    const theatre = booking.theatre?.name || "—";
    const screenName = booking.screen?.name || "";
    const movieTitle = booking.movie?.title || "Movie";
    const moviePoster = booking.movie?.poster || `https://placehold.co/80x120/1a1a1a/555?text=${encodeURIComponent(movieTitle)}`;
    const showStart = booking.showtime?.startTime;
    const isPastShow = showStart ? new Date(showStart) < now : isPast;

    const badge = getBadgeInfo(booking, isPastShow);
    const paymentStyle = getPaymentStyle(booking.paymentStatus);

    return (
      <div
        className={`booking-card${isPast || isCancelled || isFailedOrExpired(booking) ? " booking-card--past" : ""}`}
        id={`booking-card-${bookingId}`}
      >
        <div className="booking-card__status-bar" />
        <div className="booking-card__inner">
          <img
            src={moviePoster}
            alt={movieTitle}
            className="booking-card__poster"
            onError={(e) => { e.target.src = `https://placehold.co/80x120/1a1a1a/555?text=Movie`; }}
          />
          <div className="booking-card__info">
            <div className="booking-card__header">
              <h3 className="booking-card__title">{movieTitle}</h3>
              <span className={badge.className} style={badge.style}>
                {badge.icon} {badge.label}
              </span>
            </div>

            <div className="booking-card__meta">
              {theatre && <span><MapPin size={13} /> {theatre}{screenName ? ` · ${screenName}` : ""}</span>}
              {showStart && <span><Calendar size={13} /> {formatDate(showStart)}</span>}
              {showStart && <span><Clock size={13} /> {formatTime(showStart)}</span>}
              <span><Ticket size={13} /> Seats: {seats}</span>
            </div>

            <div className="booking-card__footer">
              <div>
                <span className="booking-card__ref">Ref: {booking.bookingRef}</span>
                <span className="booking-card__price">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
                {/* Payment badge */}
                <span style={{
                  fontSize: "0.72rem",
                  padding: "0.15rem 0.5rem",
                  borderRadius: 4,
                  ...paymentStyle,
                }}>
                  Payment: {booking.paymentStatus || "pending"}
                </span>
                {canCancel(booking) && (
                  <button
                    className="booking-card__cancel-btn"
                    onClick={() => handleCancel(booking)}
                    disabled={isCancelling}
                    id={`cancel-booking-${bookingId}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    {isCancelling ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Cancelling...</> : "Cancel Booking"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ticket perforation */}
        <div className="booking-card__perforation">
          <div className="booking-card__perf-circle booking-card__perf-circle--left" />
          <div className="booking-card__perf-line" />
          <div className="booking-card__perf-circle booking-card__perf-circle--right" />
        </div>
        <div className="booking-card__qr">
          <div className="booking-card__qr-inner">
            {Array.from({ length: 25 }, (_, i) => (
              <div key={i} className="booking-card__qr-cell" style={{ background: (bookingId?.charCodeAt(i % bookingId.length) || i) % 2 === 0 ? "#fff" : "transparent" }} />
            ))}
          </div>
          <span>Scan at gate</span>
        </div>
      </div>
    );
  };

  return (
    <div className="my-bookings">
      <div className="my-bookings__header">
        <div className="my-bookings__header-inner">
          <div>
            <h1>My Bookings</h1>
            <p>
              Welcome back, <strong>{user.name}</strong> ·{" "}
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
            <button
              onClick={fetchBookings}
              disabled={bookingsLoading}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "0.45rem 0.9rem", borderRadius: 8, cursor: "pointer", fontSize: "0.83rem" }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <Link to="/movies" className="my-bookings__btn-primary" id="browse-movies-btn">
              Browse Movies <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <div className="my-bookings__body">
        {cancelError && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.25)", borderRadius: 8, padding: "0.7rem 1rem", marginBottom: "1rem", color: "#ff6b6b", fontSize: "0.88rem" }}>
            <AlertCircle size={16} color="#e50914" />
            {cancelError}
          </div>
        )}

        {bookingsLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "4rem 0", color: "rgba(255,255,255,0.6)" }}>
            <Loader2 size={40} style={{ animation: "spin 1s linear infinite" }} />
            <p>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="my-bookings__empty">
            <Ticket size={64} />
            <h2>No Bookings Yet</h2>
            <p>You haven&apos;t booked any tickets. Start exploring movies!</p>
            <Link to="/movies" className="my-bookings__btn-primary" id="empty-browse-btn">Explore Movies</Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="my-bookings__section" id="upcoming-bookings">
                <h2 className="my-bookings__section-title"><CheckCircle size={18} /> Upcoming ({upcoming.length})</h2>
                <div className="my-bookings__list">
                  {upcoming.map((b) => <BookingCard key={b._id || b.id} booking={b} isPast={false} isCancelled={false} />)}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="my-bookings__section" id="past-bookings">
                <h2 className="my-bookings__section-title"><Clock size={18} /> History ({past.length})</h2>
                <div className="my-bookings__list">
                  {past.map((b) => <BookingCard key={b._id || b.id} booking={b} isPast={true} isCancelled={false} />)}
                </div>
              </section>
            )}

            {cancelled.length > 0 && (
              <section className="my-bookings__section" id="cancelled-bookings">
                <h2 className="my-bookings__section-title"><XCircle size={18} /> Cancelled ({cancelled.length})</h2>
                <div className="my-bookings__list">
                  {cancelled.map((b) => <BookingCard key={b._id || b.id} booking={b} isPast={false} isCancelled={true} />)}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
