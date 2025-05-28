import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: number, minutes: number) => void;
  currentTime: Date;
  isDarkMode?: boolean;
}

export default function TimePickerModal({
  visible,
  onClose,
  onSave,
  currentTime,
  isDarkMode = false,
}: TimePickerModalProps) {
  const [selectedTime, setSelectedTime] = React.useState(currentTime);

  const handleTimeChange = (_: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleSave = () => {
    onSave(selectedTime.getHours(), selectedTime.getMinutes());
    onClose();
  };

  const handleBackdropPress = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <Pressable style={styles.modalContainer} onPress={handleBackdropPress}>
          <BlurView intensity={20} style={styles.blurContainer} tint={isDarkMode ? "dark" : "light"}>
            <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
              <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
                Set Reminder Time
              </Text>
              
              <View style={styles.pickerContainer}>
                <input
                  type="time"
                  value={`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    const newDate = new Date(selectedTime);
                    newDate.setHours(hours, minutes);
                    setSelectedTime(newDate);
                  }}
                  style={{
                    fontSize: 24,
                    padding: 12,
                    borderRadius: 12,
                    border: `1px solid ${isDarkMode ? '#3A3A3C' : '#E5E5EA'}`,
                    backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                    color: isDarkMode ? '#FFFFFF' : '#000000',
                    width: '100%',
                    maxWidth: 200,
                    textAlign: 'center',
                  }}
                />
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, isDarkMode && styles.darkCancelButton]} 
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelText, isDarkMode && styles.darkCancelText]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleSave}
                >
                  <Text style={[styles.buttonText, styles.saveText]}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Pressable>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <BlurView intensity={20} style={styles.blurContainer} tint={isDarkMode ? "dark" : "light"}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
              Set Reminder Time
            </Text>
            
            <View style={styles.pickerWrapper}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={styles.picker}
                textColor={isDarkMode ? '#FFFFFF' : '#000000'}
                themeVariant={isDarkMode ? 'dark' : 'light'}
              />
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton, isDarkMode && styles.darkCancelButton]} 
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelText, isDarkMode && styles.darkCancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSave}
              >
                <Text style={[styles.buttonText, styles.saveText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#1C1C1E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  darkModalTitle: {
    color: '#FFFFFF',
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    width: Platform.OS === 'ios' ? '100%' : 200,
    height: 200,
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  darkCancelButton: {
    backgroundColor: '#2C2C2E',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelText: {
    color: '#000000',
  },
  darkCancelText: {
    color: '#FFFFFF',
  },
  saveText: {
    color: '#FFFFFF',
  },
});