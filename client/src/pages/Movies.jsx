import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import StarRating from "../components/StarRating";
import styles from "./Movies.module.css";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Documentary",
  "Animation",
  "Other",
];

export default function Movies() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    description: "",
    genre: "",
    duration: "",
    imageUrl: "",
  });

  const canAdd = user?.role === "admin" || user?.role === "moderator";

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getMovies();
      setMovies(data.movies || []);
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const openModal = () => {
    setForm({
      name: "",
      rating: 0,
      description: "",
      genre: "",
      duration: "",
      imageUrl: "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rating) {
      setFormError("Name and rating are required");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await api.createMovie({
        name: form.name.trim(),
        rating: form.rating,
        description: form.description.trim() || undefined,
        genre: form.genre || undefined,
        duration: form.duration.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      });
      closeModal();
      await fetchMovies();
    } catch (err) {
      setFormError(err.data?.error || err.message || "Failed to create movie");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading movies…</div>;
  if (error) return <div className="form-error">{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Movies</h1>
          <p className={styles.subtitle}>Browse the collection</p>
        </div>
        {canAdd && (
          <button type="button" className={styles.addBtn} onClick={openModal}>
            + Add movie
          </button>
        )}
      </div>

      {movies.length === 0 ? (
        <div className={styles.empty}>
          No movies yet. {canAdd ? "Add one to get started!" : ""}
        </div>
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <div key={movie.id} className={styles.card}>
              <div className={styles.poster}>
                {movie.imageUrl ? (
                  <img src={movie.imageUrl} alt={movie.name} />
                ) : (
                  <div className={styles.placeholder}>
                    <span>🎬</span>
                  </div>
                )}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{movie.name}</h3>
                <StarRating value={movie.rating} disabled />
                <div className={styles.meta}>
                  {movie.genre && (
                    <span className={styles.badge}>{movie.genre}</span>
                  )}
                  {movie.duration && (
                    <span className={styles.duration}>{movie.duration}</span>
                  )}
                </div>
                {movie.description && (
                  <p className={styles.desc}>{movie.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Add Movie</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="movie-name">Name</label>
                <input
                  id="movie-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label>Rating</label>
                <StarRating
                  value={form.rating}
                  onChange={(r) => setForm({ ...form, rating: r })}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="movie-genre">Genre</label>
                <select
                  id="movie-genre"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                >
                  <option value="">Select genre</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="movie-duration">Duration</label>
                <input
                  id="movie-duration"
                  type="text"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="e.g. 2h 15m"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="movie-desc">Description</label>
                <textarea
                  id="movie-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="movie-image">Image URL</label>
                <input
                  id="movie-image"
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/poster.jpg"
                />
              </div>
              {formError && (
                <div className="form-error" style={{ marginBottom: "1rem" }}>
                  {formError}
                </div>
              )}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnCancel}`}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnSave}`}
                  disabled={saving}
                >
                  {saving ? "Adding…" : "Add Movie"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
