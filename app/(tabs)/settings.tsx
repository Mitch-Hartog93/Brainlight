import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { BellRing, Info, Moon, Wifi, Volume2, Clock } from 'lucide-react-native';
import SettingItem from '@/components/settings/SettingItem';
import TimePickerModal from '@/components/settings/TimePickerModal';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleDailyReminder, getNotificationTime } from '@/utils/notifications';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Load notification preference
      const savedNotificationPreference = await AsyncStorage.getItem('notifications_enabled');
      setNotifications(savedNotificationPreference === 'true');

      // Load notification time
      const savedTime = await getNotificationTime();
      setNotificationTime(savedTime);

      // Load audio preference
      const savedAudioPreference = await AsyncStorage.getItem('audio_enabled');
      setAudioEnabled(savedAudioPreference === 'true');
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    setNotifications(value);
    try {
      await AsyncStorage.setItem('notifications_enabled', value.toString());
      await scheduleDailyReminder(value, notificationTime);
    } catch (error) {
      console.error('Error saving notification preference:', error);
    }
  };

  const handleTimeChange = async (hours: number, minutes: number) => {
    const newTime = new Date();
    newTime.setHours(hours, minutes, 0, 0);
    setNotificationTime(newTime);
    
    if (notifications) {
      await scheduleDailyReminder(true, newTime);
    }
  };

  const toggleAudio = async (value: boolean) => {
    setAudioEnabled(value);
    try {
      await AsyncStorage.setItem('audio_enabled', value.toString());
    } catch (error) {
      console.error('Error saving audio preference:', error);
    }
  };

  const showNotImplemented = () => {
    Alert.alert(
      "Feature Not Available",
      "This feature is not implemented in the current version.",
      [{ text: "OK" }]
    );
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Therapy Settings</Text>
        <SettingItem
          icon={<Volume2 size={22} color="#0066CC" />}
          title="Audio Stimulation"
          description="Enable 40Hz binaural beats alongside visual stimulation"
          isDarkMode={isDarkMode}
          right={
            <Switch
              value={audioEnabled}
              onValueChange={toggleAudio}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5EA"
            />
          }
          showBorder={true}
        />
        <SettingItem
          icon={<BellRing size={22} color="#0066CC" />}
          title="Daily Reminder"
          description="Receive a daily reminder for your therapy session"
          isDarkMode={isDarkMode}
          right={
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5EA"
            />
          }
          showBorder={true}
        />
        {notifications && (
          <SettingItem
            icon={<Clock size={22} color="#0066CC" />}
            title="Reminder Time"
            description={`Daily reminder at ${formatTime(notificationTime)}`}
            isDarkMode={isDarkMode}
            onPress={() => setShowTimePicker(true)}
            right={<Clock size={20} color={isDarkMode ? '#C7C7CC' : '#C7C7CC'} />}
            showBorder={false}
          />
        )}
      </View>

      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Application Settings</Text>
        <SettingItem
          icon={<Moon size={22} color="#0066CC" />}
          title="Dark Mode"
          description="Use dark theme for the application"
          isDarkMode={isDarkMode}
          right={
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5EA"
            />
          }
        />
        <SettingItem
          icon={<Wifi size={22} color="#0066CC" />}
          title="Offline Mode"
          description="Use app without internet connection"
          isDarkMode={isDarkMode}
          right={
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5EA"
            />
          }
          showBorder={false}
        />
      </View>
      
      <View style={[styles.section, isDarkMode && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>About</Text>
        <SettingItem
          icon={<Info size={22} color="#0066CC" />}
          title="Privacy Policy"
          description="View our privacy policy"
          isDarkMode={isDarkMode}
          right={<Info size={20} color={isDarkMode ? '#C7C7CC' : '#C7C7CC'} />}
          onPress={showNotImplemented}
        />
        <SettingItem
          icon={<Info size={22} color="#0066CC" />}
          title="Terms of Service"
          description="View our terms of service"
          isDarkMode={isDarkMode}
          right={<Info size={20} color={isDarkMode ? '#C7C7CC' : '#C7C7CC'} />}
          onPress={showNotImplemented}
          showBorder={false}
        />
      </View>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, isDarkMode && styles.darkText]}>Brainlight</Text>
        <Text style={[styles.versionNumber, isDarkMode && { color: '#8E8E93' }]}>Version 1.0.0</Text>
      </View>
      
      <TouchableOpacity style={styles.contactButton} onPress={showNotImplemented}>
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>

      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSave={handleTimeChange}
        currentTime={notificationTime}
        isDarkMode={isDarkMode}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSection: {
    backgroundColor: '#1A1A1A',
    borderColor: '#2C2C2E',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3C3C43',
    textTransform: 'uppercase',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    opacity: 0.6,
  },
  darkText: {
    color: '#FFFFFF',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  versionNumber: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  contactButton: {
    backgroundColor: '#0066CC',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});