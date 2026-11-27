import Dexie, { type Table } from 'dexie';

export type Workspace = 'teacher' | 'personal';
interface Base { id?: number; createdAt: number; updatedAt: number; }

export interface Student extends Base {
  workspace: 'teacher'; name: string; grade: string; phone: string; archived: boolean;
}
export interface Subject extends Base {
  workspace: 'personal'; name: string; archived: boolean;
}
export interface Flashcard extends Base {
  workspace: 'personal'; subjectId: number | null; front: string; back: string;
  ease: number; intervalDays: number; reps: number; lapses: number; due: number; suspended: boolean;
}
export interface ReviewRecord {
  id?: number; cardId: number; rating: 'again' | 'hard' | 'good' | 'easy';
  reviewedAt: number; intervalDays: number;
}
export interface Task extends Base {
  title: string; details: string; dueDate: string;
  priority: 'low' | 'normal' | 'high'; completed: boolean;
}
export interface StudyPlan extends Base {
  title: string; subjectId: number | null; plannedDate: string;
  minutes: number; notes: string; completed: boolean;
}
export interface FocusSession {
  id?: number; label: string; startedAt: number; endedAt: number;
  durationMinutes: number; completed: boolean;
}
export interface StudyGroup extends Base { name: string; grade: string; notes: string; }
export interface AttendanceRecord extends Base {
  groupId: number; studentId: number; date: string;
  status: 'present' | 'absent' | 'late' | 'excused'; note: string;
}
export interface Exam extends Base {
  title: string; subjectId: number | null; examDate: string;
  maxScore: number; score: number | null; notes: string;
}
export interface FinanceEntry extends Base {
  type: 'income' | 'expense'; title: string; category: string;
  amount: number; entryDate: string; notes: string;
}

class MemoDB extends Dexie {
  students!: Table<Student, number>;
  subjects!: Table<Subject, number>;
  flashcards!: Table<Flashcard, number>;
  reviews!: Table<ReviewRecord, number>;
  tasks!: Table<Task, number>;
  studyPlans!: Table<StudyPlan, number>;
  focusSessions!: Table<FocusSession, number>;
  groups!: Table<StudyGroup, number>;
  attendance!: Table<AttendanceRecord, number>;
  exams!: Table<Exam, number>;
  finance!: Table<FinanceEntry, number>;

  constructor() {
    super('memo');
    this.version(1).stores({
      students: '++id, name, grade, archived, updatedAt',
      subjects: '++id, name, archived, updatedAt',
      flashcards: '++id, subjectId, due, suspended',
      reviews: '++id, cardId, reviewedAt',
    });
    this.version(2).stores({
      students: '++id, name, grade, archived, updatedAt',
      subjects: '++id, name, archived, updatedAt',
      flashcards: '++id, subjectId, due, suspended',
      reviews: '++id, cardId, reviewedAt',
      tasks: '++id, dueDate, completed, priority, updatedAt',
    });
    this.version(3).stores({
      students: '++id, name, grade, archived, updatedAt',
      subjects: '++id, name, archived, updatedAt',
      flashcards: '++id, subjectId, due, suspended',
      reviews: '++id, cardId, reviewedAt',
      tasks: '++id, dueDate, completed, priority, updatedAt',
      studyPlans: '++id, plannedDate, subjectId, completed, updatedAt',
      focusSessions: '++id, startedAt, endedAt, completed',
    });
    this.version(4).stores({
      students: '++id, name, grade, archived, updatedAt',
      subjects: '++id, name, archived, updatedAt',
      flashcards: '++id, subjectId, due, suspended',
      reviews: '++id, cardId, reviewedAt',
      tasks: '++id, dueDate, completed, priority, updatedAt',
      studyPlans: '++id, plannedDate, subjectId, completed, updatedAt',
      focusSessions: '++id, startedAt, endedAt, completed',
      groups: '++id, name, grade, updatedAt',
      attendance: '++id, groupId, studentId, date, status, updatedAt, [groupId+date+studentId]',
      exams: '++id, examDate, subjectId, updatedAt',
      finance: '++id, type, entryDate, category, updatedAt',
    });
  }
}
export const db = new MemoDB();
