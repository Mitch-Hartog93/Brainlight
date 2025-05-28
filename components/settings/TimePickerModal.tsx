import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
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

  if (Platform.OS === 'web') {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <BlurView intensity={80} style={styles.modalContainer} tint={isDarkMode ? "dark" : "light"}>
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.headerButton, isDarkMode && styles.darkHeaderButton]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
                Choose Time
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.headerButton}>Save</Text>
              </TouchableOpacity>
            </View>
            
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
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                  color: isDarkMode ? '#FFFFFF' : '#000000',
                }}
              />
            </View>
          </View>
        </BlurView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.headerButton, isDarkMode && styles.darkHeaderButton]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDarkMode && styles.darkHeaderTitle]}>
              Choose Time
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.headerButton, { color: '#007AFF' }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  darkModalContent: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  darkHeaderTitle: {
    color: '#FFFFFF',
  },
  headerButton: {
    fontSize: 17,
    color: '#007AFF',
    paddingHorizontal: 8,
  },
  darkHeaderButton: {
    color: '#0A84FF',
  },
  pickerWrapper: {
    alignItems: 'center',
    paddingTop: 8,
  },
  picker: {
    width: Platform.OS === 'ios' ? '100%' : 120,
    height: 216,
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
});