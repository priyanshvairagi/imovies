import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, X, ChevronDown, AlertCircle, RefreshCw, Film, Sparkles } from "lucide-react";
import { movieAPI } from "../services/api";
import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import "./Movies.css";

const STANDARD_GENRES = [
  "Action",
  "Comedy",
  "Crime",
  "Drama",
  "Horror",
  "Mystery",
  "Mythology",
  "Romance",
  "Sci-Fi",
  "Spy",
  "Thriller",
  "War",
];

const STANDARD_LANGS = ["English", "Hindi", "Tamil", "Telugu", "Malayalam", "Kannada"];

const FILTERS = [
  { key: "all", label: "All Titles" },
  { key: "now_showing", label: "Now Showing" },
  { key: "upcoming", label: "Upcoming Releases" },
  { key: "trending", label: "Trending 🔥" },
];

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useApp();

  const [query, setQuery] = useState(searchParams.get("search") || searchQuery || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLangs, setSelectedLangs] = useState([]);
  const [sortBy, setSortBy] = useState("rating");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // API Data state
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Sync search query from context/URL
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) setQuery(urlSearch);
    const urlFilter = searchParams.get("filter");
    if (urlFilter) setFilter(urlFilter);
  }, [searchParams]);

  // Fetch movies from API
  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        limit: 50,
      };

      if (query.trim()) params.search = query.trim();
      if (filter === "now_showing") params.status = "now_showing";
      else if (filter === "upcoming") params.status = "upcoming";
      else if (filter === "trending") params.trending = "true";

      if (selectedGenres.length > 0) params.genre = selectedGenres.join(",");
      if (selectedLangs.length > 0) params.language = selectedLangs.join(",");
      if (minRating > 0) params.minRating = minRating;

      // Sort parameter mapping
      if (sortBy === "rating") params.sort = "-rating";
      else if (sortBy === "title") params.sort = "title";
      else if (sortBy === "release") params.sort = "-releaseDate";
      else if (sortBy === "price_asc") params.sort = "price_asc";
      else if (sortBy === "price_desc") params.sort = "price_desc";

      const data = await movieAPI.getMovies(params);
      if (data && Array.isArray(data.movies)) {
        setMovies(data.movies);
        setTotalCount(data.total ?? data.movies.length);
      } else {
        throw new Error("Invalid response received from movie API");
      }
    } catch (err) {
      console.warn("API server connecting or offline:", err);
      setError(err.message || "Failed to load movies from the database.");
    } finally {
      setLoading(false);
    }
  }, [query, filter, selectedGenres, selectedLangs, minRating, sortBy]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Compute available genres and languages dynamically
  const availableGenres = useMemo(() => {
    const dynamic = [...new Set(movies.flatMap((m) => m.genre || []))];
    const combined = [...new Set([...STANDARD_GENRES, ...dynamic])];
    return combined.sort();
  }, [movies]);

  const availableLangs = useMemo(() => {
    const dynamic = [...new Set(movies.map((m) => m.language).filter(Boolean))];
    const combined = [...new Set([...STANDARD_LANGS, ...dynamic])];
    return combined.sort();
  }, [movies]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    setSearchParams(query ? { search: query, ...(filter !== "all" ? { filter } : {}) } : (filter !== "all" ? { filter } : {}));
  };

  const handleFilterTab = (fKey) => {
    setFilter(fKey);
    const newParams = {};
    if (query) newParams.search = query;
    if (fKey !== "all") newParams.filter = fKey;
    setSearchParams(newParams);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleLang = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedLangs([]);
    setMinRating(0);
    setFilter("all");
    setQuery("");
    setSearchQuery("");
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedGenres.length > 0 || selectedLangs.length > 0 || minRating > 0 || query !== "" || filter !== "all";

  return (
    <div className="movies-catalog">
      {/* Top Banner Header */}
      <div className="movies-catalog__header">
        <div className="movies-catalog__header-inner">
          <div className="movies-catalog__title-group">
            <span className="movies-catalog__eyebrow">
              <Film size={14} /> LIVE CINEMA CATALOG
            </span>
            <h1 className="movies-catalog__title">Browse All Movies</h1>
            <p className="movies-catalog__subtitle">
              {loading
                ? "Searching movies across auditoriums..."
                : `Showing ${totalCount} title${totalCount !== 1 ? "s" : ""} available for online booking`}
            </p>
          </div>

          {/* Search form */}
          <form className="movies-catalog__search-form" onSubmit={handleSearch} id="movies-search-form">
            <Search size={18} className="movies-catalog__search-icon" />
            <input
              type="text"
              id="movies-search-input"
              placeholder="Search by title, director, stars, genre…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="movies-catalog__search-input"
            />
            {query && (
              <button
                type="button"
                className="movies-catalog__search-clear"
                onClick={() => {
                  setQuery("");
                  setSearchQuery("");
                  const p = {};
                  if (filter !== "all") p.filter = filter;
                  setSearchParams(p);
                }}
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
            <button type="submit" className="movies-catalog__search-btn" id="movies-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* Category Tabs */}
        <div className="movies-catalog__tabs">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`movies-catalog__tab${filter === f.key ? " movies-catalog__tab--active" : ""}`}
              onClick={() => handleFilterTab(f.key)}
              id={`filter-tab-${f.key}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Body */}
      <div className="movies-catalog__body">
        {/* Sidebar Filter Panel */}
        <aside
          className={`movies-catalog__sidebar${filtersOpen ? " movies-catalog__sidebar--open" : ""}`}
          id="movies-sidebar"
        >
          <div className="movies-catalog__sidebar-head">
            <span className="movies-catalog__sidebar-title">
              <Filter size={16} /> Filter Catalog
            </span>
            {hasActiveFilters && (
              <button className="movies-catalog__clear-link" onClick={clearFilters} id="clear-filters-btn">
                Reset All
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="filter-block">
            <label className="filter-block__label" htmlFor="sort-select">
              Sort By
            </label>
            <div className="filter-block__select-wrap">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-block__select"
              >
                <option value="rating">Rating (Highest First)</option>
                <option value="title">Title (A to Z)</option>
                <option value="release">Release Date</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
              <ChevronDown size={14} className="filter-block__select-chevron" />
            </div>
          </div>

          {/* Genre Filter */}
          <div className="filter-block">
            <div className="filter-block__header-row">
              <label className="filter-block__label">Genres</label>
              {selectedGenres.length > 0 && (
                <span className="filter-block__count">{selectedGenres.length} selected</span>
              )}
            </div>
            <div className="filter-block__chip-group">
              {availableGenres.map((g) => (
                <button
                  key={g}
                  className={`filter-block__chip${
                    selectedGenres.includes(g) ? " filter-block__chip--active" : ""
                  }`}
                  onClick={() => toggleGenre(g)}
                  id={`genre-tag-${g.toLowerCase()}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="filter-block">
            <div className="filter-block__header-row">
              <label className="filter-block__label">Language</label>
              {selectedLangs.length > 0 && (
                <span className="filter-block__count">{selectedLangs.length} selected</span>
              )}
            </div>
            <div className="filter-block__chip-group">
              {availableLangs.map((l) => (
                <button
                  key={l}
                  className={`filter-block__chip${
                    selectedLangs.includes(l) ? " filter-block__chip--active" : ""
                  }`}
                  onClick={() => toggleLang(l)}
                  id={`lang-tag-${l.toLowerCase()}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div className="filter-block">
            <div className="filter-block__header-row">
              <label className="filter-block__label" htmlFor="rating-range">
                Minimum Rating
              </label>
              <span className="filter-block__rating-badge">
                {minRating > 0 ? `${minRating} ★ & above` : "Any Rating"}
              </span>
            </div>
            <input
              type="range"
              id="rating-range"
              min={0}
              max={9}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="filter-block__slider"
            />
            <div className="filter-block__slider-scale">
              <span>All</span>
              <span>7.0★</span>
              <span>8.0★</span>
              <span>9.0+</span>
            </div>
          </div>
        </aside>

        {/* Mobile Toggle Button */}
        <button
          className="movies-catalog__mobile-toggle"
          onClick={() => setFiltersOpen((v) => !v)}
          id="mobile-filter-toggle"
        >
          <SlidersHorizontal size={16} />
          <span>{filtersOpen ? "Hide Filters" : "Show Filters & Sorting"}</span>
          {hasActiveFilters && (
            <span className="movies-catalog__mobile-badge">
              {selectedGenres.length + selectedLangs.length + (minRating > 0 ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Results Main Grid */}
        <main className="movies-catalog__main">
          {loading ? (
            <div className="movies-catalog__loading-box">
              <div className="auth-spinner" style={{ width: 42, height: 42, borderWidth: 3 }} />
              <p>Fetching movies from database...</p>
            </div>
          ) : error ? (
            <div className="movies-catalog__error-box">
              <AlertCircle size={48} color="#e50914" />
              <h3>Error Loading Movies</h3>
              <p>{error}</p>
              <button onClick={fetchMovies} className="movies-catalog__empty-btn">
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="movies-catalog__empty-box">
              <Search size={54} />
              <h3>No matching movies found</h3>
              <p>Try clearing your genre or language filters, or try a different search keyword.</p>
              <button className="movies-catalog__empty-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="movies-catalog__grid">
              {movies.map((m) => (
                <MovieCard key={m._id || m.id} movie={m} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
