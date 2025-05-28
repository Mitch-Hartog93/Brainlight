import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Send, X } from 'lucide-react-native';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function ContactModal({
  visible,
  onClose,
  isDarkMode = false,
}: ContactModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setIsSending(true);

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          deviceInfo: `Platform: ${Platform.OS}\nVersion: ${Platform.Version}`,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setSubject('');
        setMessage('');
      }, 2000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setSubject('');
    setMessage('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={resetForm}
    >
      <BlurView intensity={20} style={styles.container} tint={isDarkMode ? "dark" : "light"}>
        <View style={[styles.content, isDarkMode && styles.darkContent]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDarkMode && styles.darkText]}>Contact Support</Text>
            <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDarkMode && styles.darkText]}>Subject</Text>
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && styles.darkInput,
                  isDarkMode && styles.darkText
                ]}
                value={subject}
                onChangeText={setSubject}
                placeholder="Enter subject"
                placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, isDarkMode && styles.darkText]}>Message</Text>
              <TextInput
                style={[
                  styles.textArea,
                  isDarkMode && styles.darkInput,
                  isDarkMode && styles.darkText
                ]}
                value={message}
                onChangeText={setMessage}
                placeholder="Type your message here..."
                placeholderTextColor={isDarkMode ? '#666666' : '#999999'}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {success && (
              <Text style={styles.successText}>Message sent successfully!</Text>
            )}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSending && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isSending}
          >
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSending ? 'Sending...' : 'Send Message'}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 500,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkContent: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  darkText: {
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  darkInput: {
    borderColor: '#2C2C2E',
    backgroundColor: '#2C2C2E',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    height: 120,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});