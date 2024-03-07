import { firebaseConfig } from "./firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

export async function getMount() {
    return new Promise(async (resolve) => {
        const docRef = doc(db, "mount", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            resolve(docSnap.data().totalCash)
        }
    })
}

export async function incrementMount(value) {
    const mountRef = doc(db, "mount", `main`);
    await updateDoc(mountRef, {
        totalCash: increment(Number(value))
    });
}