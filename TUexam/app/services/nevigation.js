import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import ResetPassword from '../pages/ResetPassword';
import Toast from 'react-native-toast-message';
import Upload from '../pages/Upload';
import BottomTabs from '../services/BottomTabs';

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="BottomTabs" component={BottomTabs} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={Upload} options={{ headerShown: false }} /> */}
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}