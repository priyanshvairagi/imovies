import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Play,
  Heart,
  Star,
  Clock,
  Globe,
  Calendar,
  Ticket,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { movieAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import "./Home.css";

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [readMore, setReadMore] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { setSearchQuery } = useApp();

  // Load favorites from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("imovies_favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // Ignore
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("imovies_favorites", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const fetchHomeMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await movieAPI.getMovies({ limit: 50 });
      if (data && Array.isArray(data.movies)) {
        setMovies(data.movies);
      } else {
        setError("Invalid response received from the movie service.");
      }
    } catch (err) {
      console.warn("API server connecting or offline:", err);
      setError(err.message || "Failed to load movies from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeMovies();
  }, []);

  // Split movies by status / trending
  const trending = movies.filter((m) => m.trending);
  const activeHeroList = trending.length > 0 ? trending.slice(0, 5) : movies.slice(0, 5);
  const upcoming = movies.filter((m) => m.status === "upcoming");
  const currentHero = activeHeroList[heroIdx];

  // Auto-advance hero carousel
  useEffect(() => {
    if (activeHeroList.length <= 1) return;
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % activeHeroList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeHeroList.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
      navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const currentHeroId = currentHero ? currentHero._id || currentHero.id : null;
  const isFav = currentHeroId && !!favorites[currentHeroId];

  return (
    <div className="ref-home">
      {/* ── Loading State ── */}
      {loading && (
        <div className="ref-home__loading">
          <div className="auth-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p>Curating cinema blockbusters…</p>
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <div className="ref-home__error">
          <AlertCircle size={44} color="#F5222D" />
          <h2>Unable to load cinema catalog</h2>
          <p>{error}</p>
          <button onClick={fetchHomeMovies} className="ref-home__retry-btn">
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && movies.length === 0 && (
        <div className="ref-home__empty">
          <AlertCircle size={44} color="#71717A" />
          <h2>No Movies Available</h2>
          <p>There are currently no movies available in the database catalogue.</p>
          <button onClick={fetchHomeMovies} className="ref-home__retry-btn">
            <RefreshCw size={15} /> Reload
          </button>
        </div>
      )}

      {/* ── Main Reference Layout ── */}
      {!loading && !error && currentHero && (
        <div className="ref-home__container">
          {/* 1. Search and Utility Row */}
          <div className="ref-utility-row">
            {/* Current Date */}
            <div className="ref-utility-row__date">
              <Calendar size={14} className="ref-utility-row__icon-muted" />
              <span>{formattedDate}</span>
            </div>

            {/* Filter Dropdown */}
            <div className="ref-utility-row__filter-wrap">
              <SlidersHorizontal size={14} className="ref-utility-row__icon-muted" />
              <select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  if (e.target.value !== "all") {
                    navigate(`/movies?filter=${e.target.value}`);
                  }
                }}
                className="ref-utility-row__select"
                aria-label="Filter movies"
              >
                <option value="all">All Movies</option>
                <option value="now_showing">Now Showing</option>
                <option value="upcoming">Upcoming Releases</option>
                <option value="trending">Trending Titles</option>
              </select>
              <ChevronDown size={13} className="ref-utility-row__chevron" />
            </div>

            {/* Search Input Pill */}
            <form onSubmit={handleSearch} className="ref-utility-row__search-form">
              <Search size={15} className="ref-utility-row__search-icon" />
              <input
                type="text"
                placeholder="Search movies, actors, directors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="ref-utility-row__search-input"
                id="home-search-input"
              />
              {query && (
                <button
                  type="button"
                  className="ref-utility-row__search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </form>
          </div>

          {/* 2. Featured Movie Artwork Panel */}
          <section className="ref-featured-artwork" id="featured-movie-artwork">
            {/* Background Backdrop Layer */}
            <div
              className="ref-featured-artwork__image"
              style={{
                backgroundImage: `url(${currentHero.backdrop || currentHero.poster})`,
              }}
            />

            {/* Cinematic Gradient Vignette Overlays */}
            <div className="ref-featured-artwork__overlay" />

            {/* Top-Left Circular Favorite Control */}
            <button
              type="button"
              className={`ref-featured-artwork__fav-btn ${
                isFav ? "ref-featured-artwork__fav-btn--active" : ""
              }`}
              onClick={() => toggleFavorite(currentHeroId)}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
              id="hero-fav-btn"
            >
              <Heart
                size={18}
                fill={isFav ? "#F5222D" : "none"}
                color={isFav ? "#F5222D" : "#F5F5F5"}
              />
            </button>

            {/* Vertical Thumbnail Selector along the right side */}
            {activeHeroList.length > 1 && (
              <aside
                className="ref-featured-artwork__thumbs"
                aria-label="Featured Movie Playlist"
              >
                <div className="ref-featured-artwork__thumbs-header">
                  <span>Featured Playlist</span>
                  <span>{heroIdx + 1} / {activeHeroList.length}</span>
                </div>
                {activeHeroList.map((m, i) => {
                  const mId = m._id || m.id || i;
                  const isSelected = i === heroIdx;
                  return (
                    <button
                      key={mId}
                      type="button"
                      className={`ref-featured-artwork__thumb ${
                        isSelected ? "ref-featured-artwork__thumb--active" : ""
                      }`}
                      onClick={() => setHeroIdx(i)}
                      id={`hero-thumb-${mId}`}
                      aria-label={`Select ${m.title}`}
                    >
                      <img
                        src={m.poster}
                        alt={m.title}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop";
                        }}
                      />
                      <div className="ref-featured-artwork__thumb-info">
                        <strong>{m.title}</strong>
                        <span>
                          {m.rating ? `★ ${m.rating}` : ""}{m.duration ? ` • ${m.duration}` : ""}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </aside>
            )}
          </section>

          {/* 3. Movie Information & Booking Cards (Side by Side) */}
          <div className="ref-movie-cards-grid">
            {/* Left Information Card */}
            <article className="ref-info-card">
              <div className="ref-info-card__header">
                <div className="ref-info-card__title-wrap">
                  <span className="ref-info-card__badge">FEATURED</span>
                  <h1 className="ref-info-card__title">{currentHero.title}</h1>
                </div>

                {currentHero.rating ? (
                  <div className="ref-info-card__rating">
                    <Star size={14} fill="#f5c518" color="#f5c518" />
                    <span className="ref-info-card__rating-val">{currentHero.rating}</span>
                    <span className="ref-info-card__rating-max">/ 10</span>
                    {currentHero.votes && (
                      <span className="ref-info-card__rating-count">({currentHero.votes})</span>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Metadata strip */}
              <div className="ref-info-card__meta-strip">
                {currentHero.duration && (
                  <span className="ref-info-card__meta-item">
                    <Clock size={14} />
                    {currentHero.duration}
                  </span>
                )}
                {currentHero.language && (
                  <span className="ref-info-card__meta-item">
                    <Globe size={14} />
                    {currentHero.language}
                  </span>
                )}
                {currentHero.releaseDate && (
                  <span className="ref-info-card__meta-item">
                    <Calendar size={14} />
                    {new Date(currentHero.releaseDate).getFullYear()}
                  </span>
                )}
                {currentHero.certificate && (
                  <span className="ref-info-card__cert-tag">{currentHero.certificate}</span>
                )}
              </div>

              {/* Genre Chips */}
              {Array.isArray(currentHero.genre) && currentHero.genre.length > 0 && (
                <div className="ref-info-card__genres">
                  {currentHero.genre.map((g) => (
                    <span key={g} className="ref-info-card__genre-chip">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Short Description with working Read More toggle */}
              <div className="ref-info-card__desc-wrap">
                <p
                  className={`ref-info-card__desc ${
                    readMore ? "ref-info-card__desc--expanded" : ""
                  }`}
                >
                  {currentHero.description}
                </p>
                {currentHero.description && currentHero.description.length > 110 && (
                  <button
                    type="button"
                    className="ref-info-card__read-more-btn"
                    onClick={() => setReadMore((v) => !v)}
                  >
                    {readMore ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </article>

            {/* Right Booking Card */}
            <article className="ref-booking-card">
              <div className="ref-booking-card__head">
                <div>
                  <span className="ref-booking-card__eyebrow">TICKET BOOKING</span>
                  <h2 className="ref-booking-card__title">{currentHero.title}</h2>
                </div>
                {currentHero.rating ? (
                  <div className="ref-booking-card__rating-badge">
                    <Star size={13} fill="#f5c518" color="#f5c518" />
                    <span>{currentHero.rating}★</span>
                  </div>
                ) : null}
              </div>

              {/* Compact summary */}
              <div className="ref-booking-card__summary">
                <div className="ref-booking-card__summary-item">
                  <span className="ref-booking-card__label">Genre</span>
                  <span className="ref-booking-card__val">
                    {Array.isArray(currentHero.genre) ? currentHero.genre.join(", ") : "Action"}
                  </span>
                </div>
                <div className="ref-booking-card__summary-item">
                  <span className="ref-booking-card__label">Certificate</span>
                  <span className="ref-booking-card__val">{currentHero.certificate || "UA"}</span>
                </div>
                <div className="ref-booking-card__summary-item">
                  <span className="ref-booking-card__label">Duration</span>
                  <span className="ref-booking-card__val">{currentHero.duration || "2h 15m"}</span>
                </div>
              </div>

              {/* Promotional message (clearly marked demonstration offer) */}
              <div className="ref-booking-card__promo">
                <Sparkles size={14} className="ref-booking-card__promo-icon" />
                <span>
                  <strong>Special Offer:</strong> Save 20% on tickets with iMovies Pass for all IMAX & 4DX showtimes.
                </span>
              </div>

              {/* Distinct Ticket Booking Actions */}
              <div className="ref-booking-card__actions">
                <Link
                  to={`/movie/${currentHeroId}?book=true`}
                  className="ref-booking-card__btn-primary"
                  id={`book-now-${currentHeroId}`}
                >
                  <Ticket size={17} />
                  <span>Book Tickets{currentHero.price ? ` · ₹${currentHero.price}` : ""}</span>
                </Link>

                <Link
                  to={`/movie/${currentHeroId}`}
                  className="ref-booking-card__btn-secondary"
                  id={`details-now-${currentHeroId}`}
                >
                  <Play size={14} fill="currentColor" />
                  <span>View Details & Schedule</span>
                </Link>
              </div>
            </article>
          </div>

          {/* 4. Upcoming Movies Section */}
          {upcoming.length > 0 && (
            <section className="ref-upcoming-section" id="upcoming-movies-section">
              <div className="ref-upcoming-section__header">
                <div className="ref-upcoming-section__title-group">
                  <span className="ref-upcoming-section__dot" />
                  <h2>Upcoming Movies</h2>
                </div>
                <Link to="/movies?filter=upcoming" className="ref-upcoming-section__see-all">
                  <span>See All</span>
                  <ChevronRight size={16} />
                </Link>
              </div>

              <div className="ref-upcoming-section__rail">
                {upcoming.map((movie) => {
                  const mId = movie._id || movie.id;
                  return (
                    <div key={mId} className="ref-upcoming-card">
                      <Link to={`/movie/${mId}`} className="ref-upcoming-card__media">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop";
                          }}
                        />
                        <span className="ref-upcoming-card__badge">Coming Soon</span>
                        {movie.rating ? (
                          <span className="ref-upcoming-card__rating">
                            ★ {movie.rating}
                          </span>
                        ) : null}
                      </Link>
                      <div className="ref-upcoming-card__body">
                        <h3 className="ref-upcoming-card__title" title={movie.title}>
                          <Link to={`/movie/${mId}`}>{movie.title}</Link>
                        </h3>
                        <p className="ref-upcoming-card__meta">
                          {movie.language} • {movie.genre?.[0] || "Cinema"}
                        </p>
                        <Link
                          to={`/movie/${mId}`}
                          className="ref-upcoming-card__btn"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
