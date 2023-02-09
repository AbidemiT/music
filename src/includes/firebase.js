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
import {
  getFirestore,
  getDoc,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  deleteDoc,
  limit,
  orderBy,
  startAfter,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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
const storage = getStorage(app);

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

export const createSongDocument = async (song) => {
  if (!song) return;

  const createdAt = new Date();

  const songDocRef = doc(db, "songs", `song_id-${createdAt.getTime()}`);

  console.log({ songDocRef });

  const songSnapshot = await getDoc(songDocRef);
  console.log({ songSnapshot });
  console.log(songSnapshot.exists());

  if (!songSnapshot.exists()) {
    const {
      uid,
      display_name,
      original_name,
      modified_name,
      genre,
      comment_count,
      url,
    } = song;

    try {
      await setDoc(songDocRef, {
        uid,
        display_name,
        original_name,
        modified_name,
        genre,
        comment_count,
        url,
        createdAt,
      });
    } catch (error) {
      console.log("Error Creating Song", error.message);
    }
  }

  return songDocRef;
};
export const createCommentDocument = async (comment) => {
  if (!comment) return;

  const createdAt = new Date();

  const commentDocRef = doc(
    db,
    "comments",
    `comment_id-${createdAt.getTime()}`
  );

  console.log({ commentDocRef });

  const songSnapshot = await getDoc(commentDocRef);
  console.log({ songSnapshot });
  console.log(songSnapshot.exists());

  if (!songSnapshot.exists()) {
    const { uid, content, datePosted, sid, name } = comment;

    try {
      await setDoc(commentDocRef, {
        uid,
        content,
        datePosted,
        sid,
        name,
        createdAt,
      });
    } catch (error) {
      console.log("Error Creating Comment", error.message);
    }
  }

  return commentDocRef;
};

export const customSnapshot = async (customDocRef) => {
  if (!customDocRef) return;

  return await getDoc(customDocRef);
};

export const createChildStorageRef = (child, file) => {
  if (!child) return;

  const storageRef = ref(storage, child);

  // 'file' comes from the Blob or File API
  return uploadBytesResumable(storageRef, file);
};

export const downloadUrl = async (uploadTask) => {
  if (!uploadTask) return;

  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  return await getDownloadURL(uploadTask.snapshot.ref);
};

export const fetchSong = async (id) => {
  if (!id) return;

  const docRef = doc(db, "songs", id);
  return await getDoc(docRef);

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());

  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
};

export const fetchSongs = async () => {
  const q = query(
    collection(db, "songs"),
    where("uid", "==", auth.currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot;
};

export const fetchSongsWithLimitLatVisible = async (
  limitValue,
  songs,
  lastVisibleValue
) => {
  if (!limitValue && lastVisibleValue) return;

  const lastVisible = songs[songs.length - 1].docId;

  // Construct a new query starting at this document,
  // get the next 2 songs.
  const next = query(
    collection(db, "songs"),
    orderBy("docId"),
    startAfter(lastVisible),
    limit(limitValue)
  );
  const snapshot = await getDocs(next);
  return snapshot;
};

export const fetchSongsWithLimit = async (limitValue) => {
  if (!limitValue) return;

  const next = query(
    collection(db, "songs"),
    orderBy("docId"),
    limit(limitValue)
  );

  const snapshot = await getDocs(next);

  return snapshot;
};

export const updateSong = async (docId, editedData) => {
  if (!docId && !editedData) return;

  const songDocRef = doc(db, "songs", docId);

  // To update age and favorite color:
  return await updateDoc(songDocRef, editedData);
};

export const deleteSong = async (original_name, docId) => {
  if (!original_name) return;

  // Create a reference to the file to delete
  const songRef = ref(storage, `songs/${original_name}`);

  await deleteDoc(doc(db, "songs", docId));

  // Delete the file
  return await deleteObject(songRef);
};

export const fetchComment = async (id) => {
  if (!id) return;

  const docRef = doc(db, "comments", id);
  return await getDoc(docRef);

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());

  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
};

export const fetchComments = async (songId) => {
  const q = query(collection(db, "comments"), where("sid", "==", songId));

  const querySnapshot = await getDocs(q);

  return querySnapshot;
};
