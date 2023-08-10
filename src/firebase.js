// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAAcySbIJN97QzXRPE2jle6hAthTE7tnxE",
    authDomain: "realtor-clone-react-efba0.firebaseapp.com",
    projectId: "realtor-clone-react-efba0",
    storageBucket: "realtor-clone-react-efba0.appspot.com",
    messagingSenderId: "1074719108763",
    appId: "1:1074719108763:web:f0a8e7404cb7edb383603e"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()