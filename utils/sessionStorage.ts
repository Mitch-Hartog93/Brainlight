import AsyncStorage from '@react-native-async-storage/async-storage';
import { TherapySession, SessionStats } from '@/types/session';

const SESSIONS_STORAGE_KEY = 'brainlight_sessions';

export const saveSession = async (session: Omit<TherapySession, 'id'>): Promise<void> => {
  try {
    const existingSessions = await getSessions();
    const newSession = {
      ...session,
      id: generateSessionId(),
    };
    
    const updatedSessions = [...existingSessions, newSession];
    
    await AsyncStorage.setItem(
      SESSIONS_STORAGE_KEY, 
      JSON.stringify(updatedSessions)
    );
  } catch (error) {
    console.error('Error saving session:', error);
    throw new Error('Failed to save session');
  }
};

export const getSessions = async (): Promise<TherapySession[]> => {
  try {
    const sessionsJSON = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
    
    if (sessionsJSON) {
      const sessions = JSON.parse(sessionsJSON);
      return sessions.map((session: any) => ({
        ...session,
        date: new Date(session.date)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    return [];
  }
};

export const getSessionStats = async (): Promise<SessionStats> => {
  const sessions = await getSessions();
  
  const stats: SessionStats = {
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.completed).length,
    totalMinutes: Math.round(sessions.reduce((acc, s) => acc + s.actualDuration / 60, 0)),
    averageDuration: sessions.length ? 
      Math.round(sessions.reduce((acc, s) => acc + s.actualDuration, 0) / sessions.length) : 0
  };
  
  return stats;
};

export const clearSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
    throw new Error('Failed to clear sessions');
  }
};

const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};