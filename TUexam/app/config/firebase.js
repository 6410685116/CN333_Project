import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCKu0yVki44ZzZFHXXWbw9hQrolfkD71vw",
    authDomain: "exam-archivetu.firebaseapp.com",
    projectId: "exam-archivetu",
    storageBucket: "exam-archivetu.appspot.com",
    messagingSenderId: "94243047675",
    appId: "1:94243047675:web:d4ed96768091a2e4ae485e",
    measurementId: "G-SVLP4C9D2N"
  };

export const firebaseapp = initializeApp(firebaseConfig);
export const firebaseauth = getAuth(firebaseapp);
export const firebasestorage = getStorage(firebaseapp);
export const firebasedb = getFirestore(firebaseapp);
