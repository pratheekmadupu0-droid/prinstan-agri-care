import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFXvSwZSrMbYHQkrge6UyZOv2uxU0VkPA",
  authDomain: "emergency-qr-b0adf.firebaseapp.com",
  databaseURL: "https://emergency-qr-b0adf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "emergency-qr-b0adf",
  storageBucket: "emergency-qr-b0adf.firebasestorage.app",
  messagingSenderId: "326186798135",
  appId: "1:326186798135:web:21b57be22dff85849303b2",
  measurementId: "G-SPGK1149TH"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app); 
const storage = getStorage(app);

export { auth, googleProvider, db, storage, analytics };
