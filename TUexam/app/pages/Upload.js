import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { firebasestorage, firebasedb, firebaseauth } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FontAwesome } from '@expo/vector-icons';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const courses = [
  {course: 'C Programming'},
  {course: 'Python Programming'},
  {course: 'dog'},
  {course: 'cat', code: 'Py'},
  {course: 'Programming'},
  {course: 'aaa'},
  {course: 'bbb'},
  {course: 'cccc'},
];

export default function Upload() {
  const user = firebaseauth.currentUser;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [fileType, setFileType] = useState('exam');
  // const [course, setCourse] = useState('none');
  const [detail, setDetail] = useState('');

  const [courseList, setCourseList] = useState(courses);
  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [tempSearch, setTempSearch] = useState(courses);
  const searchRef = useRef();


  const onSearch = search => {
    if (search !== '') {
      let tempData = courseList.filter(item => {
        return item.course.toLowerCase().indexOf(search.toLowerCase()) > -1;
      });
      setTempSearch(tempData);
    } else {
      setTempSearch(courses);
    }
  };

  const pickFile = async () => {
    // try {
      const result = await DocumentPicker.getDocumentAsync({
        // type: "*/*",
        type: "application/*",
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
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes);
        setProgress(progress);
      },
      (error) => {
        console.error('Error uploading file:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          await saveRecord(fileType, downloadURL, new Date().toISOString(), selectedCourse, detail);

          setTimeout(() => {
            cancelFile();
          }, 2000);

        } catch (error) {
          console.error('Error saving record:', error);
        }
      }
    );
    setCourseList(courses);
  };

  const getFileIcon = () => {
    const fileExtension = file.assets[0].name.split('.').pop().toLowerCase();
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
        favorited: [],
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

       
      {!file && (
        <View style={{ alignItems: 'center'}}>
          <FontAwesome name="upload" size={60} color="black" style={{marginBottom:5}}/>
          <Text style={styles.heading}>Upload File</Text>
          <TouchableOpacity style={styles.pickFileButton} onPress={pickFile}>
            <Text style={styles.pickFileButtonText}>Pick File</Text>
          </TouchableOpacity>
        </View>
      )}
      {file && (
        <View style={{alignItems: 'center', marginTop: -80}}>
          {getFileIcon()}
          <View style={styles.fileDetail}>
            <Text style={styles.fileName}>File name: {file.assets[0].name}</Text>
            <Text style={styles.fileName}>File size: {AdjustFilesize(file.assets[0].size)}</Text>

            <View style={styles.radioContainer}>
            <Text style={styles.fileName}>Type:</Text>
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

            <View style={{ position: 'relative', flexDirection:'row'}}>
              <Text style={styles.fileName}>Select course: </Text>
              <TouchableOpacity
                style={{
                  width: '50%',
                  height: 50,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                onPress={() => {
                  setClicked(!clicked);
                }}
              >
                <Text style={{ fontWeight: '600' }}>
                  {selectedCourse == '' ? 'Select Course' : selectedCourse}
                </Text>
              </TouchableOpacity>
              {clicked ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 50,
                    right: 70,
                    height: 200,
                    zIndex: 1,
                    elevation: 5,
                    marginTop: 5,
                    alignSelf: 'center',
                    width: '50%',
                    backgroundColor: '#fff',
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    placeholder="Search.."
                    value={search}
                    ref={searchRef}
                    onChangeText={txt => {
                      onSearch(txt);
                      setSearch(txt);
                    }}
                    style={{
                      width: '90%',
                      height: 50,
                      alignSelf: 'center',
                      borderWidth: 0.2,
                      borderColor: '#8e8e8e',
                      borderRadius: 7,
                      marginTop: 10,
                      paddingLeft: 10,
                    }}
                  />

                  <FlatList
                    data={tempSearch}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            height: 50,
                            justifyContent: 'center',
                            borderBottomWidth: 0.5,
                            borderColor: '#8e8e8e',
                          }}
                          onPress={() => {
                            setSelectedCourse(item.course);
                            setClicked(!clicked);
                            onSearch('');
                            setSearch('');
                          }}
                        >
                          <Text style={{ fontWeight: '600' }}>{item.course}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              ) : null}
            </View>


            <View>
              <Text style={styles.fileName}>Details</Text>
              <TextInput
                multiline
                style={styles.bioInput}
                value={detail}
                onChangeText={setDetail}
                placeholder={'Your file description'}
              />
            </View>
            
            <View style={{flexDirection:'row', alignSelf:'center'}}>
              <TouchableOpacity onPress={uploadFile} style={styles.uploadButton}>
                <Text style={styles.signButtonText}>Upload</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelFile} style={styles.cancelButton}>
                <Text style={styles.signButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {progress == 1 && (
              <View style={styles.progressContainer}>
                <Text style={{ opacity: 1 }}>Uploaded Done</Text>
              </View>
            )}
          </View>  
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
    // alignItems: 'center',
    marginBottom: 20,
  },
  radioButton: {
    backgroundColor: 'gray',
    // paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: 'orange',
  },
  radioLabel: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
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
  fileDetail: {
    marginTop: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  bioInput: {
    backgroundColor: '#F9E3A3',
    borderRadius: 10,
    height: screenHeight * 0.245,
    width: screenWidth * 0.9,
    paddingHorizontal: 10,
    paddingTop: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#3D53F1',
    padding: 10,
    borderRadius: 30,
    margin: screenWidth*0.04,
    alignItems: 'center',
    width: screenWidth*0.35,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation:3,
  },
  cancelButton: {
    backgroundColor: '#EB4023',
    padding: 10,
    borderRadius: 30,
    margin: screenWidth*0.04,
    alignItems: 'center',
    width: screenWidth*0.35,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation:3,
  },
  signButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    opacity:0.75,
    backgroundColor: '#E3E3E3',
    paddingVertical: 50,
    borderRadius: 20,
    marginHorizontal: 35,
    position: 'absolute',
    zIndex: 1,
    elevation: 3,
    bottom: 250,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});