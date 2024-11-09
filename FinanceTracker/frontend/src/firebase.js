import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase configuration values
const firebaseConfig = {
    apiKey: "AIzaSyBKZIkhIazIsvCVetrPAeI1A-zRLr8WqQ8",
    authDomain: "finance-tracker-9a9fa.firebaseapp.com",
    projectId: "finance-tracker-9a9fa",
    storageBucket: "finance-tracker-9a9fa.appspot.com", // corrected storage bucket URL
    messagingSenderId: "188543072109",
    appId: "1:188543072109:web:0bf041b96708cc0d5f8c64",
    measurementId: "G-MZQWY590FT"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Set up authentication state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);
    } else {
        console.log("No user is logged in.");
    }
});

export default app;
