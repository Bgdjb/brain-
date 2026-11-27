import { useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';

export function StudentsPage() {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const students = useLiveQuery(
    () => db.students.orderBy('updatedAt').reverse().toArray(),
    []
  );

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('اكتب اسم الطالب (حرفان على الأقل).');
    const now = Date.now();
    await db.students.add({
      workspace: 'teacher', name: name.trim(), grade: grade.trim(), phone: phone.trim(),
      archived: false, createdAt: now, updatedAt: now,
    });
    setName(''); setGrade(''); setPhone(''); setError('');
  };

  const setArchived = (id: number, archived: boolean) =>
    db.students.update(id, { archived, updatedAt: Date.now() });

  const remove = async (id: number, n: string) => {
    if (window.confirm(`حذف الطالب "${n}" نهائيًا؟ لا يمكن التراجع.`)) await db.students.delete(id);
  };

  const list = (students ?? []).filter(
    (s) => s.archived === showArchived && s.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="stack">
      <h1>الطلاب</h1>
      <form className="card stack" onSubmit={add} noValidate>
        <label>الاسم<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>الصف<input value={grade} onChange={(e) => setGrade(e.target.value)} /></label>
        <label>الهاتف<input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
        {error && <p role="alert" className="error">{error}</p>}
        <button className="primary" type="submit">إضافة طالب</button>
      </form>

      <div className="row">
        <input aria-label="بحث" placeholder="بحث بالاسم" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button onClick={() => setShowArchived((v) => !v)}>{showArchived ? 'عرض النشطين' : 'عرض الأرشيف'}</button>
      </div>

      {students && list.length === 0 && (
        <p className="muted">{showArchived ? 'لا يوجد طلاب في الأرشيف.' : 'لا يوجد طلاب بعد. أضف أول طالب من النموذج أعلاه.'}</p>
      )}
      <ul className="list">
        {list.map((s) => (
          <li key={s.id} className="card item">
            <div>
              <strong>{s.name}</strong>
              <div className="muted">{[s.grade, s.phone].filter(Boolean).join(' • ') || 'بدون تفاصيل'}</div>
            </div>
            <div className="row">
              <button onClick={() => setArchived(s.id!, !s.archived)}>{s.archived ? 'استعادة' : 'أرشفة'}</button>
              <button className="danger" onClick={() => remove(s.id!, s.name)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
