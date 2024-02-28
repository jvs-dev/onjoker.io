import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function verifyConectedUser() {
    return new Promise((resolve)=> {
        let result
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;            
                result = user                
            } else {
                result = 'User is signed out'
            }
            resolve(result)
        });        
    })    
}
