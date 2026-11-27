import Dexie, { type Table } from 'dexie';

export type Workspace = 'teacher' | 'personal';

interface Base {
  id?: number;
  createdAt: number;
  updatedAt: number;
}

// TEACHER workspace
export interface Student extends Base {
  workspace: 'teacher';
  name: string;
  grade: string;
  phone: string;
  archived: boolean;
}

// PERSONAL workspace
export interface Subject extends Base {
  workspace: 'personal';
  name: string;
  archived: boolean;
}

export interface Flashcard extends Base {
  workspace: 'personal';
  subjectId: number | null;
  front: string;
  back: string;
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
  due: number;
  suspended: boolean;
}

export interface ReviewRecord {
  id?: number;
  cardId: number;
  rating: 'again' | 'hard' | 'good' | 'easy';
  reviewedAt: number;
  intervalDays: number;
}

class MemoDB extends Dexie {
  students!: Table<Student, number>;
  subjects!: Table<Subject, number>;
  flashcards!: Table<Flashcard, number>;
  reviews!: Table<ReviewRecord, number>;

  constructor() {
    super('memo');
    // Schema v1. Add new versions below with .upgrade() for safe migrations; never edit v1.
    this.version(1).stores({
      students: '++id, name, grade, archived, updatedAt',
      subjects: '++id, name, archived, updatedAt',
      flashcards: '++id, subjectId, due, suspended',
      reviews: '++id, cardId, reviewedAt',
    });
  }
}

export const db = new MemoDB();
