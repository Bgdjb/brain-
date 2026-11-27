import { db } from '../database/schema';
type BackupPayload={app:'MEMO';version:1;createdAt:string;tables:Record<string,unknown[]>};
type EncryptedPayload={app:'MEMO-ENCRYPTED';version:1;salt:string;iv:string;ciphertext:string};
const bytesToBase64=(bytes:Uint8Array)=>btoa(Array.from(bytes).map(b=>String.fromCharCode(b)).join(''));
const base64ToBytes=(value:string)=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
async function collectBackup():Promise<BackupPayload>{const tables:Record<string,unknown[]>={};for(const table of db.tables)tables[table.name]=await table.toArray();return{app:'MEMO',version:1,createdAt:new Date().toISOString(),tables};}
function downloadJson(value:unknown,name:string){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function asArrayBuffer(bytes:Uint8Array):ArrayBuffer{const copy=new ArrayBuffer(bytes.byteLength);new Uint8Array(copy).set(bytes);return copy;}\nasync function deriveKey(password:string,salt:Uint8Array){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:asArrayBuffer(salt),iterations:250000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
async function restorePayload(parsed:unknown){
 if(!parsed||typeof parsed!=='object')throw new Error('ملف النسخة غير صالح.');
 const payload=parsed as Partial<BackupPayload>;
 if(payload.app!=='MEMO'||payload.version!==1||!payload.tables||typeof payload.tables!=='object')throw new Error('هذا الملف ليس نسخة احتياطية متوافقة من MEMO.');
 const known=new Set(db.tables.map(t=>t.name));
 for(const [name,rows] of Object.entries(payload.tables)){if(!known.has(name)||!Array.isArray(rows))throw new Error('محتويات النسخة غير متوافقة.');}
 await db.transaction('rw',db.tables,async()=>{for(const table of db.tables){await table.clear();const rows=payload.tables?.[table.name]??[];if(rows.length)await table.bulkPut(rows as never[]);}});
}
export async function downloadBackup(){const payload=await collectBackup();downloadJson(payload,'memo-backup-'+new Date().toISOString().slice(0,10)+'.json');}
export async function restoreBackup(file:File){await restorePayload(JSON.parse(await file.text()) as unknown);}
export async function downloadEncryptedBackup(password:string){
 if(password.length<8)throw new Error('اجعل كلمة المرور 8 أحرف على الأقل.');
 const salt=crypto.getRandomValues(new Uint8Array(16));const iv=crypto.getRandomValues(new Uint8Array(12));const key=await deriveKey(password,salt);
 const plain=new TextEncoder().encode(JSON.stringify(await collectBackup()));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv:asArrayBuffer(iv)},key,plain);
 const payload:EncryptedPayload={app:'MEMO-ENCRYPTED',version:1,salt:bytesToBase64(salt),iv:bytesToBase64(iv),ciphertext:bytesToBase64(new Uint8Array(encrypted))};
 downloadJson(payload,'memo-encrypted-backup-'+new Date().toISOString().slice(0,10)+'.json');
}
export async function restoreEncryptedBackup(file:File,password:string){
 if(!password)throw new Error('اكتب كلمة مرور النسخة.');
 const value=JSON.parse(await file.text()) as Partial<EncryptedPayload>;
 if(value.app!=='MEMO-ENCRYPTED'||value.version!==1||!value.salt||!value.iv||!value.ciphertext)throw new Error('هذا ليس ملف نسخة مشفرًا صالحًا.');
 try{const key=await deriveKey(password,base64ToBytes(value.salt));const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:asArrayBuffer(base64ToBytes(value.iv))},key,asArrayBuffer(base64ToBytes(value.ciphertext)));await restorePayload(JSON.parse(new TextDecoder().decode(plain)) as unknown);}
 catch{throw new Error('تعذر فك التشفير. تأكد من كلمة المرور وسلامة الملف.');}
}
