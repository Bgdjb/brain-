import { useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';

export function SubjectsPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const subjects = useLiveQuery(() => db.subjects.orderBy('updatedAt').reverse().toArray(), []);

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('اكتب اسم المادة.');
    const now = Date.now();
    await db.subjects.add({ workspace: 'personal', name: name.trim(), archived: false, createdAt: now, updatedAt: now });
    setName(''); setError('');
  };

  const remove = async (id: number, n: string) => {
    if (!window.confirm(`حذف المادة "${n}"؟ البطاقات المرتبطة بها ستبقى بدون مادة.`)) return;
    await db.transaction('rw', db.subjects, db.flashcards, async () => {
      await db.flashcards.where('subjectId').equals(id).modify({ subjectId: null });
      await db.subjects.delete(id);
    });
  };

  return (
    <section className="stack">
      <h1>موادي</h1>
      <form className="card row" onSubmit={add} noValidate>
        <input aria-label="اسم المادة" placeholder="مثال: الفيزياء" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="primary" type="submit">إضافة</button>
      </form>
      {error && <p role="alert" className="error">{error}</p>}
      {subjects && subjects.length === 0 && <p className="muted">لا توجد مواد بعد. أضف مادتك الأولى.</p>}
      <ul className="list">
        {subjects?.map((s) => (
          <li key={s.id} className="card item">
            <strong className={s.archived ? 'muted' : ''}>{s.name}{s.archived ? ' (مؤرشفة)' : ''}</strong>
            <div className="row">
              <button onClick={() => db.subjects.update(s.id!, { archived: !s.archived, updatedAt: Date.now() })}>
                {s.archived ? 'استعادة' : 'أرشفة'}
              </button>
              <button className="danger" onClick={() => remove(s.id!, s.name)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
