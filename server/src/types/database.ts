import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface UsersTable {
  id: Generated<string>;
  email: string;
  display_name: string;
  gems: number;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ForumPostsTable {
  id: Generated<string>;
  author_id: string;
  title: string;
  body: string;
  tags: string[];
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ForumAnswersTable {
  id: Generated<string>;
  post_id: string;
  author_id: string;
  body: string;
  is_best: Generated<boolean>;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ClubsTable {
  id: Generated<string>;
  name: string;
  description: string;
  created_by: string;
  created_at: Generated<Date>;
}

export interface ClubMembersTable {
  club_id: string;
  user_id: string;
  joined_at: Generated<Date>;
}

export interface ClubMessagesTable {
  id: Generated<string>;
  club_id: string;
  sender_id: string;
  body: string;
  created_at: Generated<Date>;
}

export interface MissionsTable {
  id: Generated<string>;
  title: string;
  tagline: string;
  goal: number;
  progress: number;
  deadline: Date;
  status: 'active' | 'success' | 'upcoming';
  proof_id: string | null;
  updated_at: Generated<Date>;
}

export interface MissionProofsTable {
  id: Generated<string>;
  mission_id: string;
  summary: string;
  delivered_on: Date;
  highlights: string[];
  gallery: string[];
  partner: string;
  created_at: Generated<Date>;
}

export interface ImpactEventsTable {
  id: Generated<string>;
  user_id: string | null;
  mission_id: string | null;
  type: 'heart' | 'gems';
  amount: number;
  metadata: unknown;
  created_at: Generated<Date>;
}

export interface Database {
  users: UsersTable;
  forum_posts: ForumPostsTable;
  forum_answers: ForumAnswersTable;
  clubs: ClubsTable;
  club_members: ClubMembersTable;
  club_messages: ClubMessagesTable;
  missions: MissionsTable;
  mission_proofs: MissionProofsTable;
  impact_events: ImpactEventsTable;
}

export type User = Selectable<UsersTable>;
export type InsertUser = Insertable<UsersTable>;
export type UpdateUser = Updateable<UsersTable>;

export type Mission = Selectable<MissionsTable>;
