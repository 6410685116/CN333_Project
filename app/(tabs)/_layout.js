import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const TabLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
            name="Home" 
            options={{
                tabBarLabel: 'Home',
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="home" color={color} size={size} />
                ),
            }}
        />
        <Tabs.Screen 
            name="TabOne" 
            options={{
                tabBarLabel: 'TabOne',
                title: "TabOne",

            }}
        />
        <Tabs.Screen 
            name="Profile" 
            options={{
                tabBarLabel: 'Profile',
                title: "Profile",
            }}
        />
    </Tabs>
  );
};

export default TabLayout;