import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface InfoSectionProps {
  title: string;
  content: string;
  initiallyExpanded?: boolean;
  isDarkMode?: boolean;
}

export default function InfoSection({ 
  title, 
  content, 
  initiallyExpanded = false,
  isDarkMode = false,
}: InfoSectionProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded ? 1 : 0, { duration: 200 }),
      maxHeight: withTiming(expanded ? 1000 : 0, { duration: 300 }),
      overflow: 'hidden',
    };
  });

  return (
    <View style={[styles.section, isDarkMode && styles.darkSection]}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={[styles.sectionTitle, isDarkMode && { color: '#60A5FA' }]}>{title}</Text>
        {expanded ? (
          <ChevronUp size={20} color={isDarkMode ? '#60A5FA' : '#0066CC'} />
        ) : (
          <ChevronDown size={20} color={isDarkMode ? '#60A5FA' : '#0066CC'} />
        )}
      </TouchableOpacity>
      
      <Animated.View style={[styles.sectionContent, contentStyle]}>
        <Text style={[styles.contentText, isDarkMode && styles.darkContentText]}>{content}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSection: {
    backgroundColor: '#1C1C1E',
    borderColor: '#2C2C2E',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0066CC',
    flex: 1,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 22,
  },
  darkContentText: {
    color: '#E5E5EA',
  },
});