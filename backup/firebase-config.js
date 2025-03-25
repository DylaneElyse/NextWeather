// firebase-config.js
import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDupMYecZGNdw_EdskcWt-idjbrQc2Isag",
  authDomain: "nextweather-f625c.firebaseapp.com",
  projectId: "nextweather-f625c",
  storageBucket: "nextweather-f625c.firebasestorage.app",
  messagingSenderId: "765827688240",
  appId: "1:765827688240:web:5d72545e5101e6b2e8caf5"
};

const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();


// export { auth, provider, signInWithPopup, signOut };
// const app = initializeApp(firebaseConfig);

export { app };