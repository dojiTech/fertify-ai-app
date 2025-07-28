import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUXPncQry5QMZkvJdFsV8EeUKzY8ebKsQ",
  authDomain: "fertify-ai-app-467302.firebaseapp.com",
  projectId: "fertify-ai-app-467302",
  storageBucket: "fertify-ai-app-467302.firebasestorage.app",
  messagingSenderId: "925597753322",
  appId: "1:925597753322:web:41416d729d10bf67489c93",
  measurementId: "G-J7G938G36W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };