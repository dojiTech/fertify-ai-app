import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
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

let auth;
if (getApps().length < 1) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };