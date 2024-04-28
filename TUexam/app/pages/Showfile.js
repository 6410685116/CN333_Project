import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';

export default function Showfile({ route }) {
  const { item } = route.params || {};
  navigator = useNavigation();
  const user = firebaseauth.currentUser;
  const [isFavorited, setIsFavorited] = useState(false);

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
      <Button title='Back' onPress={() => navigator.goBack()}/>
    </View>
  );
}