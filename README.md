# MEMO (foundation, Milestone 2)

Arabic-first private teacher + personal-learning app. Local-first: data stays in IndexedDB on your device.

## Commands
    npm install
    npm run dev        # development
    npm run typecheck
    npm test           # SRS unit tests
    npm run build      # typecheck + production build
    npm run preview    # test the PWA/offline shell after build

## Structure
- `src/database/schema.ts` Dexie schema (versioned; add migrations as new versions)
- `src/utils/srs.ts` spaced repetition (simplified SM-2)
- `src/features/*` one folder per feature
- `docs/FEATURE_STATUS.md` what is and isn't built

Teacher tables (`students`) and personal tables (`subjects`, `flashcards`, `reviews`) are separate and never joined.
