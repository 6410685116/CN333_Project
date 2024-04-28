import { View, Text, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';

export default function Showfile({ route }) {

  const { item } = route.params || {};
  navigator = useNavigation();
  const [favorite, setfavorite] = useState(false);
  const user = firebaseauth.currentUser;

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
  if(favorite){
    const addFiles = async () => {
      await updateDoc(user, {
        favorite: arrayUnion(item.fileName)
    });
    addFiles()
  }
 }else{
    const removeFiles = async () => {
      await updateDoc(user, {
        favorite: arrayRemove(item.fileName)
      });
    }
    removeFiles()
  }
  console.log(item);

  return (
    <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
      <TouchableOpacity onPress={() => navigator.navigate('ReportNavigator')}>
      <AntDesign name = 'exclamationcircleo'>Report</AntDesign> 
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => setfavorite( favorite => !favorite)}
      >
      <FontAwesome name={favorite? 'star':'star-o'}></FontAwesome>
      </TouchableOpacity>
      <View>
        {getFileIcon()}
      </View>
      <Text>filename: {item.fileName}</Text>
      <Text>filesize: {item.fileSize}</Text>
      <Text>detail</Text>
      <Text>{item.detail}</Text>
      <Button title='Back' onPress={() => navigator.goBack()}/>
    </View>
  );
}