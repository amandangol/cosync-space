// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "colabhub-3c818.firebaseapp.com",
  projectId: "colabhub-3c818",
  storageBucket: "colabhub-3c818.appspot.com",
  messagingSenderId: "653130007083",
  appId: "1:653130007083:web:9b0defaf2fa15ccdb8a06e",
  measurementId: "G-PFJSF8D2N1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
