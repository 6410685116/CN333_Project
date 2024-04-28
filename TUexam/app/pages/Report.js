import { View, Text, Button } from 'react-native'
import React from 'react'
import { firebaseauth, firebasedb } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function Report() {
  const user = firebaseauth.currentUser;
  navigator = useNavigation();
  return (
    <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
      <Text>Report</Text>
      <Button title='Back' onPress={() => navigator.goBack()} />
    </View>
  )
}