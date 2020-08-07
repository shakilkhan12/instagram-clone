import firebase from "firebase"
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD5UKa65lbiBTUIHPeuah__PdObIabt8Gc",
    authDomain: "instagram-clone-b59da.firebaseapp.com",
    databaseURL: "https://instagram-clone-b59da.firebaseio.com",
    projectId: "instagram-clone-b59da",
    storageBucket: "instagram-clone-b59da.appspot.com",
    messagingSenderId: "700979658865",
    appId: "1:700979658865:web:30013f0467e7dfe5a95bd0",
    measurementId: "G-P0YEYLW4F1"
})
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };