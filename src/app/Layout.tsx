import { NavLink, Outlet } from 'react-router-dom';
import { Home, Users, BookOpen, Layers, Settings, ListTodo, CalendarDays, Timer, BarChart3, UsersRound, GraduationCap, Wallet, CalendarRange, FileText } from 'lucide-react';
import { useT, type Key } from '../utils/i18n';
const items: { to:string; key:Key; icon:typeof Home }[] = [
 {to:'/',key:'home',icon:Home},{to:'/teacher',key:'teacher',icon:Users},{to:'/study',key:'study',icon:BookOpen},
 {to:'/cards',key:'cards',icon:Layers},{to:'/tasks',key:'tasks',icon:ListTodo},{to:'/planner',key:'planner',icon:CalendarDays},
 {to:'/focus',key:'focus',icon:Timer},{to:'/analytics',key:'analytics',icon:BarChart3},{to:'/groups',key:'groups',icon:UsersRound},
 {to:'/exams',key:'exams',icon:GraduationCap},{to:'/finance',key:'finance',icon:Wallet},{to:'/calendar',key:'calendar',icon:CalendarRange},
 {to:'/reports',key:'reports',icon:FileText},{to:'/settings',key:'settings',icon:Settings},
];
export function Layout(){const t=useT();return <div className="shell"><nav className="nav" aria-label="Main"><div className="brand">MEMO</div>{items.map(({to,key,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>'nav-link'+(isActive?' active':'')}><Icon size={20} aria-hidden/><span>{t(key)}</span></NavLink>)}</nav><main className="main"><Outlet/></main></div>;}