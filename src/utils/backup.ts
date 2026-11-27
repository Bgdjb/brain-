import { db } from '../database/schema';

type BackupPayload = {
  app: 'MEMO';
  version: 1;
  createdAt: string;
  tables: Record<string, unknown[]>;
};

export async function downloadBackup() {
  const tables: Record<string, unknown[]> = {};
  for (const table of db.tables) tables[table.name] = await table.toArray();
  const payload: BackupPayload = {
    app: 'MEMO', version: 1, createdAt: new Date().toISOString(), tables,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `memo-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function restoreBackup(file: File) {
  const parsed: unknown = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object') throw new Error('ملف النسخة غير صالح.');
  const payload = parsed as Partial<BackupPayload>;
  if (payload.app !== 'MEMO' || payload.version !== 1 || !payload.tables || typeof payload.tables !== 'object') {
    throw new Error('هذا الملف ليس نسخة احتياطية متوافقة من MEMO.');
  }
  const known = new Set(db.tables.map((table) => table.name));
  for (const [name, rows] of Object.entries(payload.tables)) {
    if (!known.has(name) || !Array.isArray(rows)) throw new Error('محتويات النسخة غير متوافقة.');
  }
  await db.transaction('rw', db.tables, async () => {
    for (const table of db.tables) {
      await table.clear();
      const rows = payload.tables?.[table.name] ?? [];
      if (rows.length) await table.bulkPut(rows as never[]);
    }
  });
}
