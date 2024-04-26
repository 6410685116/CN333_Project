import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import Home from '../pages/Home';
import Upload from '../pages/Upload';
import Bookmarks from '../pages/Bookmarks';
import Profile from '../pages/Profile';

const Tab = createBottomTabNavigator();
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const screenScale = Dimensions.get('window').scale;

export default function BottomTabs({ route }) {
  const { user } = route.params || {};
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          borderRadius: screenScale*12,
          elevation: 1,
          bottom: screenWidth*0.04,
          left: screenWidth*0.03,
          right: screenWidth*0.03,
          height: screenHeight*0.09,
          backgroundColor: 'white',
        },
        header: () => null,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} initialParams={{ user }} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center'}}>
            <Ionicons name={focused ? "home":"home-outline"} size={screenScale*9} style={{color: focused ? 'orange': 'gray'}} />
            <Text style={{color: focused ? 'orange': 'gray'}}>Home</Text>
          </View>
        ),
      }} 
      />
      <Tab.Screen name="Upload" component={Upload} initialParams={{ user }} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center'}}>
            <Ionicons name={focused ? "cloud-upload":"cloud-upload-outline"} size={screenScale*9} style={{color: focused ? 'orange': 'gray'}} />
            <Text style={{color: focused ? 'orange': 'gray'}}>Upload</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen name="Bookmarks" component={Bookmarks} initialParams={{ user }} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center'}}>
            <Ionicons name={focused ? "bookmarks":"bookmarks-outline"} size={screenScale*9} style={{color: focused ? 'orange': 'gray'}} />
            <Text style={{color: focused ? 'orange': 'gray'}}>Bookmarks</Text>
          </View>
        ),
      }}
      />
      <Tab.Screen name="Profile" component={Profile} initialParams={{ user }} options={{
        tabBarIcon: ({focused}) => (
          <View style={{alignItems:'center'}}>
            <MaterialIcons name={focused ? "person":"person-outline"} size={screenScale*9} style={{color: focused ? 'orange': 'gray'}} />
            <Text style={{color: focused ? 'orange': 'gray'}}>Profile</Text>
          </View>
        ),
      }}
      />
    </Tab.Navigator>
  );
};

// export default BottomTabs;