import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  
  const handleChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRegister = async () => {
    // Basic validation
    if (!form.username.trim() || !form.email.trim() || 
        !form.password.trim() || !form.confirmPassword.trim()) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        username: form.username,
        email: form.email,
        password: form.password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'You can now login with your credentials',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>BookStore</Text>
            <Text style={styles.subtitle}>Create an account</Text>
          </View>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={form.username}
                onChangeText={(value) => handleChange('username', value)}
                placeholder="Enter a username"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Create a password"
                secureTextEntry
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
              />
            </View>
            
            <CustomButton
              title="Register"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  link: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RegisterScreen; 