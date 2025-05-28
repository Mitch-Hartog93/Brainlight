import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface DurationPickerProps {
  selectedDuration: number;
  onSelect: (duration: number) => void;
  isDarkMode?: boolean;
}

const durationOptions = [5, 10, 15, 20, 30, 45, 60];

export default function DurationPicker({ 
  selectedDuration, 
  onSelect,
  isDarkMode = false,
}: DurationPickerProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
      >
        {durationOptions.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.optionButton,
              isDarkMode && styles.darkOptionButton,
              selectedDuration === duration && (isDarkMode ? styles.darkSelectedOption : styles.selectedOption),
            ]}
            onPress={() => onSelect(duration)}
          >
            <Text
              style={[
                styles.optionText,
                isDarkMode && styles.darkOptionText,
                selectedDuration === duration && styles.selectedOptionText,
              ]}
            >
              {duration} min
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={[styles.infoText, isDarkMode && styles.darkInfoText]}>
        Recommended session duration is 15-30 minutes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  optionsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  optionButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkOptionButton: {
    backgroundColor: '#2C2C2E',
  },
  selectedOption: {
    backgroundColor: '#0066CC',
  },
  darkSelectedOption: {
    backgroundColor: '#0A84FF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3C3C43',
  },
  darkOptionText: {
    color: '#FFFFFF',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  darkInfoText: {
    color: '#98989D',
  },
});