// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-eWUjlwS6tDRiF1IiPKC9xtXltbaHeK4",
  authDomain: "finpal-feedback.firebaseapp.com",
  projectId: "finpal-feedback",
  storageBucket: "finpal-feedback.firebasestorage.app",
  messagingSenderId: "175794720464",
  appId: "1:175794720464:web:7bad1998c5c56c207618d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };