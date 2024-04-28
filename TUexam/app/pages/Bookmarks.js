import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { firebaseauth, firebasedb } from '../config/firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const fetchFiles = async (user, fileType) => {
  if (user) {
    const q = query(
      collection(firebasedb, 'files'),
      where('favorited', 'array-contains', user.uid),
      where('fileType', '==', fileType),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const filesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return filesData;
  } else {
    console.log('User not logged in');
    return [];
  }
};

const ExamScreen = () => {
  const navigation=useNavigation();
  const [files, setFiles] = useState([]);
  const user = firebaseauth.currentUser;

  useEffect(() => {
    const fetchUserFiles = async () => {
      const filesData = await fetchFiles(user, 'exam');
      setFiles(filesData);
    };

    fetchUserFiles();
  }, [user]);

  const renderFile = ({ item }) => (
    <View style={styles.fileContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ShowfileNavigator', {
            screen: 'Showfile',
            params: { item },
          })
        }
      >
        <Text style={styles.fileName}>{item.fileName}</Text>
        <View style={styles.starContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <AntDesign
              key={index}
              name="star"
              size={20}
              color={index < item.countStar ? 'orange' : 'gray'}
            />
          ))}
        </View>
        <Text style={styles.fileUrl}>{item.fileSize}</Text>
        <Text style={styles.fileUrl}>{item.fileType}</Text>
        <Text style={styles.fileUrl}>{item.userStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabScreenContainer}>
      <FlatList
        data={files}
        renderItem={renderFile}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const SummaryScreen = () => {
  const navigation=useNavigation();
  const [files, setFiles] = useState([]);
  const user = firebaseauth.currentUser;

  useEffect(() => {
    const fetchUserFiles = async () => {
      const filesData = await fetchFiles(user, 'summary');
      setFiles(filesData);
    };

    fetchUserFiles();
  }, [user]);

  const renderFile = ({ item }) => (
    <View style={styles.fileContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ShowfileNavigator', {
            screen: 'Showfile',
            params: { item },
          })
        }
      >
        <Text style={styles.fileName}>{item.fileName}</Text>
        <View style={styles.starContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <AntDesign
              key={index}
              name="star"
              size={20}
              color={index < item.countStar ? 'orange' : 'gray'}
            />
          ))}
        </View>
        <Text style={styles.fileUrl}>{item.fileSize}</Text>
        <Text style={styles.fileUrl}>{item.fileType}</Text>
        <Text style={styles.fileUrl}>{item.userStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.tabScreenContainer}>
      <FlatList
        data={files}
        renderItem={renderFile}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default function Bookmarks() {
  const [searchText, setSearchText] = useState('');
  const [files, setFiles] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const fetchFilesIN = async (user, fileType) => {
    if (user) {
      const q = query(
        collection(firebasedb, 'files'),
        where('favorited', 'array-contains', user.uid),
        where('fileType', '==', fileType),
        orderBy('createdAt', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const filesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return filesData;
    } else {
      console.log('User not logged in');
      return [];
    }
  };

  const searchFiles = async () => {
    const user = firebaseauth.currentUser; // Get the current user

    if (searchText.trim() !== '') {
      const q = query(
        collection(firebasedb, "files"),
        where("searchName", ">=", searchText.toLowerCase()),
        where("searchName", "<=", `${searchText.toLowerCase()}\uf8ff`),
        where('favorited', 'array-contains', user?.uid), // Use optional chaining to handle case when user is null/undefined
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const searchedFiles = querySnapshot.docs.map((doc) => doc.data());
      setFiles(searchedFiles);
    }
  };

  const handleReload = async () => {
    setSearchText('');
    const user = firebaseauth.currentUser;
    const examsData = await fetchFilesIN(user, 'exam');
    const summariesData = await fetchFilesIN(user, 'summary');
    setFiles([...examsData, ...summariesData]);
  };

  const renderFile = ({ item }) => (
    <View style={styles.fileContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ShowfileNavigator', {
            screen: 'Showfile',
            params: { item },
          })
        }
      >
        <Text style={styles.fileName}>{item.fileName}</Text>
        <View style={styles.starContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <AntDesign
              key={index}
              name="star"
              size={20}
              color={index < item.countStar ? 'orange' : 'gray'}
            />
          ))}
        </View>
        <Text style={styles.fileUrl}>{item.fileSize}</Text>
        <Text style={styles.fileUrl}>{item.fileType}</Text>
        <Text style={styles.fileUrl}>{item.userStatus}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          value={searchText}
          onChangeText={txt => {
            searchFiles(txt);
            setSearchText(txt);
          }}
          onSubmitEditing={searchFiles}
        />
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Ionicons name="reload" size={24} color="gray" />
        </TouchableOpacity>
      </View>


      {searchText == '' &&
       <View style={styles.tabContainer}>
          <Tab.Navigator screenOptions={{
            tabBarStyle: {
              backgroundColor: '#ECC488',
            },
            tabBarIndicatorStyle: {
              backgroundColor: '#99A3A4',
            },
            tabBarInactiveTintColor: 'gray',
          }
          }>
            <Tab.Screen name="Exam" component={ExamScreen} />
            <Tab.Screen name="Summary" component={SummaryScreen} />
          </Tab.Navigator>
        </View>}

      {searchText != '' &&
        <View>
          <FlatList
            ref={flatListRef}
            data={files}
            keyExtractor={(item) => item.id}
            renderItem={renderFile}
            style={styles.fileList}
            // onScroll={handleScroll}
            // scrollEventThrottle={16}
          />
        </View>
        }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  searchContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', 
    borderRadius: 20,
    elevation: 5,
    marginHorizontal:10,
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 12,
  },
  reloadButton: {
    marginRight: 8,
    padding: 8,
  },
  tabContainer: {
    flexGrow: 1,
  },
  tabScreenContainer: {
    flex: 1,
    padding: 16,
  },
  fileContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    marginBottom: 16,
  },
  fileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fileUrl: {
    fontSize: 16,
    color: 'gray',
  },
  
});