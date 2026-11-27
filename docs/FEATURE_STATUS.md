# MEMO feature status

Updated: 2026-11-27.

A successful GitHub Actions build confirms TypeScript and Vite production compilation. It does not replace manual browser, mobile, accessibility, or offline testing.

| Feature | Status |
|---|---|
| React + TypeScript + Vite + hash routing | Implemented; CI build check |
| Local IndexedDB database with versioned migrations | Implemented; schema v3 |
| Theme and language direction settings | Implemented; manual QA pending |
| Students and subject management | Implemented; manual QA pending |
| Flashcards and spaced repetition | Implemented; manual QA pending |
| Daily tasks with due date and priority | Implemented; manual QA pending |
| Study planner linked to subjects | Implemented; manual QA pending |
| Focus timer and session history | Implemented; manual QA pending |
| Progress analytics | Implemented; manual QA pending |
| JSON backup and restore | Implemented; manual QA pending |
| PWA manifest and runtime asset caching | Implemented; offline behavior must be verified on device |
| Groups, attendance, exams, finance, advanced performance lab, recurring plans, calendar sync, encrypted vault, AI features, PDF reports | Not implemented |
| Automated end-to-end browser tests and lint | Not configured |

## Next work
1. Verify all new flows on Android, including database migration from v2 to v3.
2. Test backup/restore using a throwaway backup before relying on it.
3. Verify offline launch after one successful online visit.
4. Add backlog workflows, calendar view, exams and assignments.
5. Add teacher-specific group, attendance and finance tools only if they remain in the product scope.
6. Add PDF reports and optional encrypted export.
