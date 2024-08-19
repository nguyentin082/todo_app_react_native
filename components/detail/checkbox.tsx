import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define types for the MyCheckbox component props
interface MyCheckboxProps {
  onChange: () => void;
  checked: boolean;
}

// MyCheckbox component
const MyCheckbox = ({ onChange, checked }: MyCheckboxProps) => {
  return (
    <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={onChange}
    >
      {checked && <Ionicons name="checkmark" size={23} color="white" />}
    </Pressable>
  );
};

// Define types for the Checkbox component props
interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
}

// Checkbox component
const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <View style={styles.checkboxContainer}>
      <MyCheckbox onChange={onChange} checked={checked} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E201E',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#1E201E',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Checkbox;
