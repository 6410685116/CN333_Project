import { View, Text, StyleSheet, Button  } from 'react-native'
import React from 'react'
import { firebaseauth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
  const navigation = useNavigation();
  const logout = async () => {
    try {
      await firebaseauth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Button title='Sign Out' onPress={logout}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});