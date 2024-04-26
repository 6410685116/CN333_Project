import { StyleSheet, Text, View , Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions  } from 'react-native';
import React, { useState, useEffect }  from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseauth } from '../config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import CheckBox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import { Entypo, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation=useNavigation()
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPassword = await AsyncStorage.getItem('userPassword');
        if (storedEmail && storedPassword) {
          await signInWithEmailAndPassword(firebaseauth, storedEmail, storedPassword);
          const user = firebaseauth.currentUser
          Toast.show({
            type: 'success',
            text1: 'Welcome!',
            text2: 'This is a exam archive application. 👋'
          });
          navigation.navigate('BottomTabs', { user });
        } else if (storedEmail) {
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error('Error fetching user data from AsyncStorage:', error);
      }
    };
    fetchUserData();

  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(firebaseauth, email, password);
      const user = firebaseauth.currentUser
      Toast.show({
        type: 'success',
        text1: 'Welcome!',
        text2: 'This is a exam archive application. 👋'
      });
      navigation.navigate('BottomTabs', { user });
      setError();
      if (rememberMe) {
        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
      } 
    } catch (error) {
      setError(error.message);
    }
  };

  const signUp = async () => {
    try {
      navigation.navigate('Signup');
    } catch (error) {
      setError(error.message);
    }
  };

  // if (!user) {
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

              <MaterialCommunityIcons 
                        name={showPassword ? 'eye-off' : 'eye'} 
                        size={24} 
                        color="#aaa" 
                        onPress={toggleShowPassword} 
              /> 
            </View>

            <View style={styles.OptionContainer}>
              <CheckBox
              // value={checked ? true : false}
              value={rememberMe}
              tintColors={{ true: 'orange', false: 'gray' }} 
              // onValueChange={handleCheckboxPress}
              onValueChange={newValue => setRememberMe(newValue)}
              />
              <Text style={{marginLeft: 5}}>Remember Me</Text>
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
            <TouchableOpacity style={styles.googleButton} onPress={'onGoogleButtonPress'}>
              <AntDesign name="google" size={24} color="black" />
              <Text style={{color: 'black',fontWeight: 'bold', marginLeft:10}}>Sign In with Google</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  // }
  // navigation.navigate('Home')
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
