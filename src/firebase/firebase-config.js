import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBkY3WJeUz3WRUpYuQyn_8rnEx2MyeRU_8",
  authDomain: "blog-desserts.firebaseapp.com",
  projectId: "blog-desserts",
  storageBucket: "blog-desserts.appspot.com",
  messagingSenderId: "755706634859",
  appId: "1:755706634859:web:3d3c21c9e916ae3beec72e",
  measurementId: "G-31ZVM03QS3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { db, provider, auth, storage, createUserWithEmailAndPassword };
