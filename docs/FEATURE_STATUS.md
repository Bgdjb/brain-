# MEMO feature status
Updated: 2026-11-27.

A successful GitHub Actions build confirms TypeScript and Vite production compilation; it does not replace device QA.

| Area | Implemented |
|---|---|
| Core app, local IndexedDB, migrations v1-v4 | Yes |
| Students, subjects, flashcards, spaced repetition | Yes |
| Daily tasks, overdue backlog filter, priorities | Yes |
| Study planner, optional weekly repeat for four weeks | Yes |
| Focus timer and session history | Yes |
| Progress analytics | Yes |
| JSON backup and restore (all current Dexie tables) | Yes |\n| Optional AES-GCM encrypted backup and restore (PBKDF2 key derivation) | Yes |
| Groups and daily attendance statuses | Yes |
| Exams, subjects, dates, scores | Yes |
| Income, expenses, categories, balance | Yes |
| Monthly calendar for tasks, plans and exams | Yes |
| Printable summary reports; browser print-to-PDF | Yes |
| PWA install shell and service worker | Present; offline QA required |
| AI assistant / cloud sync / third-party calendar sync | Not connected; requires external services and credentials |
| Automated end-to-end tests | Not configured |

## Important notes
- New database tables are added in schema v4; existing tables are preserved by Dexie migration.
- Backup export iterates over all database tables, so it includes the new tables. Restore replaces local records after explicit confirmation.
- Reports use the browser print dialog; choose Save as PDF when offered.
- Attendance is recorded for active students against the selected group and date.
- Weekly repetition creates four weekly plan entries; it is not an indefinite recurring rule.
- Verify all new flows on Android, backup/restore with a test copy, and offline launch before relying on them.
