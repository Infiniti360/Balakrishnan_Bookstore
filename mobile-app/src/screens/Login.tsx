import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

type RootStackParamList = {
  Login: undefined;
  BooksView: undefined;
  AddBook: undefined;
  EditBook: { book: any };
  BookDetail: { book: any };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const passwordInputRef = React.useRef<TextInput>(null);

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const isAuth = await authService.isAuthenticated();
        if (isAuth) {
          console.log('Session exists, navigating to BooksView');
          navigation.reset({
            index: 0,
            routes: [{ name: 'BooksView' }],
          });
        }
      } catch (error) {
        console.log('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Simple validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 3) {
      Alert.alert('Error', 'Password must be at least 3 characters long');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login...');
      await authService.login(email, password);
      console.log('Login successful, navigating to BooksView');
      
      // Navigate to BooksView and clear the navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'BooksView' }],
      });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookstore</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <TextInput
          ref={passwordInputRef}
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            Hint: Enter any valid email and password (3+ characters)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 50 : 0, // Add padding for iOS
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginTop: 100,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  form: {
    paddingHorizontal: 30,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#000', // Ensure text is visible
  },
  button: {
    backgroundColor: '#2c3e50',
    height: 55,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#95a5a6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  hintText: {
    color: '#7f8c8d',
    textAlign: 'center',
  },
}); 