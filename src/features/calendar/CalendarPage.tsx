import { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../database/schema';
export function CalendarPage(){
 const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
 const tasks=useLiveQuery(()=>db.tasks.toArray(),[]);const plans=useLiveQuery(()=>db.studyPlans.toArray(),[]);const exams=useLiveQuery(()=>db.exams.toArray(),[]);
 const items=useMemo(()=>[...(tasks??[]).filter(x=>!x.completed).map(x=>({date:x.dueDate,title:x.title,type:'مهمة'})),...(plans??[]).filter(x=>!x.completed).map(x=>({date:x.plannedDate,title:x.title,type:'خطة مذاكرة'})),...(exams??[]).map(x=>({date:x.examDate,title:x.title,type:'امتحان'}))].filter(x=>x.date.startsWith(month)).sort((a,b)=>a.date.localeCompare(b.date)),[tasks,plans,exams,month]);
 const move=(n:number)=>{const d=new Date(month+'-01T12:00:00');d.setMonth(d.getMonth()+n);setMonth(d.toISOString().slice(0,7));};
 return <section className="stack"><h1>التقويم</h1><div className="card item"><button onClick={()=>move(-1)}>السابق</button><strong>{new Intl.DateTimeFormat('ar-EG',{month:'long',year:'numeric'}).format(new Date(month+'-01T12:00:00'))}</strong><button onClick={()=>move(1)}>التالي</button></div><label>اختيار الشهر<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label>{items.length===0?<p className="muted">لا توجد مواعيد مسجلة في هذا الشهر.</p>:<div className="stack">{items.map((x,i)=><div className="card item" key={x.type+x.date+x.title+i}><div><strong>{x.title}</strong><div className="muted">{x.date}</div></div><span className="priority">{x.type}</span></div>)}</div>}</section>;
}