import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { firebaseauth, firebasedb } from '../config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';

export default function Home() {
  const user = firebaseauth.currentUser;
  const [searchText, setSearchText] = useState('');
  const [files, setFiles] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const q = query(collection(firebasedb, "files"), orderBy("countStar", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const filesData = querySnapshot.docs.map((doc) => doc.data());
    setFiles(filesData);
  };

  const searchFiles = async () => {
    if (searchText.trim() !== '') {
      const q = query(collection(firebasedb, "files"), where("searchName", ">=", searchText), limit(10));
      const querySnapshot = await getDocs(q);
      const searchedFiles = querySnapshot.docs.map((doc) => doc.data());
      setFiles(searchedFiles);
    } else {
      fetchFiles();
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      // Reload the page
      fetchFiles();
      setSearchText('')
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  const renderFile = ({ item }) => (
    <View style={styles.fileContainer}>
      <Text style={styles.fileName}>{item.fileName}</Text>
      <View style={styles.starContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <AntDesign key={index} name="star" size={24} color={index < item.countStar ? 'orange' : 'gray'} />
        ))}
      </View>
      <Text style={styles.fileUrl}>{item.fileSize}</Text>
      <Text style={styles.fileUrl}>{item.fileType}</Text>
      <Text style={styles.fileUrl}>{item.userStatus}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search files..."
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={searchFiles}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={renderFile}
        style={styles.fileList}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    elevation:5,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
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
  },
});