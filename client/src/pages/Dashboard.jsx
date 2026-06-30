import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user, canAccessMovies, canAccessUsers } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={styles.dashboard}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.greeting}>{greeting}</span>
          <h1 className={styles.title}>{user?.email?.split("@")[0]}</h1>
          <p className={styles.roleLine}>
            Signed in as <span className={styles.roleBadge}>{user?.role}</span>
          </p>
        </div>
        <div className={styles.heroGlow} />
      </section>

      {/* Quick Actions */}
      <section className={styles.actions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          {canAccessMovies && (
            <Link to="/movies" className={styles.actionCard}>
              <div className={styles.actionIcon}>🎬</div>
              <div className={styles.actionInfo}>
                <h3>Movies</h3>
                <p>Browse and manage the movie collection</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          )}
          {canAccessUsers && (
            <Link to="/users" className={styles.actionCard}>
              <div className={styles.actionIcon}>👥</div>
              <div className={styles.actionInfo}>
                <h3>Users</h3>
                <p>Manage user accounts and roles</p>
              </div>
              <span className={styles.arrow}>→</span>
            </Link>
          )}
          {!canAccessUsers && !canAccessMovies && (
            <div className={styles.actionCard}>
              <div className={styles.actionIcon}>🎉</div>
              <div className={styles.actionInfo}>
                <h3>Welcome</h3>
                <p>You're all set — enjoy the app!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info Cards */}
      <section className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Account</span>
          <span className={styles.infoValue}>{user?.email}</span>
        </div>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Role</span>
          <span className={styles.infoValue}>{user?.role}</span>
        </div>
        <div className={styles.infoCard} id="status">
          <span className={styles.infoLabel}>Status</span>
          <span className={styles.infoValue}>
            <span className={styles.statusDot} /> Online
          </span>
        </div>
      </section>
    </div>
  );
}
