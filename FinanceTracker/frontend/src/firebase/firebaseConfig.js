// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKZIkhIazIsvCVetrPAeI1A-zRLr8WqQ8",
    authDomain: "finance-tracker-9a9fa.firebaseapp.com",
    projectId: "finance-tracker-9a9fa",
    storageBucket: "finance-tracker-9a9fa.firebasestorage.app",
    messagingSenderId: "188543072109",
    appId: "1:188543072109:web:0bf041b96708cc0d5f8c64",
    measurementId: "G-MZQWY590FT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = firebase.firestore();
export const auth = app.auth();
export default db