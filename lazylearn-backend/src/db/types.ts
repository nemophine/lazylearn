
import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

// Helper types for UUID and Timestamptz
export type UUID = string;
export type Timestamp = ColumnType<Date, string | undefined, string | undefined>;

// 1. FocusSession Table
export interface FocusSessionTable {
  id: Generated<UUID>;
  ownerId: UUID;
  lessonId: UUID | null;
  durationSet: number; // in seconds
  durationFocused: number; // in seconds
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  musicTrack: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type FocusSession = Selectable<FocusSessionTable>;
export type NewFocusSession = Insertable<FocusSessionTable>;
export type UpdateFocusSession = Updateable<FocusSessionTable>;

// 2. FocusSessionParticipant Table
export interface FocusSessionParticipantTable {
  id: Generated<UUID>;
  sessionId: UUID;
  userId: UUID;
  status: 'invited' | 'accepted' | 'declined' | 'left';
  createdAt: Timestamp;
}

export type FocusSessionParticipant = Selectable<FocusSessionParticipantTable>;
export type NewFocusSessionParticipant = Insertable<FocusSessionParticipantTable>;
export type UpdateFocusSessionParticipant = Updateable<FocusSessionParticipantTable>;

// 3. DailyFocusLog Table
export interface DailyFocusLogTable {
  id: Generated<UUID>;
  userId: UUID;
  date: ColumnType<Date, string, string>; // Stored as DATE
  totalSeconds: number;
  createdAt: Timestamp;
}

export type DailyFocusLog = Selectable<DailyFocusLogTable>;
export type NewDailyFocusLog = Insertable<DailyFocusLogTable>;
export type UpdateDailyFocusLog = Updateable<DailyFocusLogTable>;

// Main Database Interface
export interface Database {
  focusSession: FocusSessionTable;
  focusSessionParticipant: FocusSessionParticipantTable;
  dailyFocusLog: DailyFocusLogTable;
}
