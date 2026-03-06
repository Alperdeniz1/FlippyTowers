/**
 * "Watch Ad to Continue" modal - mock for rewarded ad integration.
 * Shows when player collapses and can watch ad to revive.
 */

import React from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import { ChunkyButton } from './ChunkyButton';

interface RewardedRecoveryModalProps {
  visible: boolean;
  onWatchAd: () => void;
  onDismiss: () => void;
}

export function RewardedRecoveryModal({
  visible,
  onWatchAd,
  onDismiss,
}: RewardedRecoveryModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Continue Playing?</Text>
          <Text style={styles.subtitle}>
            Watch a short ad to remove one strike and keep your tower!
          </Text>
          <View style={styles.buttons}>
            <ChunkyButton
              title="Watch Ad to Continue"
              onPress={onWatchAd}
              variant="primary"
              style={styles.button}
            />
            <ChunkyButton
              title="No Thanks"
              onPress={onDismiss}
              variant="danger"
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fffdf5',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontFamily: 'FredokaOne_400Regular',
    fontSize: 24,
    color: '#1a0533',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    color: '#1a0533',
    opacity: 0.8,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttons: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
