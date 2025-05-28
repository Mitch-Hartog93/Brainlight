import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_ID_KEY = 'therapy_notification_id';
const NOTIFICATION_TIME_KEY = 'therapy_notification_time';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function getNotificationTime(): Promise<Date> {
  try {
    const timeString = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
    if (timeString) {
      return new Date(timeString);
    }
  } catch (error) {
    console.error('Error getting notification time:', error);
  }
  
  // Default to 10:00 AM
  const defaultTime = new Date();
  defaultTime.setHours(10, 0, 0, 0);
  return defaultTime;
}

export async function scheduleDailyReminder(enabled: boolean, time?: Date) {
  if (Platform.OS === 'web') {
    return;
  }

  // Cancel existing notification if any
  const existingId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId);
    await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
  }

  if (!enabled) {
    return;
  }

  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const notificationTime = time || await getNotificationTime();
    
    // Save notification time
    await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, notificationTime.toISOString());

    // Schedule new notification
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for Your Therapy Session",
        body: "Take a moment for your daily light therapy session to support your cognitive health.",
        sound: true,
      },
      trigger: {
        hour: notificationTime.getHours(),
        minute: notificationTime.getMinutes(),
        repeats: true,
      },
    });

    await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}