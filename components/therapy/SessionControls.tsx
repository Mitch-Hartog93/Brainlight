import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { Clock } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import DurationPicker from './DurationPicker';

interface SessionControlsProps {
  duration: number;
  showPicker: boolean;
  onDurationPress: () => void;
  onDurationChange: (minutes: number) => void;
  onDurationPickerClose: () => void;
  isDarkMode?: boolean;
}

export default function SessionControls({
  duration,
  showPicker,
  onDurationPress,
  onDurationChange,
  onDurationPickerClose,
  isDarkMode = false,
}: SessionControlsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.controlItem}>
        <Text style={[styles.label, isDarkMode && styles.darkLabel]}>SESSION DURATION</Text>
        <TouchableOpacity 
          style={[styles.durationButton, isDarkMode && styles.darkDurationButton]}
          onPress={onDurationPress}
          activeOpacity={0.7}
        >
          <Clock size={20} color={isDarkMode ? '#FF453A' : '#FF3B30'} />
          <Text style={[styles.durationText, isDarkMode && styles.darkDurationText]}>
            {duration} minutes
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={onDurationPickerClose}
      >
        <BlurView intensity={80} style={styles.modalContainer} tint={isDarkMode ? "dark" : "light"}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
              Set Session Duration
            </Text>
            <DurationPicker
              selectedDuration={duration}
              onSelect={onDurationChange}
              isDarkMode={isDarkMode}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                onPress={onDurationPickerClose}
              >
                <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.doneButton]}
                onPress={onDurationPickerClose}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  controlItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3C3C43',
    marginBottom: 8,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  darkLabel: {
    color: '#FFFFFF',
    opacity: 0.7,
  },
  durationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  darkDurationButton: {
    backgroundColor: '#3A1212',
    borderColor: '#4D1F1F',
  },
  durationText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 12,
  },
  darkDurationText: {
    color: '#FF453A',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  darkModalContent: {
    backgroundColor: '#1C1C1E',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  darkModalTitle: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  darkCancelButton: {
    backgroundColor: '#2C2C2E',
  },
  doneButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  darkCancelButtonText: {
    color: '#FFFFFF',
  },
  doneButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});