import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_STORAGE_KEY = 'brainlight_sessions';

export interface Session {
  date: Date;
  duration: number; // planned duration in seconds
  actualDuration?: number; // actual duration in seconds
  completed: boolean;
}

export const saveSession = async (session: Session): Promise<void> => {
  try {
    // Get existing sessions
    const existingSessions = await getSessions();
    
    // Add new session
    const updatedSessions = [...existingSessions, session];
    
    // Save to storage
    await AsyncStorage.setItem(
      SESSIONS_STORAGE_KEY, 
      JSON.stringify(updatedSessions)
    );
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const getSessions = async (): Promise<Session[]> => {
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

export const clearSessions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SESSIONS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
};