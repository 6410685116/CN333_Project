import { View, Text, StyleSheet, Button  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebaseauth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ route }) {
  const navigation = useNavigation();
  const { user } = route.params || {};
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user) {
      setUserEmail(user.email);
    }
  }, [user]);

  const logout = async () => {
    try {
      await firebaseauth.signOut();
      await AsyncStorage.removeItem('userPassword');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
      <Text>Email:</Text>
      <Text>{userEmail}</Text>
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