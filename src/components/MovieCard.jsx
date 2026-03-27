export default function MovieCard({ movie, details, openModal, toggleFav, favorites, index }) {
  const isFav = favorites?.some((m) => m.imdbID === movie.imdbID);
  const poster = movie.Poster !== "N/A" ? movie.Poster : null;
  const rating = details?.imdbRating && details.imdbRating !== "N/A" ? details.imdbRating : null;
  const genres = details?.Genre && details.Genre !== "N/A" ? details.Genre.split(", ").slice(0, 2) : [];

  return (
    <div
      className="movie-card"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Poster */}
      <div className="card-poster" onClick={openModal}>
        {poster ? (
          <img src={poster} alt={movie.Title} loading="lazy" />
        ) : (
          <div className="no-poster">
            <span>◈</span>
            <p>No image</p>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="card-overlay">
          <button className="details-btn">View details</button>
        </div>

        {/* Rating badge */}
        {rating && (
          <div className="rating-badge">★ {rating}</div>
        )}
      </div>

      {/* Info */}
      <div className="card-info">
        <div className="card-title-row">
          <h3 className="card-title" title={movie.Title}>{movie.Title}</h3>
          <button
            className={`fav-btn ${isFav ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); toggleFav(movie); }}
            title={isFav ? "Remove from saved" : "Save"}
          >
            {isFav ? "♥" : "♡"}
          </button>
        </div>

        <p className="card-year">{movie.Year}</p>

        {genres.length > 0 && (
          <div className="card-genres">
            {genres.map((g) => <span key={g} className="card-genre-tag">{g}</span>)}
          </div>
        )}

        {!details && (
          <div className="card-loading-row">
            <div className="inline-skeleton" />
            <div className="inline-skeleton short" />
          </div>
        )}
      </div>
    </div>
  );
}
