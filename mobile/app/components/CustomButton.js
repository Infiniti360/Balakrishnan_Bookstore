import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  loading = false,
  style = {},
  textStyle = {}
}) => {
  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    disabled && styles.disabledButton,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`${type}Text`],
    disabled && styles.disabledText,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'primary' ? '#fff' : '#3498db'}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minWidth: 100,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#ecf0f1',
  },
  secondaryText: {
    color: '#2c3e50',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  outlineText: {
    color: '#3498db',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  dangerText: {
    color: '#fff',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.7,
  },
  disabledText: {
    color: '#7f8c8d',
  },
});

export default CustomButton; 