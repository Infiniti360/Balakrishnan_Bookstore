import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useBanner } from '../context/BannerContext';

export default function Banner() {
  const { message, type } = useBanner();

  if (!message || !type) return null;

  const backgroundColor = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
  }[type];

  return (
    <View style={[styles.banner, { backgroundColor }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
}); 