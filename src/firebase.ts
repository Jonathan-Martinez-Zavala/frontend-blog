import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";

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

// Initialize Firestore
export const db = getFirestore(app);



// ===============================
// Obtener todos los documentos de una colección
// ===============================

export const getAll = async <T = { uid: string, displayName: string, email: string, photoURL: string, role: string }>(collectionName: string): Promise<(T & { id: string })[]> => {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as (T & { id: string })[];
};


// Obtener un documento por ID
export const getById = async <T = any>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  } as T & { id: string };
};

export default app;
