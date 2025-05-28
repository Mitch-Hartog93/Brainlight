import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, Trash2 } from 'lucide-react-native';
import { getSessions, clearSessions } from '@/utils/sessionStorage';
import { formatDate, formatDuration } from '@/utils/dateUtils';
import EmptyState from '@/components/common/EmptyState';
import { useTheme } from '@/context/ThemeContext';

export default function HistoryScreen() {
  const [sessions, setSessions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const savedSessions = await getSessions();
    setSessions(savedSessions.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleClearHistory = async () => {
    await clearSessions();
    setSessions([]);
    setShowConfirmModal(false);
  };

  const renderSessionItem = ({ item }) => {
    const date = new Date(item.date);
    const actualDuration = item.actualDuration || item.duration;
    const isIncomplete = actualDuration < item.duration;

    return (
      <View style={[styles.sessionItem, isDarkMode && styles.darkSessionItem]}>
        <View style={styles.sessionHeader}>
          <View style={styles.dateContainer}>
            <Calendar size={18} color={isDarkMode ? '#60A5FA' : '#0066CC'} />
            <Text style={[styles.dateText, isDarkMode && styles.darkText]}>
              {formatDate(date)}
            </Text>
          </View>
          <View style={[
            styles.statusBadge, 
            isIncomplete ? styles.incompleteBadge : styles.completedBadge,
            isDarkMode && (isIncomplete ? styles.darkIncompleteBadge : styles.darkCompletedBadge)
          ]}>
            <Text style={[
              styles.statusText,
              isIncomplete ? styles.incompleteText : styles.completedText,
              isDarkMode && (isIncomplete ? styles.darkIncompleteText : styles.darkCompletedText)
            ]}>
              {isIncomplete ? 'INCOMPLETE' : 'COMPLETED'}
            </Text>
          </View>
        </View>
        <View style={styles.sessionDetails}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, isDarkMode && styles.darkDetailLabel]}>
              Duration:
            </Text>
            <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
              {formatDuration(actualDuration)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, isDarkMode && styles.darkDetailLabel]}>
              Time:
            </Text>
            <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
              {`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`}
            </Text>
          </View>
          {isIncomplete && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, isDarkMode && styles.darkDetailLabel]}>
                Planned Duration:
              </Text>
              <Text style={[styles.detailValue, isDarkMode && styles.darkText]}>
                {formatDuration(item.duration)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {sessions.length > 0 ? (
        <>
          <View style={[styles.headerContainer, isDarkMode && styles.darkHeaderContainer]}>
            <Text style={[styles.headerText, isDarkMode && styles.darkText]}>
              Your Therapy Sessions
            </Text>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setShowConfirmModal(true)}
            >
              <Trash2 size={18} color="#FF3B30" />
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sessions}
            renderItem={renderSessionItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <EmptyState
          icon="history"
          title="No Sessions Yet"
          message="Your completed therapy sessions will appear here."
        />
      )}
      
      {showConfirmModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDarkMode && styles.darkModalContainer]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.darkText]}>
              Clear History
            </Text>
            <Text style={[styles.modalMessage, isDarkMode && styles.darkModalMessage]}>
              Are you sure you want to clear all session history? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.darkCancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.cancelButtonText, isDarkMode && styles.darkCancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleClearHistory}
              >
                <Text style={styles.confirmButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  darkHeaderContainer: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FF3B30',
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
  },
  sessionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  darkSessionItem: {
    backgroundColor: '#1C1C1E',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  darkCompletedBadge: {
    backgroundColor: 'rgba(48, 209, 88, 0.2)',
  },
  incompleteBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  darkIncompleteBadge: {
    backgroundColor: 'rgba(255, 159, 10, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    color: '#34C759',
  },
  darkCompletedText: {
    color: '#30D158',
  },
  incompleteText: {
    color: '#FF9500',
  },
  darkIncompleteText: {
    color: '#FF9F0A',
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#3C3C43',
    opacity: 0.6,
  },
  darkDetailLabel: {
    color: '#EBEBF5',
    opacity: 0.6,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  darkModalContainer: {
    backgroundColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: '#3C3C43',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  darkModalMessage: {
    color: '#EBEBF5',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  darkCancelButton: {
    backgroundColor: '#3A3A3C',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0066CC',
  },
  darkCancelButtonText: {
    color: '#0A84FF',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});