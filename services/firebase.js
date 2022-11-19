import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFCn9k9YAiTyB2lzD6wY3eD-DC0dptPAc",
  authDomain: "example-depdep.firebaseapp.com",
  projectId: "example-depdep",
  storageBucket: "example-depdep.appspot.com",
  messagingSenderId: "756423803863",
  appId: "1:756423803863:web:1f3497576f97ea6434c192",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
