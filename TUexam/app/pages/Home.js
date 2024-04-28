import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { firebasedb } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Home() {
  // const user = firebaseauth.currentUser;
  const [searchText, setSearchText] = useState('');
  const [files, setFiles] = useState([]);
  const [topFiles, setTopFiles] = useState([]);
  const flatListRef = useRef(null);
  const navigation=useNavigation();

  useEffect(() => {
    fetchFiles();
    fetchTopFiles();
  }, []);

  const fetchFiles = async () => {
    const q = query(collection(firebasedb, "files"),orderBy("createdAt", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    const filesData = querySnapshot.docs.map((doc) => doc.data());
    setFiles(filesData);
  };

  const fetchTopFiles = async () => {
    const qt = query(collection(firebasedb, "files"), orderBy("countStar", "desc"), limit(10));
    const querySnapshott = await getDocs(qt);
    const filesDatat = querySnapshott.docs.map((doc) => doc.data());
    setTopFiles(filesDatat);
  };

  const searchFiles = async () => {
    if (searchText.trim() !== '') {
      const q = query(collection(firebasedb, "files"), where("searchName", ">=", searchText), where("searchName", "<=", `${searchText}\uf8ff`), limit(10));
      const querySnapshot = await getDocs(q);
      const searchedFiles = querySnapshot.docs.map((doc) => doc.data());
      setFiles(searchedFiles);
    } else {
      fetchFiles();
    }
  };
  

  // const handleScroll = (event) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   if (offsetY <= -5) {
  //     // Reload the page
  //     fetchFiles();
  //     setSearchText('')
  //     flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  //   }
  // };

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
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.fileUrl}>{item.fileType}</Text>
          <Text style={styles.fileUrl}>{item.userStatus}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderRecommended = ({ item }) => (
    <TouchableOpacity>
      <View style={[styles.recommended_file, { width: screenWidth * 0.75, height: screenHeight * 0.235, transform: [{ rotateY: '5deg' }] }]}>
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
              <AntDesign key={index} name="star" size={20} color={index < item.countStar ? 'orange' : 'gray'} />
            ))}
          </View>
          <Text style={styles.fileUrl}>{item.fileSize}</Text>
          <Text style={styles.fileUrl}>{item.fileType}</Text>
          <Text style={styles.fileUrl}>{item.userStatus}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleReload = (event) => {
    fetchFiles();
    setSearchText('');
  };

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
        />
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Ionicons name="reload" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {searchText == '' &&  <View style={{marginBottom: 20}}>
        <ScrollView>
          {/* Recommended Files (Horizontal) */}
          <View >
            <Text style={{fontSize:30}}>Recommended Files</Text>
            <FlatList
              data={topFiles}
              renderItem={renderRecommended}
              keyExtractor={item => item.id}
              horizontal
            />
          </View>
        </ScrollView>
      </View>}

      <Text style={{fontSize:30}}>Recent Files</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginBottom: screenHeight * 0.1,
  },
  searchContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', 
    borderRadius: 20,
    elevation: 5,
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
  fileList: {
    flex: 1,
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
    marginRight: 15,
  },
  recommended_file: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
});