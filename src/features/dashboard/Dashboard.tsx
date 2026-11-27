import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';
export function Dashboard(){
 const stats=useLiveQuery(async()=>{const now=Date.now();const [students,subjects,due,tasks,plans,sessions,exams,groups]=await Promise.all([db.students.filter(s=>!s.archived).count(),db.subjects.filter(s=>!s.archived).count(),db.flashcards.where('due').belowOrEqual(now).filter(c=>!c.suspended).count(),db.tasks.filter(t=>!t.completed).count(),db.studyPlans.filter(p=>!p.completed).count(),db.focusSessions.where('startedAt').aboveOrEqual(now-7*86400000).toArray(),db.exams.count(),db.groups.count()]);return {students,subjects,due,tasks,plans,focusMinutes:sessions.reduce((s,x)=>s+x.durationMinutes,0),exams,groups};});
 if(!stats)return <p className="muted">جارٍ التحميل…</p>;
 return <section className="stack"><h1>MEMO</h1><p className="muted">ذاكر بذكاء. ركّز بقوة. طوّر نفسك.</p><div className="grid">
 <Link className="card stat" to="/teacher"><strong>{stats.students}</strong><span>طلاب نشطون</span></Link><Link className="card stat" to="/study"><strong>{stats.subjects}</strong><span>مواد دراسية</span></Link>
 <Link className="card stat" to="/cards"><strong>{stats.due}</strong><span>بطاقات مستحقة للمراجعة</span></Link><Link className="card stat" to="/tasks"><strong>{stats.tasks}</strong><span>مهام لم تُنجز</span></Link>
 <Link className="card stat" to="/planner"><strong>{stats.plans}</strong><span>جلسات في الخطة</span></Link><Link className="card stat" to="/focus"><strong>{stats.focusMinutes}</strong><span>دقائق تركيز خلال 7 أيام</span></Link>
 <Link className="card stat" to="/groups"><strong>{stats.groups}</strong><span>مجموعات</span></Link><Link className="card stat" to="/exams"><strong>{stats.exams}</strong><span>امتحانات مسجلة</span></Link>
 </div><div className="grid"><Link className="card" to="/calendar">افتح التقويم ←</Link><Link className="card" to="/groups">سجّل الحضور ←</Link><Link className="card" to="/finance">تابع الميزانية ←</Link><Link className="card" to="/reports">افتح التقارير ←</Link><Link className="card" to="/analytics">راجع تقدمك ←</Link></div></section>;
}