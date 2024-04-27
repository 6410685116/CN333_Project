import { StyleSheet, Text, View , Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions  } from 'react-native';
import React, { useState }  from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { setDoc, doc } from 'firebase/firestore';

// GoogleSignin.configure({
//   webClientId: '94243047675-g6427ob0n66tdhn1tvkul6bq0od3ngvn.apps.googleusercontent.com',
// });
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation=useNavigation()
  const [repassword, setrePassword] = useState('');

  const toggleShowPassword = () => { 
      setShowPassword(!showPassword); 
  }; 

  const signIn = async () => {
    navigation.navigate('Login');
  };

  const signUp = async () => {
    if (password !== repassword) {
      setError('Passwords do not match');
    } else {
      try {
        await createUserWithEmailAndPassword(firebaseauth, email, password).then(() => {
          updateProfile(firebaseauth.currentUser, {
            displayName: "Anonymous",
            photoURL: "https://firebasestorage.googleapis.com/v0/b/exam-archivetu.appspot.com/o/profile_image%2Fperson1.jpg?alt=media&token=b7eea6be-ba22-4dc2-9d15-870418fcbe10"
          })
        }).then(() => {
          setDoc(doc(firebasedb, 'users', firebaseauth.currentUser.uid),{
            // Mystar: 0,
            Status: 'student',
            Bio: 'None',
          })
        });
        await AsyncStorage.setItem('userEmail', email);
        setError();
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'This is a exam archive application. 👋'
        });
        navigation.navigate('BottomTabs');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <View style={{backgroundColor:'gray'}}>
      <Image source={require('../assets/images/logo.jpg')} style={styles.ImageForm} />
      <View style={styles.container}>
        <Text style={styles.LoginText}>Sign In</Text>
        <KeyboardAvoidingView behavior='padding'>
          <View style={styles.TextInputBox}>
            <TextInput 
            placeholder='Email Address' 
            placeholderTextColor={'gray'}
            style={{height: screenHeight * 0.05, width: screenWidth * 0.7,}}
            value={email}
            onChangeText={setEmail}
            />
            <Entypo name="mail" size={24} color="gray" />
          </View>

          <View style={styles.TextInputBox}>
            <TextInput 
            placeholder='Password' 
            placeholderTextColor={'gray'}
            style={{height: screenHeight * 0.05, width: screenWidth * 0.7,}}
            secureTextEntry={!showPassword} 
            value={password} 
            onChangeText={setPassword}
            />

            {/* <MaterialCommunityIcons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={24} 
                      color="#aaa" 
                      onPress={toggleShowPassword} 
            />  */}
          </View>

          <View style={styles.TextInputBox}>
            <TextInput 
            placeholder='Re-enter Password' 
            placeholderTextColor={'gray'}
            style={{height: screenHeight * 0.05, width: screenWidth * 0.7,}}
            secureTextEntry={!showPassword} 
            value={repassword} 
            onChangeText={setrePassword}
            />

            <MaterialCommunityIcons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={24} 
                      color="#aaa"
                      style={styles.IconBox} 
                      onPress={toggleShowPassword} 
            /> 
          </View>

          <View style={styles.OptionContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
              <Text style={{ color: 'orange' , marginLeft:20}}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View>
            <View style={{flexDirection: 'row', alignSelf:'center',}}>
              <TouchableOpacity style={styles.signButton} onPress={signIn}>
                <Text style={styles.signButtonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signButton} onPress={signUp}>
                <Text style={styles.signButtonText}>Sign Up</Text>
              </TouchableOpacity>
              </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </KeyboardAvoidingView>

        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
          <View style={styles.Drawline}></View>
          <View style={{marginHorizontal:10, marginTop:-5,}}><Text>or</Text></View>
          <View style={styles.Drawline}></View>
        </View>

        <View>
          <TouchableOpacity style={styles.googleButton}>
            <AntDesign name="google" size={24} color="black" />
            <Text style={{color: 'black',fontWeight: 'bold', marginLeft:10}}>Sign In with Google</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
      paddingTop:10,
      marginTop:-20,
      backgroundColor:'white',
      borderTopStartRadius: 30,
      borderTopEndRadius: 30,
      height:screenHeight,
    },
    LoginText:{
        fontSize:40,
        fontWeight:'bold',
        fontFamily:'sans-serif',
        color:'gray',
        textAlign:'center',
    },
    ImageForm:{
      alignSelf:'center',
      height: screenHeight * 0.3,
      width: screenWidth,
    },
    TextInputBox:{
      marginTop:10,
      backgroundColor:'white',
      borderRadius:10,
      height: screenHeight * 0.05,
      width: screenWidth * 0.85,
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation:5,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    OptionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
      alignSelf: 'center',
    },
    Drawline:{
      borderBottomColor:'gray',
      borderBottomWidth:2,
      borderRadius:1,
      width:screenWidth * 0.4,
    },
    signButton: {
      backgroundColor: 'orange',
      padding: 10,
      borderRadius: 30,
      margin: screenWidth*0.04,
      alignItems: 'center',
      width: screenWidth*0.35,
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation:5,
    },
    signButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      marginTop: 10,
      textAlign: 'center',
    },
    googleButton: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 30,
      margin: 10,
      alignItems: 'center',
      width: screenWidth*0.8,
      shadowColor: 'black',
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation:5,
      flexDirection: 'row',
      alignSelf:'center',
      justifyContent: 'center',
    },
});
