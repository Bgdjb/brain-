import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSettings } from '../stores/settings';
import { Layout } from './Layout';
import { Dashboard } from '../features/dashboard/Dashboard';
import { StudentsPage } from '../features/students/StudentsPage';
import { SubjectsPage } from '../features/subjects/SubjectsPage';
import { FlashcardsPage } from '../features/flashcards/FlashcardsPage';
import { TasksPage } from '../features/tasks/TasksPage';
import { PlannerPage } from '../features/planner/PlannerPage';
import { FocusPage } from '../features/focus/FocusPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { SettingsPage } from '../features/common/SettingsPage';
import { Planned } from '../features/common/Planned';
import { GroupsPage } from '../features/groups/GroupsPage';
import { ExamsPage } from '../features/exams/ExamsPage';
import { FinancePage } from '../features/finance/FinancePage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { ReportsPage } from '../features/reports/ReportsPage';

export function App() {
 const { theme, lang } = useSettings();
 useEffect(() => {
  const root=document.documentElement;root.lang=lang;root.dir=lang==='ar'?'rtl':'ltr';
  const mq=window.matchMedia('(prefers-color-scheme: dark)');
  const apply=()=>{root.dataset.theme=theme==='dark'||(theme==='system'&&mq.matches)?'dark':'light';};
  apply();mq.addEventListener('change',apply);return()=>mq.removeEventListener('change',apply);
 },[theme,lang]);
 return <HashRouter><Routes><Route element={<Layout/>}>
  <Route index element={<Dashboard/>}/><Route path="teacher" element={<StudentsPage/>}/><Route path="study" element={<SubjectsPage/>}/>
  <Route path="cards" element={<FlashcardsPage/>}/><Route path="tasks" element={<TasksPage/>}/><Route path="planner" element={<PlannerPage/>}/>
  <Route path="focus" element={<FocusPage/>}/><Route path="analytics" element={<AnalyticsPage/>}/><Route path="groups" element={<GroupsPage/>}/>
  <Route path="exams" element={<ExamsPage/>}/><Route path="finance" element={<FinancePage/>}/><Route path="calendar" element={<CalendarPage/>}/>
  <Route path="reports" element={<ReportsPage/>}/><Route path="settings" element={<SettingsPage/>}/><Route path="*" element={<Planned/>}/>
 </Route></Routes></HashRouter>;
}