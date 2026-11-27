import { useSettings } from '../stores/settings';

const dict = {
  home: { ar: 'الرئيسية', en: 'Home' },
  teacher: { ar: 'الإدارة', en: 'Teacher' },
  study: { ar: 'الدراسة', en: 'Study' },
  cards: { ar: 'البطاقات', en: 'Cards' },
  settings: { ar: 'الإعدادات', en: 'Settings' },
} as const;

export type Key = keyof typeof dict;
export const useT = () => {
  const lang = useSettings((s) => s.lang);
  return (k: Key) => dict[k][lang];
};
