const USERS_KEY = "jerutech-users";
const SESSION_KEY = "jerutech-session";

export const loadUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
};

export const loadSessionUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSessionUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    /* ignore */
  }
};
