import { StyleSheet, Text, View , TouchableOpacity, Button} from 'react-native';
import React, { useState } from 'react'
import { ref, uploadBytes } from "firebase/storage";
import { getStorage } from "firebase/storage";
import { app } from '../config/firebase';
import * as DocumentPicker from 'expo-document-picker';

export default function Upload() {
  const storage = getStorage(app);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Accept any file type
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setFile(result.uri);
      } else {
        console.log('File picking cancelled');
      }
    } catch (error) {
      console.log('Error picking file:', error);
    }
  };

  const uploadFile = async () => {
    setUploading(true);

    const response = await fetch(file);
    const blob = await response.blob();

    const filename = file.substring(file.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `files/${filename}`);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('File uploaded successfully:', downloadURL);
    } catch (error) {
      console.log('Error uploading file:', error);
    }

    setUploading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>File Upload</Text>
      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Pick a file</Text>
      </TouchableOpacity>
      {file && (
        <TouchableOpacity style={styles.button} onPress={uploadFile}>
          <Text style={styles.buttonText}>Upload File</Text>
        </TouchableOpacity>
      )}
      {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  uploadingText: {
    marginTop: 10,
  },
});