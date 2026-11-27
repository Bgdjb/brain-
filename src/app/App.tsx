import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSettings } from '../stores/settings';
import { Layout } from './Layout';
import { Dashboard } from '../features/dashboard/Dashboard';
import { StudentsPage } from '../features/students/StudentsPage';
import { SubjectsPage } from '../features/subjects/SubjectsPage';
import { FlashcardsPage } from '../features/flashcards/FlashcardsPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { SettingsPage } from '../features/common/SettingsPage';
import { Planned } from '../features/common/Planned';

export function App() {
  const { theme, lang } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      root.dataset.theme = dark ? 'dark' : 'light';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme, lang]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="teacher" element={<StudentsPage />} />
          <Route path="study" element={<SubjectsPage />} />
          <Route path="cards" element={<FlashcardsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Planned />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
