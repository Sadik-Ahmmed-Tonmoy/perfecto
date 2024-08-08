// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";

import {getMessaging} from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    // apiKey: import.meta.env.VITE_apiKey,
    // authDomain: import.meta.env.VITE_authDomain,
    // projectId: import.meta.env.VITE_projectId,
    // storageBucket: import.meta.env.VITE_storageBucket,
    // messagingSenderId: import.meta.env.VITE_messagingSenderId,
    // appId: import.meta.env.VITE_appId

    apiKey: "AIzaSyDVieC_-9UzRNV6xjjqPbp9oeDFC2nsNA4",
  authDomain: "perfecto-b2026.firebaseapp.com",
  projectId: "perfecto-b2026",
  storageBucket: "perfecto-b2026.appspot.com",
  messagingSenderId: "764049731209",
  appId: "1:764049731209:web:a0ab4b7d49c2317de02058",
  measurementId: "G-X5HC7B4MCX"
    // VITE_APP_VAPID_KEY= "BEuRYBmGbLGo-vYSsdyqihtD80eMxMRYSj_u6d54MjvUP6QRNBs490oHLxOahjwksilFPE2yXYGTMJVx1e9jByg",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Messaging service
export const messaging = getMessaging(app);

