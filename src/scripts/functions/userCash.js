import { firebaseConfig } from "./firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getUserDoc } from "./userData";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

export async function getCash(email) {
    let userCash
    let accountExists = false
    let q = query(collection(db, "users"), where("email", "==", `${email}`));
    let querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        if (accountExists == false) {
            accountExists = true
            userCash = doc.data().cash
        }
    });
    if (accountExists == false) {
        accountExists = false
        return 'account is not exists'
    } else {
        return userCash
    }
}

export async function incrementCash(email, value) {
    getUserDoc(email).then(async (userDoc) => {
        let washingtonRef = doc(db, "users", `${userDoc.id}`);
        await updateDoc(washingtonRef, {
            cash: increment(value)
        });        
    })
}