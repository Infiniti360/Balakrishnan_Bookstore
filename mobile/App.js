import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './app/hooks/useAuth';

// Screens
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import BookListScreen from './app/screens/BookListScreen';
import BookFormScreen from './app/screens/BookFormScreen';

// Create navigation stacks
const Stack = createNativeStackNavigator();

// Auth Navigator - for unauthenticated users
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// App Navigator - for authenticated users
const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="Books" 
      component={BookListScreen} 
      options={{
        headerShown: false
      }}
    />
    <Stack.Screen 
      name="AddBook" 
      component={BookFormScreen} 
      options={{
        headerShown: false,
        presentation: 'modal'
      }}
    />
    <Stack.Screen 
      name="EditBook" 
      component={BookFormScreen} 
      options={{
        headerShown: false,
        presentation: 'modal'
      }}
    />
  </Stack.Navigator>
);

// Navigator wrapper to handle auth state
const AppNavigatorWrapper = () => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return null; // Or a loading component
  }
  
  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// Main App component
export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppNavigatorWrapper />
    </AuthProvider>
  );
} 