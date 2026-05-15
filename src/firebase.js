import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDqC55ulxVuX3MKiy4CAJyhbSuG74TLBlw",
  authDomain: "prinstan-agri-care.firebaseapp.com",
  projectId: "prinstan-agri-care",
  storageBucket: "prinstan-agri-care.firebasestorage.app",
  messagingSenderId: "143744424137",
  appId: "1:143744424137:web:71e45d96db2e59ef585518",
  measurementId: "G-ZF2HXV5K92"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db, analytics };
