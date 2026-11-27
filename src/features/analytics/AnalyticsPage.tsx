import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';

export function AnalyticsPage() {
  const data = useLiveQuery(async () => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const [students, subjects, cards, reviews, tasks, plans, sessions] = await Promise.all([
      db.students.filter((s) => !s.archived).count(),
      db.subjects.filter((s) => !s.archived).count(),
      db.flashcards.filter((c) => !c.suspended).count(),
      db.reviews.where('reviewedAt').aboveOrEqual(weekAgo).count(),
      db.tasks.toArray(),
      db.studyPlans.toArray(),
      db.focusSessions.where('startedAt').aboveOrEqual(weekAgo).toArray(),
    ]);
    const completedTasks = tasks.filter((t) => t.completed).length;
    const completedPlans = plans.filter((p) => p.completed).length;
    const focusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      students, subjects, cards, reviews, tasks: tasks.length, completedTasks,
      plans: plans.length, completedPlans, focusMinutes,
    };
  }, []);

  if (!data) return <p className="muted">جارٍ حساب الإحصائيات…</p>;
  const taskRate = data.tasks ? Math.round(data.completedTasks / data.tasks * 100) : 0;
  const planRate = data.plans ? Math.round(data.completedPlans / data.plans * 100) : 0;
  return <section className="stack">
    <h1>الإحصائيات والتقدم</h1>
    <p className="muted">ملخص نشاطك المحفوظ على هذا الجهاز. أرقام التركيز والمراجعة لآخر 7 أيام.</p>
    <div className="grid">
      <div className="card stat"><strong>{data.subjects}</strong><span>مواد نشطة</span></div>
      <div className="card stat"><strong>{data.cards}</strong><span>بطاقات تعليمية</span></div>
      <div className="card stat"><strong>{data.reviews}</strong><span>مراجعة خلال 7 أيام</span></div>
      <div className="card stat"><strong>{Math.floor(data.focusMinutes / 60)}س {data.focusMinutes % 60}د</strong><span>تركيز خلال 7 أيام</span></div>
      <div className="card stat"><strong>{data.students}</strong><span>طلاب نشطون</span></div>
    </div>
    <div className="card stack">
      <div className="item"><strong>إنجاز المهام</strong><strong>{taskRate}%</strong></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: taskRate + '%' }} /></div>
      <p className="muted">{data.completedTasks} من {data.tasks} مهمة مكتملة</p>
    </div>
    <div className="card stack">
      <div className="item"><strong>إنجاز خطة المذاكرة</strong><strong>{planRate}%</strong></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: planRate + '%' }} /></div>
      <p className="muted">{data.completedPlans} من {data.plans} بند مكتمل</p>
    </div>
  </section>;
}
