import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Showfile({ route }) {
  const { item } = route.params || {};
  navigator = useNavigation();

  if (!item) {
    return (
      <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
        <Text style={{fontSize:30}}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
      <Text>{item.fileName}</Text>
      <Text>{item.fileSize}</Text>
      <Button title='Back' onPress={() => navigator.goBack()}/>
    </View>
  );
}