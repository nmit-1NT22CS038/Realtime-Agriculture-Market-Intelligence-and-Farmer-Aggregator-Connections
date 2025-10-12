import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsDvecPuivZ4WK2NjAJakw363_w7Ao22o",
  authDomain: "agrilink-pro-52d43.firebaseapp.com",
  projectId: "agrilink-pro-52d43",
  storageBucket: "agrilink-pro-52d43.firebasestorage.app",
  messagingSenderId: "586273255769",
  appId: "1:586273255769:web:e6402eee543e86c602dc48",
  measurementId: "G-K5ZVZ3R52D"
};


// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Export initialized instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
