import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const config = {
  apiKey: "AIzaSyAPBm2tCfzqnwOG6VMjYXmlQC8TM0MwCGo",
  authDomain: "rhinoverse-2c104.firebaseapp.com",
  projectId: "rhinoverse-2c104",
  storageBucket: "rhinoverse-2c104.firebasestorage.app",
  messagingSenderId: "1047042986271",
  appId: "1:1047042986271:web:a6e7966088c1e74d54602a",
  measurementId: "G-BF14LVD67H"
};
const app = initializeApp(config);
const db = getFirestore(app);
export { db };
