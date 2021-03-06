import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGG-TuTmv8Elm9lg9bF8jYM9BKim60zr8",
  authDomain: "casos-clinicos-7a177.firebaseapp.com",
  projectId: "casos-clinicos-7a177",
  storageBucket: "casos-clinicos-7a177.appspot.com",
  messagingSenderId: "705299069835",
  appId: "1:705299069835:web:2339f40ef2498071a5cd8e",
  measurementId: "G-JVPXBQ9PZ1"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth =  getAuth();
//creamos un hook para enviar el estado del usuario actual
export function useAuth(){
  const [currentUser, setCurrentUser]= useState();

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}
export function iniciarSesion( email, password){
  return signInWithEmailAndPassword(auth, email, password)
  
}
