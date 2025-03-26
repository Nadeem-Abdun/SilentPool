import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { RootStackParamList } from '@/types/navigation';
import WelcomeScreen from './WelcomeScreen';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ErrorScreen from './ErrorScreen';

// Define your custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00DDEC',
  },
};

// Navigation Stack
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Error" component={ErrorScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </PaperProvider>
  );
}
