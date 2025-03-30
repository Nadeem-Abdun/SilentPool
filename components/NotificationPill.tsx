import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface NotificationPillProps {
  message: string;
  onDismiss: () => void;
}

const NotificationPill: React.FC<NotificationPillProps> = ({ message, onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current; // Start off-screen

  useEffect(() => {
    // Slide down animation
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto-dismiss after 3 seconds
    const timeout = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timeout);
  }, [translateY, onDismiss]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotificationPill;
