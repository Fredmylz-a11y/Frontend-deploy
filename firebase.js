import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const config = {
  apiKey: "AIzaSyAPBm2tCfzqnwOG6VMjYXmlQC8TM0MwCGo",
  authDomain: "rhinoverse-2c104.firebaseapp.com",
  projectId: "rhinoverse-2c104",
  storageBucket: "rhinoverse-2c104.firebasestorage.app",
  messagingSenderId: "1047042986271",
  appId: "1:1047042986271:web:a6e7966088c1e74d54602a"
};
const app = initializeApp(config);
// FIX: use named database rhinoverse (same as backend)
const db = getFirestore(app, 'rhinoverse');
export { db };
