# MEMO feature status

Last updated: 2026-11-27. Deployment is configured through GitHub Actions. A successful deployment confirms the production build completed, not that every feature has been browser-tested.

| Feature | Status |
|---|---|
| Vite + React + TypeScript + hash routing | Implemented; production build passed in GitHub Actions |
| Dexie local database | Implemented; schema v1 plus v2 task-table migration |
| Dark/light/system theme and RTL/LTR setting | Implemented; browser behavior still needs manual QA |
| Responsive navigation | Implemented; manual device QA pending |
| Students: add, search, archive/restore, delete | Implemented; manual QA pending |
| Subjects: add, archive/restore, delete | Implemented; manual QA pending |
| Flashcards and spaced repetition | Implemented; manual QA pending |
| Daily tasks: add, details, due date, priority, complete/reopen, filter, delete | Implemented; manual QA pending |
| Dashboard counts for students, subjects, due cards, open tasks | Implemented; manual QA pending |
| PWA manifest and service worker app shell | Implemented; offline behavior not yet verified on device |
| Groups, attendance, exams, finance, performance analytics, backlog, focus timer, vault, AI, reports, backup/restore | Not implemented yet |
| Lint and end-to-end browser tests | Not configured |
| Production PNG app icons | Not configured (SVG currently used) |

## Next milestones
1. Study planner and backlog.
2. Focus timer with session history.
3. Progress analytics and reports.
4. Backup/export and restore.
5. Offline/device QA and accessibility pass.
