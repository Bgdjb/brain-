import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';

export function Dashboard() {
  const stats = useLiveQuery(async () => {
    const now = Date.now();
    const [students, subjects, due] = await Promise.all([
      db.students.filter((s) => !s.archived).count(),
      db.subjects.filter((s) => !s.archived).count(),
      db.flashcards.where('due').belowOrEqual(now).filter((c) => !c.suspended).count(),
    ]);
    return { students, subjects, due };
  });

  if (!stats) return <p className="muted">جارٍ التحميل…</p>;

  return (
    <section className="stack">
      <h1>MEMO</h1>
      <p className="muted">ذاكر بذكاء. ركّز بقوة. طوّر نفسك.</p>
      <div className="grid">
        <Link className="card stat" to="/teacher">
          <strong>{stats.students}</strong>
          <span>طلاب نشطون</span>
        </Link>
        <Link className="card stat" to="/study">
          <strong>{stats.subjects}</strong>
          <span>مواد دراسية</span>
        </Link>
        <Link className="card stat" to="/cards">
          <strong>{stats.due}</strong>
          <span>بطاقات مستحقة للمراجعة</span>
        </Link>
      </div>
    </section>
  );
}
