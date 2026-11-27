import { useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';

const today = () => new Date().toISOString().slice(0, 10);

export function PlannerPage() {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [plannedDate, setPlannedDate] = useState(today());
  const [minutes, setMinutes] = useState('45');
  const [notes, setNotes] = useState('');
  const [showDone, setShowDone] = useState(false);
  const subjects = useLiveQuery(() => db.subjects.filter((s) => !s.archived).toArray(), []);
  const plans = useLiveQuery(() => db.studyPlans.orderBy('plannedDate').toArray(), []);
  const visible = (plans ?? []).filter((p) => p.completed === showDone);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 2) return;
    const now = Date.now();
    await db.studyPlans.add({
      title: title.trim(), subjectId: subjectId ? Number(subjectId) : null,
      plannedDate, minutes: Math.max(5, Math.min(600, Number(minutes) || 45)),
      notes: notes.trim(), completed: false, createdAt: now, updatedAt: now,
    });
    setTitle(''); setNotes('');
  };
  const toggle = (id: number, completed: boolean) =>
    db.studyPlans.update(id, { completed: !completed, updatedAt: Date.now() });
  const remove = (id: number) => {
    if (window.confirm('حذف بند الخطة؟')) return db.studyPlans.delete(id);
  };

  return <section className="stack">
    <h1>خطة المذاكرة</h1>
    <p className="muted">حوّل المواد إلى جلسات واضحة بموعد ووقت محدد.</p>
    <form className="card stack" onSubmit={add}>
      <label>المطلوب مذاكرته<input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: قوانين الحركة" required minLength={2} /></label>
      <div className="grid">
        <label>المادة
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">بدون مادة محددة</option>
            {(subjects ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>التاريخ<input type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} /></label>
      </div>
      <label>المدة بالدقائق<input type="number" min="5" max="600" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></label>
      <label>ملاحظات<textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
      <button className="primary" type="submit">إضافة للخطة</button>
    </form>
    <div className="row wrap">
      <button type="button" aria-pressed={!showDone} onClick={() => setShowDone(false)}>المتبقي</button>
      <button type="button" aria-pressed={showDone} onClick={() => setShowDone(true)}>المنجز</button>
    </div>
    {!plans && <p className="muted">جارٍ التحميل…</p>}
    {plans && visible.length === 0 && <p className="muted">لا توجد عناصر هنا حاليًا.</p>}
    <ul className="list">{visible.map((p) => {
      const subject = subjects?.find((s) => s.id === p.subjectId);
      return <li className="card stack" key={p.id}>
        <div className="item"><strong>{p.title}</strong><span className="muted">{p.minutes} دقيقة</span></div>
        <p className="muted">{p.plannedDate}{subject ? ' · ' + subject.name : ''}</p>
        {p.notes && <p className="muted">{p.notes}</p>}
        <div className="row"><button onClick={() => toggle(p.id!, p.completed)}>{p.completed ? 'إعادة للمتبقي' : 'تم الإنجاز'}</button><button className="danger" onClick={() => remove(p.id!)}>حذف</button></div>
      </li>;
    })}</ul>
  </section>;
}
