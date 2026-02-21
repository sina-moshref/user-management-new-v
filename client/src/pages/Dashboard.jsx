import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Dashboard.module.css";


export default function Dashboard() {
  const { user, canAccessMovies, canAccessUsers } = useAuth();


  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>
        Hello, <strong>{user?.email}</strong>. You’re signed in as{" "}
        <strong>{user?.role}</strong>.
      </p>
      <div className={styles.card}>
        <h2>Quick info</h2>
        <ul>
          <li>Your role: <strong>{user?.role}</strong></li>
          {canAccessMovies ? (
            <li>You can access the <Link to="/movies">Movies</Link> section (admin/moderator).</li>
          ) : (
            <li>Movies section is only available for admin and moderator roles.</li>
          )}
          {canAccessUsers && <li>Users section is only available for admin role.</li>}
        </ul>
      </div>
    </div>
  );
}
