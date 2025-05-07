import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Login from './src/screens/Login';
import BooksView from './src/screens/BooksView';
import AddBook from './src/screens/AddBook';
import EditBook from './src/screens/EditBook';
import BookDetail from './src/screens/BookDetail';

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  BooksView: undefined;
  AddBook: undefined;
  EditBook: { book: any };
  BookDetail: { book: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BooksView" 
          component={BooksView}
          options={{ 
            title: 'Books',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="AddBook" 
          component={AddBook}
          options={{ 
            title: 'Add Book',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="EditBook" 
          component={EditBook}
          options={{ 
            title: 'Edit Book',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="BookDetail" 
          component={BookDetail}
          options={{ 
            title: 'Book Details',
            headerShown: false 
          }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
