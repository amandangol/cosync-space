// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCb3i0x-FqHat53tj0w8h2dVWP7MzKR-BY",
  authDomain: "cosync-space.firebaseapp.com",
  projectId: "cosync-space",
  storageBucket: "cosync-space.appspot.com",
  messagingSenderId: "758593059048",
  appId: "1:758593059048:web:504a22638adc16d778715d",
  measurementId: "G-HGPP2H2WM5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
