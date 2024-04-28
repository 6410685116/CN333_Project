import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';
import { firebaseauth, firebasedb } from '../config/firebase';

const user = firebaseauth.currentUser;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

let comments = [];
const Comment = () => {
    const route = useRoute();
    const [comment, setComment] = useState('');
    const {item} = route.params || {};
    const inputRef = useRef();
    const [commentsList, setCommentsList] =useState([])
    const [refresh, setRefresh] = useState(false)

    const pullToRefresh = () =>{
        setRefresh(true)

        setTimeout(() => {
            setRefresh(false)
        },)
    }
    const fetchData = async() =>{
        const fileRef = doc(firebasedb, 'files', `${item}`);
        const docSnap = await getDoc(fileRef)
        setCommentsList(docSnap.data().comments);
        console.log(docSnap.data().comments);
    }

    useEffect(()=>{
        fetchData();
    }, [])

    const postComment =  async () => {

        const fileRef = doc(firebasedb, 'files', `${item}`);
        await updateDoc(fileRef, {
            comments: arrayUnion({
                user: user.uid,
                userName: user.displayName,
                comment: comment,
                item: item
            })
        });
        console.log('updated!');
    }


  return (

    <View style= {{flex:1}}>
      <FlatList
      data ={commentsList} renderItem={({item, index}) =>{
        return(
            <View style={{width: '100%',  height: 100 }}>
            <View style= {{flexDirection: 'row'}}>
            <Image source ={{uri: user.photoURL}} style={{width:40,height:40}}/>
            <Text>{item.userName}</Text>
            </View>
            <Text>{item.comment}</Text>
            </View>
            
        );
      }
        
    }/>
      <View style = {{
        width:'100%', 
        height:60, 
        position:'absolute', 
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'#F9E3A3'
        }}>
        <TextInput
        ref = {inputRef}
        value = {comment}
        onChangeText={txt => {
            setComment(txt);
        }}
        placeholder='Type comment here....'
        style = {{marginLeft:20}}
        />
        <TouchableOpacity
            onPress={() =>{
                postComment();
                setComment('');
                fetchData();
            }}
            style ={{marginRight:10, fontSize: 18, fontWeight:'600'
        }}><Text>Send</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default Comment