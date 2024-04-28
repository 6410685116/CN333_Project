import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import Home from '../pages/Home';
import Upload from '../pages/Upload';
import Bookmarks from '../pages/Bookmarks';
import Profile from '../pages/Profile';
import Showfile from '../pages/Showfile'; // Import Showfile component
import Report from '../pages/Report'

const Tab = createBottomTabNavigator();
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenScale = Dimensions.get('window').scale;

const ShowfileStack = createStackNavigator();

function ShowfileNavigator() {
  return (
    <ShowfileStack.Navigator>
      <ShowfileStack.Screen name="Showfile" component={Showfile} options={{ headerShown: false }} />
    </ShowfileStack.Navigator>
  );
}
function ReportNavigator() {
  return (
    <ShowfileStack.Navigator>
      <ShowfileStack.Screen name="Report" component={Report} options={{ headerShown: false }} />
    </ShowfileStack.Navigator>
  );
}

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          borderRadius: screenScale * 12,
          elevation: 1,
          bottom: screenWidth * 0.04,
          left: screenWidth * 0.03,
          right: screenWidth * 0.03,
          height: screenHeight * 0.09,
          backgroundColor: 'white',
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={screenScale * 9} style={{ color: focused ? 'orange' : 'gray' }} />
              <Text style={{ color: focused ? 'orange' : 'gray' }}>Home</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={screenScale * 9} style={{ color: focused ? 'orange' : 'gray' }} />
              <Text style={{ color: focused ? 'orange' : 'gray' }}>Upload</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'bookmarks' : 'bookmarks-outline'} size={screenScale * 9} style={{ color: focused ? 'orange' : 'gray' }} />
              <Text style={{ color: focused ? 'orange' : 'gray' }}>Bookmarks</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name={focused ? 'person' : 'person-outline'} size={screenScale * 9} style={{ color: focused ? 'orange' : 'gray' }} />
              <Text style={{ color: focused ? 'orange' : 'gray' }}>Profile</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ShowfileNavigator"
        component={ShowfileNavigator}
        options={{ tabBarButton: () => null, header: () => false, tabBarStyle: { display: 'none' }}}
      />
      <Tab.Screen
        name="ReportNavigator"
        component={ReportNavigator}
        options={{ tabBarButton: () => null, header: () => false, tabBarStyle: { display: 'none' }}}
      />
    </Tab.Navigator>
  );
}