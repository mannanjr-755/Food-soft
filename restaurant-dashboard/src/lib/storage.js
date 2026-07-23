const PREFIX = "restaurant_admin_";

function readStorage(storage, key) {
  try {
    const raw = storage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode errors
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore
  }
  try {
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore
  }
}

/** Load session from localStorage (remember) or sessionStorage (temporary). */
export function loadSession(key) {
  return (
    readStorage(localStorage, key) ?? readStorage(sessionStorage, key) ?? null
  );
}

/** Persist session; remember=true keeps it across browser restarts. */
export function saveSession(key, value, remember = true) {
  const serialized = JSON.stringify(value);
  try {
    if (remember) {
      localStorage.setItem(PREFIX + key, serialized);
      sessionStorage.removeItem(PREFIX + key);
    } else {
      sessionStorage.setItem(PREFIX + key, serialized);
      localStorage.removeItem(PREFIX + key);
    }
  } catch {
    // Ignore quota / private mode errors
  }
}
