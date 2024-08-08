// import firebaseConfig from '../src/firebase/firebase.config'

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker
// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

firebase.initializeApp({
    // apiKey: import.meta.env.VITE_apiKey,
    // authDomain: import.meta.env.VITE_authDomain,
    // projectId: import.meta.env.VITE_projectId,
    // storageBucket: import.meta.env.VITE_storageBucket,
    // messagingSenderId: import.meta.env.VITE_messagingSenderId,
    // appId: import.meta.env.VITE_appId

    apiKey:"AIzaSyBpYA4j53WuyZ1XYaLz2XP2mBIbfXFa_qY",
    authDomain:"perfecto-base-app.firebaseapp.com",
    projectId:"perfecto-base-app",
    storageBucket:"perfecto-base-app.appspot.com",
    messagingSenderId:"1042984089947",
    appId:"1:1042984089947:web:bde19ac9c6baa4580dc27e",
    measurementId:"G-TDG8YSMS5F",
    // VITE_APP_VAPID_KEY= "BEuRYBmGbLGo-vYSsdyqihtD80eMxMRYSj_u6d54MjvUP6QRNBs490oHLxOahjwksilFPE2yXYGTMJVx1e9jByg",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();



messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});