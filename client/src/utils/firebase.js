// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-9f4f1.firebaseapp.com",
  projectId: "taskmanager-9f4f1",
  storageBucket: "taskmanager-9f4f1.appspot.com",
  messagingSenderId: "506390868435",
  appId: "1:506390868435:web:110c2df0abfb090368ff26",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
