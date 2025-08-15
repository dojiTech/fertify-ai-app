import { Link, Stack } from 'expo-router';
import { StyleSheet, Modal, TouchableOpacity, View, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const [showWarningModal, setShowWarningModal] = useState(true);

  const handleResponse = (isYes: boolean) => {
    const response = isYes ? 'YES' : 'NO';
    Alert.alert('FERTIFY AI', `You're about to test Fertify AI: ${response}`);
    setShowWarningModal(false);
    
    if (isYes) {
      console.log('User confirmed the warning');
      // Add your YES logic here
    } else {
      console.log('User declined the warning');
      // Add your NO logic here
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Quick Notice!' }} />
      
      {/* Warning Modal */}
      <Modal
        visible={showWarningModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWarningModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Message</ThemedText>
              <View style={styles.windowControls}>
                <View style={[styles.windowControl, styles.controlGreen]} />
                <View style={[styles.windowControl, styles.controlYellow]} />
                <View style={[styles.windowControl, styles.controlRed]} />
              </View>
            </View>
            
            {/* Modal Body */}
            <View style={styles.modalBody}>
              {/* Warning Icon */}
              <View style={styles.warningIcon}>
                <Ionicons name="warning" size={40} color="#333" />
              </View>
              
              {/* Warning Text */}
              <ThemedText style={[styles.warningText, { textAlign: 'center' }]}>App Under Development - We're Making It Better!</ThemedText>
              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.yesButton]}
                >
                  <Link href="/calculator/index">
                    <ThemedText style={styles.buttonText}>GO TO CALCULATOR</ThemedText>
                  </Link>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      <ThemedView style={styles.container}>
        <TouchableOpacity 
          style={styles.triggerButton}
          onPress={() => setShowWarningModal(true)}
        >
          <ThemedText style={styles.triggerButtonText}> PRESS FOR NOTICE!</ThemedText>
        </TouchableOpacity>
        
        <ThemedText type="title">GO TO CALCULATOR </ThemedText>
        
        <Link href="/index" style={styles.link}>
          <ThemedText type="link">Go to Home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  triggerButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  triggerButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    backgroundColor: '#2c7873',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  windowControls: {
    flexDirection: 'row',
    gap: 8,
  },
  windowControl: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  controlGreen: {
    backgroundColor: '#84c441',
  },
  controlYellow: {
    backgroundColor: '#f5bd16',
  },
  controlRed: {
    backgroundColor: '#fc5753',
  },
  modalBody: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  warningIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#ffd700',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#ffa500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  warningText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 40,
    letterSpacing: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  yesButton: {
    backgroundColor: '#28a745',
  },
  noButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 1,
  },
});