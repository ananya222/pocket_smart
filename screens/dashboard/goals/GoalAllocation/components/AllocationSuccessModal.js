import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { styles } from './AllocationSuccessModal.styles';

export default function AllocationSuccessModal({ 
  visible, 
  onDismiss, 
  message 
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalBg}>
        <BlurView intensity={90} tint="dark" style={styles.modalContent}>
          <Feather name="check-circle" size={48} color="#9D4EDD" style={{ marginBottom: 16 }} />
          <Text style={styles.modalTitle}>Savings Allocated</Text>
          <Text style={styles.modalMessage}>{message}</Text>

          <TouchableOpacity onPress={onDismiss} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Done</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </Modal>
  );
}
