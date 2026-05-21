// Firebase Configuration for RoadWatch
// Project: road-safety-71e0b

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, updateDoc, onSnapshot, query, orderBy, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSy8MCrut1nj3ZYn9IGICMpY5nETfxwNgpMA",
    authDomain: "road-safety-71e0b.firebaseapp.com",
    projectId: "road-safety-71e0b",
    storageBucket: "road-safety-71e0b.firebasestorage.app",
    messagingSenderId: "955283630211",
    appId: "1:955283630211:web:f04f6a1a63d12b081cd3b6",
    measurementId: "G-W8J2JNR7W8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore helpers
export { collection, doc, addDoc, getDoc, getDocs, updateDoc, onSnapshot, query, orderBy, where, serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged, ref, uploadBytes, getDownloadURL };
