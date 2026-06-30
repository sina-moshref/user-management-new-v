import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../api/client";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setSocketConnected(false);
      return;
    }

    let newSocket = null;

    const initSocket = async () => {
      try {
        const { io } = await import("socket.io-client");

        newSocket = io("https://user-management-new-v.onrender.com", {
          auth: { token },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
          setSocketConnected(true);
        });

        newSocket.on("disconnect", () => {
          setSocketConnected(false);
        });

        newSocket.on("connect_error", () => {
          setSocketConnected(false);
        });
      } catch (error) {
        setSocket(null);
        setSocketConnected(false);
      }
    };

    initSocket();

    return () => {
      setSocket(null);
      setSocketConnected(false);
      if (newSocket) newSocket.close();
    };
  }, [token]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const payload = parseJwt(token);

    if (payload && payload.exp * 1000 > Date.now()) {
      setUser({ id: payload.id, email: payload.email, role: payload.role });
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const setToken = useCallback((newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
      setUser(null);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { token: t } = await api.login(email, password);
      setToken(t);
    },
    [setToken],
  );

  const register = useCallback(
    async (name, email, password, role = "user") => {
      await api.register(name, email, password, role);
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    setToken(null);
  }, [setToken]);

  const value = {
    user,
    token,
    loading,
    socket,
    socketConnected,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    canAccessMovies: user?.role === "admin" || user?.role === "moderator",
    canAccessUsers: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
