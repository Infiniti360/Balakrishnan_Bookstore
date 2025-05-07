import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import BookListScreen from './src/screens/BookListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import { RootStackParamList } from './src/types/navigation';
import { apiService } from './src/services/api';
import { BannerProvider } from './src/context/BannerContext'; 
import Banner from './src/components/Banner';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Linking configuration for web URL integration
const linking = {
  prefixes: [], // No custom prefixes needed for localhost
  config: {
    screens: {
      Loading: { // Prevent Loading screen from appearing in the URL
        path: '_', // Assign a dummy path or handle differently if needed
      },
      Login: 'login', // Maps Login screen to /login path
      BookList: '', // Maps BookList screen to the root path (/)
      BookDetail: 'book/:bookId', // Example for detail screen (adjust if needed)
      AddBook: 'add-book', // Maps AddBook screen to /add-book path
      // We don't need to define params mapping here unless complex
    },
  },
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Register the auth state callback with the apiService
    apiService.registerAuthStateCallback(setIsAuthenticated);
    
    const checkAuth = async () => {
      setIsLoading(true); // Ensure loading is true at start
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Use setAuthToken which now also triggers the callback
          apiService.setAuthToken(token); 
          // setIsAuthenticated(true); // No longer needed here directly
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error("Failed to check auth token:", e);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Cleanup function (optional but good practice)
    return () => {
       apiService.registerAuthStateCallback(() => {}); // Unregister or set dummy callback on unmount
    };
  }, []); // Still runs only once on mount

  // Use a separate loading component for web if needed
  const LoadingIndicator = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  // Check isLoading BEFORE rendering NavigationContainer
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <BannerProvider>
      {/* Pass linking prop only on web platform */}
      <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined} fallback={<LoadingIndicator />}>
        <Stack.Navigator 
          initialRouteName={isAuthenticated ? 'BookList' : 'Login'}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e', 
            },
            headerTintColor: '#fff', 
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {isAuthenticated ? (
            <>
              <Stack.Screen 
                name="BookList" 
                component={BookListScreen} 
                options={{
                  title: 'Bookstore', 
                  headerShown: true,
                }}
              />
              <Stack.Screen name="BookDetail" component={BookDetailScreen} options={{ title: 'Book Details' }} />
              <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Add/Edit Book' }} />
            </>
          ) : (
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
          )}
        </Stack.Navigator>
        <Banner />
      </NavigationContainer>
    </BannerProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
