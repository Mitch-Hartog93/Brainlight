import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { History, Info, Settings } from 'lucide-react-native';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'history':
        return <History size={60} color="#C7C7CC" />;
      case 'info':
        return <Info size={60} color="#C7C7CC" />;
      case 'settings':
        return <Settings size={60} color="#C7C7CC" />;
      default:
        return <Info size={60} color="#C7C7CC" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#3C3C43',
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
  },
});