
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDGO-cdkE3C5Rh6Ygitn7GLz9crzUpPoPI",
    authDomain: "tasksbuddy18.firebaseapp.com",
    projectId: "tasksbuddy18",
    storageBucket: "tasksbuddy18.appspot.com", 
    appId: "1:1096270367575:web:af08f19874eda84a4f0c12",
    measurementId: "G-DEKN0B5QP5"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const storage = getStorage(app);
