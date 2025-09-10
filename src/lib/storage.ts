export const Storage = {
  async get(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    try {
      const value = window.localStorage.getItem(key);
      return value;
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};


