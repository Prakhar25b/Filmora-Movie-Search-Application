import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "./components/MovieCard";
import "./App.css";

const API_KEY = import.meta.env.VITE_OMDB_KEY || "a6d5380b";
const RESULTS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { value: "default", label: "Relevance" },
  { value: "year_desc", label: "Newest first" },
  { value: "year_asc", label: "Oldest first" },
  { value: "rating_desc", label: "Highest rated" },
  { value: "title_asc", label: "A → Z" },
];

const TYPE_OPTIONS = [
  { value: "", label: "All types" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "TV Series" },
  { value: "episode", label: "Episodes" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeletonCount, setSkeletonCount] = useState(0);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);
  const searchInputRef = useRef(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("Filmora_fav")) || [];
    setFavorites(saved);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("Filmora_fav", JSON.stringify(favorites));
  }, [favorites]);

  // Close modal on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelectedMovie(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const fetchMovies = useCallback(
    async (searchQuery, pageNum = 1, type = typeFilter) => {
      if (!searchQuery.trim()) {
        setMovies([]);
        setTotalResults(0);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setSkeletonCount(8);
      setError("");
      setHasSearched(true);

      try {
        const typeParam = type ? `&type=${type}` : "";
        const res = await fetch(
          `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&page=${pageNum}&apikey=${API_KEY}${typeParam}`,
        );
        const data = await res.json();

        if (data.Response === "False") {
          setError(data.Error || "No results found.");
          setMovies([]);
          setTotalResults(0);
        } else {
          setMovies(data.Search);
          setTotalResults(parseInt(data.totalResults, 10));
          // Prefetch details for cards
          data.Search.forEach((m) => fetchDetails(m.imdbID));
        }
      } catch {
        setError("Network error — please try again.");
      }

      setLoading(false);
      setSkeletonCount(0);
    },
    [typeFilter],
  );

  const fetchDetails = async (imdbID) => {
    if (movieDetails[imdbID]) return;
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`,
      );
      const data = await res.json();
      setMovieDetails((prev) => ({ ...prev, [imdbID]: data }));
    } catch {
      /* silent fail */
    }
  };

  // Live search with 500ms debounce
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      fetchMovies(val, 1);
    }, 500);
  };

  const handleTypeChange = (type) => {
    setTypeFilter(type);
    setPage(1);
    fetchMovies(query, 1, type);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMovies(query, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFav = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.imdbID === movie.imdbID);
      return exists
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [...prev, movie];
    });
  };

  const openModal = (imdbID) => {
    const details = movieDetails[imdbID];
    if (details) setSelectedMovie(details);
  };

  // Sort movies client-side
  const getSortedMovies = (list) => {
    const withDetails = list.map((m) => ({ ...m, _d: movieDetails[m.imdbID] }));
    switch (sortBy) {
      case "year_desc":
        return [...withDetails].sort(
          (a, b) => parseInt(b.Year) - parseInt(a.Year),
        );
      case "year_asc":
        return [...withDetails].sort(
          (a, b) => parseInt(a.Year) - parseInt(b.Year),
        );
      case "rating_desc":
        return [...withDetails].sort((a, b) => {
          const ra = parseFloat(a._d?.imdbRating) || 0;
          const rb = parseFloat(b._d?.imdbRating) || 0;
          return rb - ra;
        });
      case "title_asc":
        return [...withDetails].sort((a, b) => a.Title.localeCompare(b.Title));
      default:
        return withDetails;
    }
  };

  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const displayMovies = getSortedMovies(movies);

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          ← Prev
        </button>
        {start > 1 && (
          <>
            <button className="page-num" onClick={() => handlePageChange(1)}>
              1
            </button>
            <span className="ellipsis">…</span>
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            className={`page-num ${p === page ? "active" : ""}`}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            <span className="ellipsis">…</span>
            <button
              className="page-num"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          className="page-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Filmora</span>
          </div>
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "search" ? "active" : ""}`}
              onClick={() => setActiveTab("search")}
            >
              Discover
            </button>
            <button
              className={`nav-tab ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              Saved
              {favorites.length > 0 && (
                <span className="badge">{favorites.length}</span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === "search" && (
          <>
            {/* Search hero */}
            <section className="search-hero">
              <p className="search-eyebrow">Search the universe of cinema</p>
              <div className="search-bar">
                <span className="search-icon">⌕</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  placeholder="Title, director, keyword…"
                  onChange={handleQueryChange}
                  className="search-input"
                  autoFocus
                />
                {query && (
                  <button
                    className="clear-btn"
                    onClick={() => {
                      setQuery("");
                      setMovies([]);
                      setHasSearched(false);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filters row */}
              <div className="controls-row">
                <div className="type-pills">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`type-pill ${typeFilter === opt.value ? "active" : ""}`}
                      onClick={() => handleTypeChange(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="sort-wrap">
                  <label className="sort-label">Sort</label>
                  <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Results meta */}
            {!loading && hasSearched && !error && totalResults > 0 && (
              <div className="results-meta">
                <span>
                  {totalResults.toLocaleString()} results for <em>"{query}"</em>
                </span>
                <span>
                  Page {page} of {totalPages}
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="empty-state">
                <span className="empty-icon">⊘</span>
                <p className="empty-title">{error}</p>
                <p className="empty-sub">
                  Try a different title or check your spelling.
                </p>
              </div>
            )}

            {/* Empty / welcome state */}
            {!hasSearched && !loading && (
              <div className="empty-state welcome">
                <span className="empty-icon cinematic">◈</span>
                <p className="empty-title">What are we watching tonight?</p>
                <p className="empty-sub">
                  Search any movie, series, or episode above to get started.
                </p>
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div className="movies-grid">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-poster" />
                    <div className="skeleton-line wide" />
                    <div className="skeleton-line short" />
                    <div className="skeleton-line med" />
                  </div>
                ))}
              </div>
            )}

            {/* Movies grid */}
            {!loading && displayMovies.length > 0 && (
              <>
                <div className="movies-grid">
                  {displayMovies.map((movie, i) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      details={movie._d}
                      openModal={() => openModal(movie.imdbID)}
                      toggleFav={toggleFav}
                      favorites={favorites}
                      index={i}
                    />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </>
        )}

        {/* Favorites tab */}
        {activeTab === "favorites" && (
          <>
            <section className="search-hero minimal">
              <p className="search-eyebrow">Your saved films</p>
              {favorites.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={() => setFavorites([])}
                >
                  Clear all
                </button>
              )}
            </section>

            {favorites.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">♡</span>
                <p className="empty-title">Nothing saved yet</p>
                <p className="empty-sub">
                  Tap the heart on any film to save it here.
                </p>
              </div>
            ) : (
              <div className="movies-grid">
                {favorites.map((movie, i) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    details={movieDetails[movie.imdbID]}
                    openModal={() => {
                      fetchDetails(movie.imdbID);
                      setTimeout(() => openModal(movie.imdbID), 300);
                    }}
                    toggleFav={toggleFav}
                    favorites={favorites}
                    index={i}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>
            <div className="modal-inner">
              <div className="modal-poster">
                <img
                  src={
                    selectedMovie.Poster !== "N/A"
                      ? selectedMovie.Poster
                      : "https://placehold.co/300x450/111/333?text=No+Image"
                  }
                  alt={selectedMovie.Title}
                />
              </div>
              <div className="modal-info">
                <p className="modal-eyebrow">
                  {selectedMovie.Year} · {selectedMovie.Type}
                </p>
                <h2 className="modal-title">{selectedMovie.Title}</h2>
                <div className="modal-meta">
                  {selectedMovie.imdbRating &&
                    selectedMovie.imdbRating !== "N/A" && (
                      <span className="meta-chip rating">
                        ★ {selectedMovie.imdbRating}
                      </span>
                    )}
                  {selectedMovie.Runtime && selectedMovie.Runtime !== "N/A" && (
                    <span className="meta-chip">{selectedMovie.Runtime}</span>
                  )}
                  {selectedMovie.Rated && selectedMovie.Rated !== "N/A" && (
                    <span className="meta-chip">{selectedMovie.Rated}</span>
                  )}
                </div>
                {selectedMovie.Genre && selectedMovie.Genre !== "N/A" && (
                  <div className="modal-genres">
                    {selectedMovie.Genre.split(", ").map((g) => (
                      <span key={g} className="genre-tag">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {selectedMovie.Plot && selectedMovie.Plot !== "N/A" && (
                  <p className="modal-plot">{selectedMovie.Plot}</p>
                )}
                <div className="modal-credits">
                  {selectedMovie.Director &&
                    selectedMovie.Director !== "N/A" && (
                      <p>
                        <span className="credit-label">Director</span>{" "}
                        {selectedMovie.Director}
                      </p>
                    )}
                  {selectedMovie.Actors && selectedMovie.Actors !== "N/A" && (
                    <p>
                      <span className="credit-label">Cast</span>{" "}
                      {selectedMovie.Actors}
                    </p>
                  )}
                  {selectedMovie.Awards && selectedMovie.Awards !== "N/A" && (
                    <p>
                      <span className="credit-label">Awards</span>{" "}
                      {selectedMovie.Awards}
                    </p>
                  )}
                </div>
                <div className="modal-actions">
                  <a
                    className="trailer-link"
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.Title + " " + selectedMovie.Year + " trailer")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ▶ Watch trailer
                  </a>
                  <a
                    className="imdb-link"
                    href={`https://www.imdb.com/title/${selectedMovie.imdbID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IMDb page →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
