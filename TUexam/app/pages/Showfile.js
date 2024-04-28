import { View, Text, Button, TouchableOpacity, Linking, StyleSheet, Dimensions } from 'react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default function Showfile({ route }) {
  const { item } = route.params || {};
  navigator = useNavigation();
  const user = firebaseauth.currentUser;
  const [isFavorited, setIsFavorited] = useState(false);

 const OpenURLButton = ({url, children}) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    console.log(item.url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};
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
    <View style={styles.container}>
      <View style={styles.contrastGray}>
        <View style={styles.iconContainer}>
          <View style={styles.iconContainer}>{getFileIcon()}</View>
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
            style={styles.favoriteButton}
          >
            <AntDesign name={isFavorited ? 'like1' : 'like2'} size={24} color={isFavorited ? 'orange' : 'gray'} />
            {/* <FontAwesome name={isFavorited ? 'star' : 'star-o'} size={24} color={isFavorited ? 'orange' : 'gray'} /> */}

          </TouchableOpacity>
        </View>

        
        {/* <View style={styles.iconContainer}>{getFileIcon()}</View> */}
        <Text style={styles.text}>Filename: {item.fileName}</Text>
        <Text style={styles.text}>Filesize: {item.fileSize}</Text>
        <Text style={styles.detailTitle}>Detail:</Text>
        <Text style={[styles.detailText,styles.contrastDetail]}>{item.detail}</Text>
        <OpenURLButton url={item.url}>Download</OpenURLButton>
      </View>
       
       <TouchableOpacity onPress={() => navigator.navigate('Comment',{item: item.id,})} style={styles.comButton}>
          <Text style={styles.buttonText}>Comment</Text>
      </TouchableOpacity> 

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigator.goBack()} style={styles.backButton}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigator.navigate('ReportNavigator')} style={styles.reportButton}>
          {/* <AntDesign name="exclamationcircleo" size={26} color="white" /> */}
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  icon: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 30,
  },
  favoriteButton: {
    
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
    // marginBottom: 20,
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    backgroundColor: 'orange',
    borderRadius: 12,
    padding: 9,
  },
  downloadButton: {
    backgroundColor: 'orange',
    borderRadius: 12,
    padding: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comButton: {
    marginTop: 20,
    backgroundColor: 'lightblue',
    borderRadius: 12,
    padding: 9,
  },
  reportButton: {
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 9,
  },
  contrastGray: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    paddingHorizontal: 15,
    width: screenWidth * 0.90,
    paddingBottom: 20
  },
  contrastDetail: {
    backgroundColor: '#FFD77D',
    borderRadius: 8,
    padding: 15,
  },
});
// import { View, Text, Button, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { AntDesign, FontAwesome } from '@expo/vector-icons';
// import { firebaseauth, firebasedb } from '../config/firebase';
// import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';

// export default function Showfile({ route }) {
//   const { item } = route.params || {};
//   navigator = useNavigation();
//   const user = firebaseauth.currentUser;
//   const [isFavorited, setIsFavorited] = useState(false);

//   useEffect(() => {
//     const userHasFavorited = item.favorited && item.favorited.includes(user.uid);
//     setIsFavorited(userHasFavorited);
//   }, [item.favorited, user.uid]);

//   const getFileIcon = () => {
//     const fileExtension = item.fileName.split('.').pop().toLowerCase();
//     switch (fileExtension) {
//       case 'pdf':
//         return <FontAwesome name="file-pdf-o" size={90} color="orange" />;
//       case 'doc':
//         return <FontAwesome name="file-word-o" size={90} color="blue" />;
//       case 'docx':
//         return <FontAwesome name="file-word-o" size={90} color="blue" />;
//       case 'mp4':
//         return <FontAwesome name="file-video-o" size={90} color="purple" />;
//       default:
//         return <FontAwesome name="file-o" size={90} color="gray" />;
//     }
//   };

//   if (!item) {
//     return (
//       <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
//         <Text style={{fontSize:30}}>Loading...</Text>
//       </View>
//     );
//   }
//   console.log(item.id);

//   return (
//     <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
//       <TouchableOpacity onPress={() => navigator.navigate('ReportNavigator')}>
//       <AntDesign name = 'exclamationcircleo'>Report</AntDesign> 
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           const fileRef = doc(firebasedb, 'files', `${item.id}`);

//           if (isFavorited) {
//             updateDoc(fileRef, {
//               favorited: arrayRemove(user.uid),
//             });
//           } else {
//             updateDoc(fileRef, {
//               favorited: arrayUnion(user.uid),
//             });
//           }

//           setIsFavorited((prevState) => !prevState);
//         }}
//       >
//         <FontAwesome name={isFavorited ? 'star' : 'star-o'} />
//       </TouchableOpacity>
//       <View>
//         {getFileIcon()}
//       </View>
//       <Text>filename: {item.id}</Text>
//       <Text>filename: {item.fileName}</Text>
//       <Text>filesize: {item.fileSize}</Text>
//       <Text>detail</Text>
//       <Text>{item.detail}</Text>
//       <Button title='Dowload File' onPress={()=>{item.url}}></Button>
//       <Button title='Back' onPress={() => navigator.goBack()}/>
//       <Button title='Comment'onPress={() => navigator.navigate('Comment',{
//         item: item.id,
//       }) 
//       }/>
//     </View>

//   );
// }