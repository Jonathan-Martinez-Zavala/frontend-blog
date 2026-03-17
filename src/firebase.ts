import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEHLE-aYHXtNwEBDVqnLxOd5ElvOOHvVE",
  authDomain: "rico-negotiation-blog.firebaseapp.com",
  projectId: "rico-negotiation-blog",
  storageBucket: "rico-negotiation-blog.firebasestorage.app",
  messagingSenderId: "642630869567",
  appId: "1:642630869567:web:70baa687ff8c4c088e4e8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
