import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
require('dotenv').config()

const config = {
  apiKey: "AIzaSyC4tSvVsnGsYkzLycn7JIgBHh93OK0OIAQ",
  authDomain: "e-comm-db-ad023.firebaseapp.com",
  databaseURL: "https://e-comm-db-ad023.firebaseio.com",
  projectId: "e-comm-db-ad023",
  storageBucket: "e-comm-db-ad023.appspot.com",
  messagingSenderId: "85160891443",
  appId: "1:85160891443:web:ffeff58b648da0d93abf46",
  measurementId: "G-GEMGPK0Q78"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

//From Firebase we pull the data 
export const addCollectionAndDocuments = async(collectionKey, objectsToAdd)=>{
  const collectionRef = firestore.collection(collectionKey);
  const batch = firestore.batch();
  objectsToAdd.forEach((obj)=>{
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  })
  return await batch.commit();
}

// After pull the data we send store the data at our Redux 
export const convertCollectionsSnapshotToMap = collectionsSanpshot => {
  const transformedCollection = collectionsSanpshot.docs.map(docSnapshot => {
    const {title, items} = docSnapshot.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: docSnapshot.id,
      title, 
      items
    };
  });

  return transformedCollection.reduce((accumulator, collection)=>{
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator
  },{});
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
