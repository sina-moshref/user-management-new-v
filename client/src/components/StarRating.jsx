import styles from "./StarRating.module.css";

export default function StarRating({ value = 0, onChange, disabled }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${styles.star} ${star <= value ? styles.filled : ""} ${disabled ? styles.disabled : ""}`}
          onClick={() => !disabled && onChange?.(star)}
          onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.transform = "scale(1.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          disabled={disabled}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
