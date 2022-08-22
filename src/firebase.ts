import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Replace the following with the config for your own Firebase project
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "???",
  authDomain: "???",
  databaseURL: "???",
  projectId: "???",
  storageBucket: "???",
  messagingSenderId: "???",
  appId: "???"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth(); // access the auth service, return an auth instance 
export const firestore = app.firestore(); // database service 
export const storage = app.storage();
