import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, getDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7IDXjjV49EiGFyA4R48EauenyY0akcXs",
  authDomain: "music-855a3.firebaseapp.com",
  projectId: "music-855a3",
  storageBucket: "music-855a3.appspot.com",
  // messagingSenderId: "232904848539",
  appId: "1:232904848539:web:5121ba78f11a358299423e",
  measurementId: "G-EY1PBBTG89",
};

// eslint-disable-next-line
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);
const auth = getAuth();

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const updateUserProfile = async (displayName) => {
  if (!displayName) return;

  console.log({ current: auth.currentUser });

  return await updateProfile(auth.currentUser, {
    displayName,
  });
};

export const checkCurrentUser = () => {
  return auth.currentUser;
};

export const signOutUser = async () => {
  return await signOut(auth);
};

export const checkOnAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);

  console.log({ userDocRef });

  const userSnapshot = await getDoc(userDocRef);
  console.log({ userSnapshot });
  console.log(userSnapshot.exists());

  if (!userSnapshot.exists()) {
    const { email, displayName } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("Error Creating User", error.message);
    }
  }

  return userDocRef;
};
