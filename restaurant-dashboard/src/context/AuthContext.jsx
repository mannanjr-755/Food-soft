/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { DEMO_USERS } from "../data/seed";
import {
  loadJSON,
  loadSession,
  removeKey,
  saveJSON,
  saveSession,
} from "../lib/storage";

const AuthContext = createContext(null);

const SESSION_KEY = "session";
const USERS_KEY = "auth_users";

function loadUsers() {
  return loadJSON(USERS_KEY, DEMO_USERS);
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [user, setUser] = useState(() => loadSession(SESSION_KEY));

  const persistUsers = useCallback((next) => {
    setUsers(next);
    saveJSON(USERS_KEY, next);
  }, []);

  const login = useCallback((email, password, remember = true) => {
    const normalizedEmail = email.trim().toLowerCase();
    const list = loadUsers();
    const found = list.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!found || found.password !== password) {
      return {
        ok: false,
        message: "Invalid email or password.",
      };
    }

    if (found.status !== "Active") {
      return {
        ok: false,
        message: "This account is inactive. Contact an administrator.",
      };
    }

    // Only ADMIN and MANAGER may enter the admin panel
    if (found.role !== "ADMIN" && found.role !== "MANAGER") {
      return {
        ok: false,
        message: "You do not have permission to access the admin panel.",
      };
    }

    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      status: found.status,
    };

    saveSession(SESSION_KEY, session, remember);
    setUser(session);
    setUsers(list);

    return { ok: true, user: session };
  }, []);

  const logout = useCallback(() => {
    removeKey(SESSION_KEY);
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const upsertAuthUser = useCallback(
    (member) => {
      const list = loadUsers();
      const idx = list.findIndex(
        (u) => u.email.toLowerCase() === member.email.toLowerCase()
      );
      const record = {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone || "",
        role: member.role,
        status: member.status || "Active",
        password:
          member.password ||
          (idx >= 0 ? list[idx].password : "changeme123"),
      };

      const next =
        idx >= 0
          ? list.map((u, i) => (i === idx ? { ...u, ...record } : u))
          : [...list, record];

      persistUsers(next);
    },
    [persistUsers]
  );

  const removeAuthUser = useCallback(
    (email) => {
      const list = loadUsers().filter(
        (u) =>
          u.email.toLowerCase() !== email.toLowerCase() &&
          u.role !== "ADMIN"
      );
      // Always keep at least the seeded admin
      const admin = DEMO_USERS.find((u) => u.role === "ADMIN");
      const hasAdmin = list.some(
        (u) => u.email.toLowerCase() === admin.email.toLowerCase()
      );
      persistUsers(hasAdmin ? list : [admin, ...list]);
    },
    [persistUsers]
  );

  const value = useMemo(
    () => ({
      user,
      users,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "ADMIN",
      canAccessAdmin:
        user?.role === "ADMIN" || user?.role === "MANAGER",
      login,
      logout,
      upsertAuthUser,
      removeAuthUser,
    }),
    [user, users, login, logout, upsertAuthUser, removeAuthUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
