import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  right: React.ReactNode;
  onPress?: () => void;
  showBorder?: boolean;
  isDarkMode?: boolean;
}

export default function SettingItem({
  icon,
  title,
  description,
  right,
  onPress,
  showBorder = true,
  isDarkMode = false,
}: SettingItemProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[
        styles.container, 
        !showBorder && styles.noBorder,
        isDarkMode && styles.darkBorder
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>{title}</Text>
          <Text style={[styles.description, isDarkMode && styles.darkDescription]}>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.rightContent}>{right}</View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkBorder: {
    borderBottomColor: '#2C2C2E',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  darkText: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#3C3C43',
    opacity: 0.6,
  },
  darkDescription: {
    color: '#FFFFFF',
    opacity: 0.6,
  },
  rightContent: {
    marginLeft: 8,
  },
});