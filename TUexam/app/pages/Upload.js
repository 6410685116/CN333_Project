import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { firebasestorage, firebasedb, firebaseauth } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FontAwesome } from '@expo/vector-icons';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';

export default function Upload() {
  const user = firebaseauth.currentUser;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileType, setFileType] = useState('exam');
  const [course, setCourse] = useState('none');
  const [detail, setDetail] = useState('none');

  const pickFile = async () => {
    // try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        // type: "application/*",
        multiple: false,
      });
      if (!result.canceled) {
        setFile(result);
      }
    // } catch (error) {
    //   console.error('Error picking file:', error);
    // }
  };

  const uploadFile = async () => {
    const response = await fetch(file.assets[0].uri);
    const blob = await response.blob();
    const fileRef = ref(firebasestorage, `${fileType}/${user.uid}/${file.assets[0].name}` + new Date().getTime());
    const uploadTask = uploadBytesResumable(fileRef, blob);
    const fileSize = blob.size;
    const fileName = blob.name;
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString(), course, detail);
        } catch (error) {
          console.error('Error saving record:', error);
        }
      }
    );
  };

  const getFileIcon = () => {
    const fileExtension = file.assets[0].name.split('.').pop().toLowerCase();
    switch (fileExtension) {
      case 'pdf':
        return <FontAwesome name="file-pdf-o" size={64} color="orange" />;
      case 'doc':
        return <FontAwesome name="file-word-o" size={64} color="blue" />;
      case 'docx':
        return <FontAwesome name="file-word-o" size={64} color="blue" />;
      case 'mp4':
        return <FontAwesome name="file-video-o" size={64} color="purple" />;
      default:
        return <FontAwesome name="file-o" size={64} color="gray" />;
    }
  };

  async function saveRecord(fType, url, createdAt, course, detail){
    try {
      const udoc = doc(firebasedb, "users", `${user.uid}`);
      const udata = await getDoc(udoc);
      const docRef = await addDoc(collection(firebasedb, 'files'), {
        fileType: fType,
        url: url,
        createdAt: createdAt,
        course: course,
        user: user.uid,
        fileSize: AdjustFilesize(file.assets[0].size),
        countStar: 0,
        detail: detail,
        fileName: file.assets[0].name,
        searchName: file.assets[0].name.toLowerCase(),
        userStatus: udata.data().Status,
      })
    } catch (error) {
      console.log(error);
    }
  }

  const cancelFile = async () => {
    setFile(null);
    setProgress(0);
  }

  const AdjustFilesize = (fs) => {
    if (fs > 1000000000) {
      return (fs / 1000000000).toFixed(2) + ' GB';
    } else if (fs > 1000000) {
      return (fs / 1000000).toFixed(2) + ' MB';
    } else if (fs > 1000) {
      return (fs / 1000).toFixed(2) + ' KB';
    } else {
      return fs + ' Bytes';
    }
  };

  return (
    <View style={styles.container}>
      {!file && <FontAwesome name="upload" size={48} color="black" />}
      <Text style={styles.heading}>Upload File</Text>

       
      {!file && (
        <TouchableOpacity style={styles.pickFileButton} onPress={pickFile}>
          <Text style={styles.pickFileButtonText}>Pick File</Text>
        </TouchableOpacity>
      )}
      {file && (
        <View style={{alignItems: 'center'}}>
          {getFileIcon()}
          <Text style={styles.fileName}>{file.assets[0].name}, file size: {AdjustFilesize(file.assets[0].size)}</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioButton, fileType === 'exam' && styles.radioButtonSelected]}
              onPress={() => setFileType('exam')}
            >
              <Text style={styles.radioLabel}>Exam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, fileType === 'summary' && styles.radioButtonSelected]}
              onPress={() => setFileType('summary')}
            >
              <Text style={styles.radioLabel}>Summary</Text>
            </TouchableOpacity>
          </View>
          <Button title="Upload File" onPress={uploadFile} />
          <Button title="Cancel File" onPress={cancelFile} />
          {progress > 0 && <Text>{progress.toFixed(0)}% uploaded</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    backgroundColor: 'gray',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  radioButtonSelected: {
    backgroundColor: 'orange',
  },
  radioLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  fileName: {
    fontSize: 16,
    marginTop: 10,
  },
  pickFileButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  pickFileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});