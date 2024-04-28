import { View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';

export default function Showfile({ route }) {
  const { item } = route.params || {};
  navigator = useNavigation();
  const user = firebaseauth.currentUser;
  const [isFavorited, setIsFavorited] = useState(false);

 const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    console.log(item.url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};
  useEffect(() => {
    const userHasFavorited = item.favorited && item.favorited.includes(user.uid);
    setIsFavorited(userHasFavorited);
  }, [item.favorited, user.uid]);

  const getFileIcon = () => {
    const fileExtension = item.fileName.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <FontAwesome name="file-pdf-o" size={90} color="orange" />;
      case 'doc':
        return <FontAwesome name="file-word-o" size={90} color="blue" />;
      case 'docx':
        return <FontAwesome name="file-word-o" size={90} color="blue" />;
      case 'mp4':
        return <FontAwesome name="file-video-o" size={90} color="purple" />;
      default:
        return <FontAwesome name="file-o" size={90} color="gray" />;
    }
  };

  if (!item) {
    return (
      <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
        <Text style={{fontSize:30}}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
      <TouchableOpacity onPress={() => navigator.navigate('ReportNavigator')}>
      <AntDesign name = 'exclamationcircleo'>Report</AntDesign> 
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          const fileRef = doc(firebasedb, 'files', `${item.id}`);

          if (isFavorited) {
            updateDoc(fileRef, {
              favorited: arrayRemove(user.uid),
            });
          } else {
            updateDoc(fileRef, {
              favorited: arrayUnion(user.uid),
            });
          }

          setIsFavorited((prevState) => !prevState);
        }}
      >
        <FontAwesome name={isFavorited ? 'star' : 'star-o'} />
      </TouchableOpacity>
      <View>
        {getFileIcon()}
      </View>
      <Text>filename: {item.id}</Text>
      <Text>filename: {item.fileName}</Text>
      <Text>filesize: {item.fileSize}</Text>
      <Text>detail</Text>
      <Text>{item.detail}</Text>
      <OpenURLButton url={item.url}>Dowload</OpenURLButton>
      <Button title='Back' onPress={() => navigator.goBack()}/>
      <Button title='Comment'onPress={() => navigator.navigate('Comment',{
        item: item.id,
      }) 
      }/>
    </View>

  );
}