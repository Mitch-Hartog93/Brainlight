export interface TherapySession {
  id: string;
  date: Date;
  duration: number;
  actualDuration: number;
  completed: boolean;
  userId?: string;
}

export interface SessionStats {
  totalSessions: number;
  completedSessions: number;
  totalMinutes: number;
  averageDuration: number;
}