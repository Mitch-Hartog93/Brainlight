import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { Clock as ClockIcon } from 'lucide-react-native';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (hours: number, minutes: number) => void;
  currentTime: Date;
  isDarkMode?: boolean;
}

interface ClockFaceProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  isDarkMode: boolean;
  radius: number;
  type: 'hours' | 'minutes';
}

const ClockFace: React.FC<ClockFaceProps> = ({ value, max, onChange, isDarkMode, radius, type }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - radius;
    const y = e.clientY - rect.top - radius;
    const angle = Math.atan2(y, x);
    let newValue = Math.round((angle + Math.PI / 2) / (2 * Math.PI) * max);
    
    if (newValue < 0) newValue += max;
    if (type === 'hours' && newValue === 0) newValue = 12;
    
    onChange(newValue);
  }, [isDragging, max, onChange, radius, type]);

  const numbers = Array.from({ length: max }, (_, i) => {
    const number = type === 'hours' ? (i === 0 ? 12 : i) : i;
    const angle = (2 * Math.PI * i) / max - Math.PI / 2;
    const x = radius + (radius - 30) * Math.cos(angle);
    const y = radius + (radius - 30) * Math.sin(angle);

    return (
      <Text
        key={i}
        style={[
          styles.clockNumber,
          {
            left: x,
            top: y,
            color: isDarkMode ? '#FFFFFF' : '#000000',
            opacity: number === value ? 1 : 0.5,
          },
        ]}
      >
        {number.toString().padStart(2, '0')}
      </Text>
    );
  });

  const handAngle = ((value % max) / max) * 2 * Math.PI - Math.PI / 2;
  const handX = radius + (radius - 40) * Math.cos(handAngle);
  const handY = radius + (radius - 40) * Math.sin(handAngle);

  return (
    <View
      style={[
        styles.clockFace,
        {
          width: radius * 2,
          height: radius * 2,
          backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
        },
      ]}
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {numbers}
      <View
        style={[
          styles.clockHand,
          {
            backgroundColor: '#007AFF',
            transform: [
              { translateX: handX - 2 },
              { translateY: handY - 2 },
            ],
          },
        ]}
      />
      <View style={styles.clockCenter} />
    </View>
  );
};

export default function TimePickerModal({
  visible,
  onClose,
  onSave,
  currentTime,
  isDarkMode = false,
}: TimePickerModalProps) {
  const [selectedTime, setSelectedTime] = React.useState(currentTime);
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');

  const handleTimeChange = (_: any, date?: Date) => {
    if (date) {
      setSelectedTime(date);
    }
  };

  const handleHourChange = (hour: number) => {
    const newDate = new Date(selectedTime);
    newDate.setHours(hour);
    setSelectedTime(newDate);
    setMode('minutes');
  };

  const handleMinuteChange = (minute: number) => {
    const newDate = new Date(selectedTime);
    newDate.setMinutes(minute);
    setSelectedTime(newDate);
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
              <View style={styles.header}>
                <ClockIcon size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.modalTitle, isDarkMode && styles.darkModalTitle]}>
                  Set Reminder Time
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.timeDisplay, isDarkMode && styles.darkTimeDisplay]}
                onPress={() => setMode(mode === 'hours' ? 'minutes' : 'hours')}
              >
                <Text style={[styles.timeText, isDarkMode && styles.darkTimeText]}>
                  {`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}
                </Text>
              </TouchableOpacity>

              <View style={styles.clockContainer}>
                {mode === 'hours' ? (
                  <ClockFace
                    value={selectedTime.getHours() % 12 || 12}
                    max={12}
                    onChange={handleHourChange}
                    isDarkMode={isDarkMode}
                    radius={120}
                    type="hours"
                  />
                ) : (
                  <ClockFace
                    value={selectedTime.getMinutes()}
                    max={60}
                    onChange={handleMinuteChange}
                    isDarkMode={isDarkMode}
                    radius={120}
                    type="minutes"
                  />
                )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  darkModalTitle: {
    color: '#FFFFFF',
  },
  timeDisplay: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  darkTimeDisplay: {
    backgroundColor: '#2C2C2E',
  },
  timeText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
  },
  darkTimeText: {
    color: '#FFFFFF',
  },
  clockContainer: {
    marginBottom: 24,
  },
  clockFace: {
    borderRadius: 999,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockNumber: {
    position: 'absolute',
    width: 30,
    height: 30,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  clockHand: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  clockCenter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
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