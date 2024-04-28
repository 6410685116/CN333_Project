import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, FlatList, Dimensions } from 'react-native';
import { firebaseauth, firebasedb }from '../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

function ExamScreen() {
  return (
    <View style={styles.tabScreenContainer}>
      <Text>Exam</Text>
    </View>
  );
}
 
function SummaryScreen() {
  return (
    <View style={styles.tabScreenContainer}>
      <Text>Summary</Text>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();

export default function Bookmarks() {
  const user = firebaseauth.currentUser;
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
 
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
 
  const handleSearch = (text) => {
    setSearchQuery(text);
    // Add your search logic here
  };
 
 
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search file....."
      />
      <View style={styles.tabContainer}>
        <Tab.Navigator>
          <Tab.Screen name="Exam" component={ExamScreen} />
          <Tab.Screen name="Summary" component={SummaryScreen} />
        </Tab.Navigator>
      </View>
    </View>
   
     
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginTop: 30,
  },
 
  tabContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100,
    paddingLeft: 100,
    paddingRight: 100,
  },
  tabScreenContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 150,
    paddingLeft: 200,
    paddingRight: 200,
  },
});