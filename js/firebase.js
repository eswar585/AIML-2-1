// ==========================================
// FIREBASE CONFIGURATION
// STUDENT NOTES PORTAL
// ==========================================


// ==========================================
// FIREBASE APP
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


// ==========================================
// FIREBASE AUTHENTICATION
// ==========================================

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


// ==========================================
// FIRESTORE DATABASE
// ==========================================

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyAaARTNH0IbzJEe9TeVxkhHIXmoaFcp3eU",

    authDomain: "aiml-2-1.firebaseapp.com",

    projectId: "aiml-2-1",

    storageBucket: "aiml-2-1.firebasestorage.app",

    messagingSenderId: "58815552013",

    appId: "1:58815552013:web:4121de2b131ffac22a9344"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
    initializeApp(firebaseConfig);


// ==========================================
// INITIALIZE AUTHENTICATION
// ==========================================

const auth =
    getAuth(app);


// ==========================================
// INITIALIZE FIRESTORE
// ==========================================

const db =
    getFirestore(app);


// ==========================================
// EXPORT
// ==========================================

export {
    auth,
    db
};
