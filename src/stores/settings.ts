import { create } from 'zustand';

export type Theme = 'system' | 'dark' | 'light';
export type Lang = 'ar' | 'en';

interface SettingsState {
  theme: Theme;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setLang: (l: Lang) => void;
}

const read = <T extends string>(key: string, fallback: T, allowed: T[]): T => {
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
};

// Only small UI preferences live in localStorage. All records live in IndexedDB (Dexie).
export const useSettings = create<SettingsState>((set) => ({
  theme: read<Theme>('memo.theme', 'system', ['system', 'dark', 'light']),
  lang: read<Lang>('memo.lang', 'ar', ['ar', 'en']),
  setTheme: (theme) => {
    try { localStorage.setItem('memo.theme', theme); } catch { /* ignore */ }
    set({ theme });
  },
  setLang: (lang) => {
    try { localStorage.setItem('memo.lang', lang); } catch { /* ignore */ }
    set({ lang });
  },
}));
