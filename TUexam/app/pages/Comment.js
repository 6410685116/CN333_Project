import { View, Text, Dimensions, TextInput, TouchableOpacity, FlatList, Image, RefreshControl, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { updateDoc, arrayUnion, arrayRemove, doc, getDoc } from 'firebase/firestore';
import { firebaseauth, firebasedb } from '../config/firebase';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Comment = () => {
    const [user, setUser] = useState(firebaseauth.currentUser);
    const route = useRoute();
    const [comment, setComment] = useState('');
    const { item } = route.params || {};
    const inputRef = useRef();
    const [commentsList, setCommentsList] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async () => {
        const fileRef = doc(firebasedb, 'files', `${item}`);
        const docSnap = await getDoc(fileRef)
        setCommentsList(docSnap.data().comments);
        console.log(docSnap.data().comments);
    }

    useEffect(() => {
        setUser(firebaseauth.currentUser);
        fetchData();
    }, [])

    const postComment = async () => {
        const fileRef = doc(firebasedb, 'files', `${item}`);
        await updateDoc(fileRef, {
            comments: arrayUnion({
                user: user.uid,
                userName: user.displayName,
                userPhotoURL: user.photoURL,
                comment: comment,
                item: item
            })
        });
        console.log('updated!');
        fetchData();
    }

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    return (
        <View style={{flex:1}}>
        <View style={styles.container}>
            <FlatList
                data={commentsList}
                renderItem={({ item, index }) => (
                    <View style={styles.commentContainer}>
                        <View style={styles.commentHeader}>
                            <Image source={{ uri: item.userPhotoURL }} style={styles.userImage} />
                            <Text style={styles.userName}>{item.userName}</Text>
                        </View>
                        <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3D53F1']}
                        tintColor={'#3D53F1'}
                    />
                }
            />
            </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        value={comment}
                        onChangeText={txt => setComment(txt)}
                        placeholder='Type comment here....'
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            postComment();
                            setComment('');
                        }}
                        style={styles.sendButton}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: screenHeight*0.065
    },
    commentContainer: {
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userImage: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        overflow: 'hidden',
        borderColor: '#3D53F1',
        marginRight: 10,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 18,
    },
    inputContainer: {
        width: '100%',
        height: 60,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9E3A3',
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#3D53F1',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }, 
});

export default Comment;
