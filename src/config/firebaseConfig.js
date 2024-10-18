// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyA0G8T9HB6Y-XpNFHzcOMfRiv4ozYTHWXo",
  authDomain: "cosync-space-21bfa.firebaseapp.com",
  projectId: "cosync-space-21bfa",
  storageBucket: "cosync-space-21bfa.appspot.com",
  messagingSenderId: "274060203584",
  appId: "1:274060203584:web:f854022ded1e244573b1a5",
  measurementId: "G-L0ZL5XJN07"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
