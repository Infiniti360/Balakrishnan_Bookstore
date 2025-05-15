import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Books from './src/components/Books';
import Login from './src/components/Login';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F3F4F6' }
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Books" component={Books} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 