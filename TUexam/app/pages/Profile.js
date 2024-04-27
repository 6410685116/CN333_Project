import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Button, Dimensions, TouchableOpacity } from 'react-native';
import { firebaseauth, firebasedb } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Profile() {
  const navigation = useNavigation();
  const user = firebaseauth.currentUser;
  const [userEmail, setUserEmail] = useState('');
  const [userDisplayName, setDisplayName] = useState('');
  const [userImage, setImage] = useState('');
  const [userData, setUserData] = useState('');
  const [userBio, setUserBio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firebasedb, 'users', `${user.uid}`);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap.data());
    };
    if (user) {
      setUserEmail(user.email);
      setImage(user.photoURL);
      fetchData();
    }
  }, [user]);

  const changeProfile = async () => {
    try {
      await updateDoc(doc(firebasedb, 'users', `${user.uid}`), {
        Bio: userBio,
      });
      await updateProfile(user, {
        displayName: userDisplayName,
      });
      console.log(user.displayName);
      console.log(userData.Bio);
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

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
      <Image style={styles.image} source={{ uri: userImage }} />
      <View style={styles.contrast}>
      {/* <View> */}
        <Text style={styles.email}>Email: {userEmail}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Display Name:</Text>
          <TextInput
            style={styles.input}
            value={userDisplayName || ''}
            onChangeText={setDisplayName}
            placeholder= {user.displayName}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.status}>Status: {userData.Status}</Text>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.labelbio}>Bio:</Text>
          <TextInput
            multiline
            style={styles.bioInput}
            value={userBio}
            onChangeText={setUserBio}
            placeholder= {userData.Bio}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={changeProfile}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 42,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
  },
  labelbio: {
    marginRight: 10,
    paddingBottom: 7,
  },
  input: {
    backgroundColor: '#F9E3A3',
    borderRadius: 10,
    height: 40,
    width: screenWidth * 0.5,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.5, // Adjusted width to match the container
    marginTop: 10,
    // marginBottom: 20,
    alignSelf: 'center', // Align buttons to the center of the container
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bioInput: {
    backgroundColor: '#F9E3A3',
    borderRadius: 10,
    height: screenHeight * 0.245, // Adjust the height as needed
    width: screenWidth * 0.75,
    paddingHorizontal: 10,
    paddingTop: 10, // Add padding at the top to align text
    textAlignVertical: 'top', // Place holder in the top left corner
  },
  bioContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingTop: 10,
  },
  status: {
    width: screenWidth * 0.75,
    textAlign: 'left',
  },
  email: {
    width: screenWidth * 0.75,
    textAlign: 'left',
    paddingBottom: 10,
  },
  contrast: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,

  },
});