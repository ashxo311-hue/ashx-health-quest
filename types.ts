
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  xp: number;
}

export interface FamilyMember extends UserProfile {
  weeklyXP: number;
}

export interface DailyStats {
  steps: number;
  waterMl: number;
  date: string;
  goalSteps: number;
  goalWaterMl: number;
}

export interface AppState {
  user: UserProfile;
  dailyStats: DailyStats;
  family: FamilyMember[];
  history: DailyStats[];
}

export interface GeminiMotivationResponse {
  message: string;
  tip: string;
  tone: 'energetic' | 'supportive' | 'challenging';
}
