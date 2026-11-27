import { useEffect, useRef, useState } from 'react';
import { db } from '../../database/schema';
import { useLiveQuery } from 'dexie-react-hooks';

export function FocusPage() {
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [label, setLabel] = useState('جلسة مذاكرة');
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const startedAt = useRef<number | null>(null);
  const sessions = useLiveQuery(() => db.focusSessions.orderBy('startedAt').reverse().limit(8).toArray(), []);

  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) {
        setRunning(false);
        const start = startedAt.current ?? Date.now() - minutes * 60000;
        const elapsed = Math.max(1, Math.round((Date.now() - start) / 60000));
        void db.focusSessions.add({
          label: label.trim() || 'جلسة تركيز',
          startedAt: start, endedAt: Date.now(),
          durationMinutes: Math.min(minutes, elapsed), completed: true,
        });
        startedAt.current = null;
      }
    };
    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, [running, label, minutes]);

  const start = () => {
    const seconds = remaining <= 0 ? minutes * 60 : remaining;
    setRemaining(seconds);
    if (startedAt.current === null) startedAt.current = Date.now();
    deadline.current = Date.now() + seconds * 1000;
    setRunning(true);
  };
  const pause = () => {
    setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    setRunning(false);
  };
  const reset = () => {
    setRunning(false); setRemaining(minutes * 60); startedAt.current = null;
  };
  const changeMinutes = (value: number) => {
    const safe = Math.max(1, Math.min(180, value || 25));
    setMinutes(safe); setRemaining(safe * 60); setRunning(false); startedAt.current = null;
  };
  const display = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  const total = minutes * 60;
  const progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));

  return <section className="stack">
    <h1>مؤقت التركيز</h1>
    <p className="muted">ابدأ جلسة واحدة، وامنحها انتباهك الكامل.</p>
    <div className="card stack focus-card">
      <label>اسم الجلسة<input value={label} onChange={(e) => setLabel(e.target.value)} disabled={running} /></label>
      <label>مدة الجلسة بالدقائق<input type="number" min="1" max="180" value={minutes} disabled={running} onChange={(e) => changeMinutes(Number(e.target.value))} /></label>
      <div className="timer" role="timer" aria-live="off">{display}</div>
      <div className="progress-track"><div className="progress-fill" style={{ width: progress + '%' }} /></div>
      <div className="row">
        {!running ? <button className="primary" onClick={start}>{remaining === total ? 'ابدأ التركيز' : 'استكمال'}</button> : <button className="primary" onClick={pause}>إيقاف مؤقت</button>}
        <button onClick={reset}>إعادة ضبط</button>
      </div>
      <p className="muted">عند اكتمال الوقت تُسجّل الجلسة تلقائيًا. اترك الصفحة مفتوحة أثناء الجلسة للحصول على أفضل دقة.</p>
    </div>
    <h2>آخر الجلسات</h2>
    {!sessions?.length && <p className="muted">لم تُسجّل جلسات بعد.</p>}
    <ul className="list">{(sessions ?? []).map((s) => <li className="card item" key={s.id}>
      <div><strong>{s.label}</strong><div className="muted">{new Date(s.startedAt).toLocaleString('ar-EG')}</div></div>
      <strong>{s.durationMinutes} دقيقة</strong>
    </li>)}</ul>
  </section>;
}
