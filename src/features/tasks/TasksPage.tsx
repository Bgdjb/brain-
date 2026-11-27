import { useMemo, useState, type FormEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Task } from '../../database/schema';

const today = () => new Date().toISOString().slice(0, 10);

export function TasksPage() {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [dueDate, setDueDate] = useState(today());
  const [priority, setPriority] = useState<Task['priority']>('normal');
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('open');
  const [error, setError] = useState('');

  const tasks = useLiveQuery(() => db.tasks.orderBy('dueDate').toArray(), []);
  const visible = useMemo(() => (tasks ?? []).filter((task) =>
    filter === 'all' || (filter === 'done' ? task.completed : !task.completed)
  ), [tasks, filter]);

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (title.trim().length < 2) {
      setError('اكتب عنوان المهمة (حرفين على الأقل).');
      return;
    }
    const now = Date.now();
    await db.tasks.add({
      title: title.trim(),
      details: details.trim(),
      dueDate,
      priority,
      completed: false,
      createdAt: now,
      updatedAt: now,
    });
    setTitle('');
    setDetails('');
    setPriority('normal');
    setError('');
  };

  const toggle = (task: Task) => db.tasks.update(task.id!, {
    completed: !task.completed,
    updatedAt: Date.now(),
  });

  const remove = async (task: Task) => {
    if (window.confirm(`حذف المهمة "${task.title}"؟`)) await db.tasks.delete(task.id!);
  };

  return (
    <section className="stack">
      <h1>المهام اليومية</h1>
      <p className="muted">نظّم يومك، وحدد الأولويات، وتابع ما أنجزته.</p>

      <form className="card stack" onSubmit={addTask} noValidate>
        <label>عنوان المهمة
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: حل واجب الرياضيات" />
        </label>
        <label>تفاصيل (اختياري)
          <textarea value={details} onChange={(e) => setDetails(e.target.value)} rows={2} />
        </label>
        <div className="grid">
          <label>موعد الإنجاز
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
          <label>الأولوية
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
              <option value="low">منخفضة</option>
              <option value="normal">عادية</option>
              <option value="high">مهمة</option>
            </select>
          </label>
        </div>
        {error && <p role="alert" className="error">{error}</p>}
        <button className="primary" type="submit">إضافة المهمة</button>
      </form>

      <div className="row wrap" aria-label="تصفية المهام">
        <button type="button" onClick={() => setFilter('open')} aria-pressed={filter === 'open'}>المفتوحة</button>
        <button type="button" onClick={() => setFilter('done')} aria-pressed={filter === 'done'}>المنجزة</button>
        <button type="button" onClick={() => setFilter('all')} aria-pressed={filter === 'all'}>الكل</button>
      </div>

      {!tasks && <p className="muted">جارٍ تحميل المهام…</p>}
      {tasks && visible.length === 0 && <p className="muted">لا توجد مهام في هذا القسم. أضف مهمتك الأولى من الأعلى.</p>}
      <ul className="list">
        {visible.map((task) => (
          <li key={task.id} className="card stack">
            <div className="item">
              <div>
                <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</strong>
                <div className="muted">{task.dueDate} · {task.priority === 'high' ? 'أولوية مهمة' : task.priority === 'low' ? 'أولوية منخفضة' : 'أولوية عادية'}</div>
              </div>
              <span className={task.completed ? 'muted' : 'priority'}>{task.completed ? 'تمت' : task.priority === 'high' ? 'مهمة' : 'قيد التنفيذ'}</span>
            </div>
            {task.details && <p className="muted">{task.details}</p>}
            <div className="row">
              <button type="button" onClick={() => toggle(task)}>{task.completed ? 'إلغاء الإنجاز' : 'تحديد كمنجزة'}</button>
              <button type="button" className="danger" onClick={() => remove(task)}>حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
