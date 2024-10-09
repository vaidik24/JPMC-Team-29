// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "boilerplate-daac2.firebaseapp.com",
  projectId: "boilerplate-daac2",
  storageBucket: "boilerplate-daac2.appspot.com",
  messagingSenderId: "864318961355",
  appId: "1:864318961355:web:c19a0fed780442804d0d4e",
  measurementId: "G-VWGR7N5PHJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
