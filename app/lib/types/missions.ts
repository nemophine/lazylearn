export type MissionStatus = 'active' | 'success' | 'upcoming';

export interface MissionSummary {
  id: string;
  title: string;
  tagline: string;
  status: MissionStatus;
  progress: number;
  goal: number;
  deadline: string;
  heartsRaised: number;
  contributors: number;
  updatedAt: string;
  proofId?: string;
}

export interface MissionCurrentResponse {
  mission: MissionSummary;
  meta: {
    cached: boolean;
    expiresInSeconds: number;
  };
}

export interface MissionProofResponse {
  proof: {
    id: string;
    missionId: string;
    summary: string;
    deliveredOn: string;
    impactHighlights: string[];
    gallery: string[];
    partner: string;
  };
}
