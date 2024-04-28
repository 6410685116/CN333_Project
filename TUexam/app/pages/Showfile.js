import { View, Text, Button, TouchableOpacity, Linking, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { firebaseauth, firebasedb } from '../config/firebase';
import { updateDoc, arrayUnion, arrayRemove, doc, collection, query, limit, getDocs, getDoc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default function Showfile({ route }) {
  const { item } = route.params || {};
  navigator = useNavigation();
  const [user, setUser] = useState(firebaseauth.currentUser);
  const [isFavorited, setIsFavorited] = useState(false);
  const [rating, setRating] = useState(item.countStar || 0);
  const [recentComments, setRecentComments] = useState([]);

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
  setUser(firebaseauth.currentUser)
  fetchRecentComments();
}, [item.favorited, user.uid, item.id]);

// Fetch recent comments
const fetchRecentComments = async () => {
  const comments = item.comments
  if (!comments) {
    setRecentComments([]);
  } else {
    setRecentComments(comments);
  }
};

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

  const handleRating = (value) => {
    setRating(value);
    const fileRef = doc(firebasedb, 'files', `${item.id}`);
    updateDoc(fileRef, {
      countStar: value,
    });
  };

  const renderComment = ({ item: comment }) => { 
    return (
      <View style={styles.commentContainer}>
        <Image source={{ uri: comment.userPhotoURL }} style={styles.userImage} />
        <View>
          <Text style={{fontWeight:'bold'}}>{comment.userName}</Text>
          <Text style={styles.commentText}>{comment.comment}</Text>
        </View>
      </View>
    );
  };

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

        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleRating(index + 1)}
              style={{ marginHorizontal: 5 }} // Add horizontal margin between stars
            >
              <AntDesign
                name="star"
                size={24}
                color={index < rating ? 'orange' : 'gray'}
              />
            </TouchableOpacity>
          ))}
        </View>

        
        {/* <View style={styles.iconContainer}>{getFileIcon()}</View> */}
        <Text style={styles.text}>Filename: {item.fileName}</Text>
        <Text style={styles.text}>Filesize: {item.fileSize}</Text>
        <Text style={styles.detailTitle}>Detail:</Text>
        <Text style={[styles.detailText,styles.contrastDetail]}>{item.detail}</Text>
        <OpenURLButton url={item.url}>Download</OpenURLButton>
        <TouchableOpacity
          style={styles.commentsBox}
          onPress={() => navigator.navigate('Comment', {item: item.id,})}
        >
          <Text style={styles.commentsBoxText}>Comments</Text>
          {recentComments.length === 0 ? (
            <Text style={styles.noCommentsText}>No comments yet.</Text>
          ) : 
          <FlatList
            data={recentComments}
            renderItem={renderComment}
            keyExtractor={(item, index) => `${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />}
          
        </TouchableOpacity>
      </View>
       

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
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  favoriteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
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
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    alignItems: 'center',
  },
  commentsBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  commentsBoxText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth * 0.3,
  },
  commentText: {
    fontSize: 14,
  },
  noCommentsText: {
    fontSize: 14,
    color: 'gray',
  },
  userImage: {
    width: 30,
    height: 30,
    borderWidth: 3,
    borderRadius: 30,
    overflow: 'hidden',
    borderColor: '#3D53F1',
    marginRight: 10,
},
});