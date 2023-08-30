// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeZd7XaTPhpIVI_EhKt1jnh4ce6cNERfs",
  authDomain: "proyectocoder-e059c.firebaseapp.com",
  projectId: "proyectocoder-e059c",
  storageBucket: "proyectocoder-e059c.appspot.com",
  messagingSenderId: "520326656946",
  appId: "1:520326656946:web:72a3c995c3d3f7f53d6aab",
  measurementId: "G-NND82GGCJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
