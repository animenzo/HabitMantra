const KEY = "notes-cache-v1";

export const loadNotesCache = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveNotesCache = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};
