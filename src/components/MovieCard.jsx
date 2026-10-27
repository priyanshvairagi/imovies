import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Globe, Ticket, Calendar, Play } from "lucide-react";
import "./MovieCard.css";

export default function MovieCard({ movie, size = "md", featured = false }) {
  const navigate = useNavigate();
  if (!movie) return null;
  const movieId = movie._id || movie.id;
  const {
    title,
    genre = [],
    language,
    rating,
    duration,
    poster,
    status,
    certificate,
    price = 250,
    releaseDate,
    votes,
  } = movie;

  return (
    <Link
      to={`/movie/${movieId}`}
      className={`cinema-card cinema-card--${size}${featured ? " cinema-card--featured" : ""}`}
      id={`movie-card-${movieId}`}
    >
      {/* Poster Image & Badges */}
      <div className="cinema-card__media">
        <img
          src={poster}
          alt={title}
          className="cinema-card__img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop`;
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="cinema-card__scrim" />

        {/* Floating Badges */}
        <div className="cinema-card__top-bar">
          <span
            className={`cinema-card__status-tag cinema-card__status-tag--${
              status === "now_showing" ? "now" : "upcoming"
            }`}
          >
            {status === "now_showing" ? "Now Showing" : "Upcoming"}
          </span>

          {certificate && (
            <span className="cinema-card__cert-badge">{certificate}</span>
          )}
        </div>

        {/* Rating Pill */}
        <div className="cinema-card__rating-pill">
          <Star size={12} className="cinema-card__star-icon" />
          <span className="cinema-card__rating-value">{rating || "N/A"}</span>
          {votes && <span className="cinema-card__votes-count">({votes})</span>}
        </div>

        {/* Center Hover Action */}
        <div className="cinema-card__hover-curtain">
          <span className="cinema-card__play-bubble">
            <Play size={20} fill="currentColor" />
          </span>
          <span className="cinema-card__hover-text">View Details</span>
        </div>
      </div>

      {/* Movie Details Body */}
      <div className="cinema-card__body">
        <h3 className="cinema-card__title" title={title}>
          {title}
        </h3>

        <div className="cinema-card__meta-row">
          <span className="cinema-card__meta-item">
            <Globe size={13} />
            {language}
          </span>
          <span className="cinema-card__meta-divider">•</span>
          <span className="cinema-card__meta-item">
            <Clock size={13} />
            {duration}
          </span>
        </div>

        {/* Genre Tags */}
        <div className="cinema-card__genre-strip">
          {Array.isArray(genre) &&
            genre.slice(0, 2).map((g) => (
              <span key={g} className="cinema-card__genre-chip">
                {g}
              </span>
            ))}
        </div>

        {/* Bottom CTA Row */}
        <div className="cinema-card__cta-row">
          <div className="cinema-card__price-tag">
            <span className="cinema-card__price-label">Tickets from</span>
            <span className="cinema-card__price-amount">₹{price}</span>
          </div>

          <button
            type="button"
            className="cinema-card__action-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/movie/${movieId}?book=true`);
            }}
            aria-label={`Book tickets for ${title}`}
          >
            <Ticket size={14} />
            <span>Book</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
