import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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
  const [userEmail, setUserEmail] = useState(user.email);
  const [userDisplayName, setDisplayName] = useState(user.displayName);
  const [userImage, setImage] = useState(user.photoURL);
  const [userData, setUserData] = useState('');
  const [userBio, setUserBio] = useState('');
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const docRef = doc(firebasedb, 'users', `${user.uid}`);
    const docSnap = await getDoc(docRef);
    setUserData(docSnap.data());
  };

  const toggleEditState = () => {
    setEditState(!editState);
  };

  const changeProfile = async () => {
    try {
      await updateDoc(doc(firebasedb, 'users', `${user.uid}`), {
        Bio: userBio,
      });
      await updateProfile(user, {
        displayName: userDisplayName,
      });
      fetchData();
      console.log(user.displayName);
      console.log(userData.Bio);
      toggleEditState(); // Call toggleEditState to exit edit mode
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
      <View style={styles.row}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            value={userDisplayName || ''}
            onChangeText={setDisplayName}
            placeholder={user.displayName}
            editable={editState}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.status}>Status: {userData.Status}</Text>
        </View>
        <Text style={styles.email}>Email: {userEmail}</Text>
        

        <View style={styles.bioContainer}>
          <Text style={styles.labelbio}>Bio:</Text>
          <TextInput
            multiline
            style={styles.bioInput}
            value={userBio}
            onChangeText={setUserBio}
            placeholder={userData.Bio}
            editable={editState}
          />
        </View>
        <View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonEdit}
              onPress={() => {
                toggleEditState();
                editState ? changeProfile() : null;
              }}
            >
              <Text style={styles.buttonText}>{editState ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonLogout} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
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
    marginTop:5,
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
  buttonEdit: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonLogout: {
    backgroundColor: 'red',
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