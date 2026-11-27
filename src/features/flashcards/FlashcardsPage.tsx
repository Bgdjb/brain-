import { useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';
import { schedule, type Rating } from '../../utils/srs';

const ratings: { r: Rating; label: string }[] = [
  { r: 'again', label: 'نسيت' },
  { r: 'hard', label: 'صعب' },
  { r: 'good', label: 'جيد' },
  { r: 'easy', label: 'سهل' },
];

export function FlashcardsPage() {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);

  const data = useLiveQuery(async () => {
    const now = Date.now();
    const [subjects, due, total, reviewCount] = await Promise.all([
      db.subjects.filter((s) => !s.archived).toArray(),
      db.flashcards.where('due').belowOrEqual(now).filter((c) => !c.suspended).sortBy('due'),
      db.flashcards.count(),
      db.reviews.count(),
    ]);
    return { subjects, due, total, reviewCount };
  }, []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return setError('اكتب السؤال والإجابة.');
    const now = Date.now();
    await db.flashcards.add({
      workspace: 'personal', subjectId, front: front.trim(), back: back.trim(),
      ease: 2.5, intervalDays: 0, reps: 0, lapses: 0, due: now, suspended: false,
      createdAt: now, updatedAt: now,
    });
    setFront(''); setBack(''); setError('');
  };

  const review = async (rating: Rating) => {
    const card = data?.due[0];
    if (!card) return;
    const now = Date.now();
    const next = schedule(card, rating, now);
    await db.transaction('rw', db.flashcards, db.reviews, async () => {
      await db.flashcards.update(card.id!, { ...next, updatedAt: now });
      await db.reviews.add({ cardId: card.id!, rating, reviewedAt: now, intervalDays: next.intervalDays });
    });
    setRevealed(false);
  };

  if (!data) return <p className="muted">جارٍ التحميل…</p>;
  const current = data.due[0];

  return (
    <section className="stack">
      <h1>البطاقات</h1>
      <p className="muted">
        {data.total} بطاقة • {data.due.length} مستحقة الآن • {data.reviewCount} مراجعة مسجلة
      </p>

      {current ? (
        <div className="card stack review">
          <p className="q">{current.front}</p>
          {revealed ? (
            <>
              <p className="a">{current.back}</p>
              <div className="row wrap">
                {ratings.map(({ r, label }) => (
                  <button key={r} onClick={() => review(r)}>{label}</button>
                ))}
              </div>
            </>
          ) : (
            <button className="primary" onClick={() => setRevealed(true)}>إظهار الإجابة</button>
          )}
        </div>
      ) : (
        <p className="card muted">{data.total === 0 ? 'لا توجد بطاقات بعد. أنشئ أول بطاقة.' : 'خلصت مراجعات اليوم.'}</p>
      )}

      <form className="card stack" onSubmit={add} noValidate>
        <h2>بطاقة جديدة</h2>
        <label>السؤال<textarea rows={2} value={front} onChange={(e) => setFront(e.target.value)} /></label>
        <label>الإجابة<textarea rows={2} value={back} onChange={(e) => setBack(e.target.value)} /></label>
        <label>المادة
          <select value={subjectId ?? ''} onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">بدون مادة</option>
            {data.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        {error && <p role="alert" className="error">{error}</p>}
        <button className="primary" type="submit">حفظ البطاقة</button>
      </form>
    </section>
  );
}
