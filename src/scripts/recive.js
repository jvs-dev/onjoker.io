import { firebaseConfig } from "./functions/firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createError } from "./functions/error"
import { getCash, incrementCash } from "./functions/userCash"
import { verifyConectedUser } from "./functions/verifyConectedUser"
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

let reciveBtn = document.getElementById("reciveBtn")
let closeReciveSection = document.getElementById("closeReciveSection")
let confirmRecive = document.getElementById("confirmRecive")

reciveBtn.onclick = function () {
    document.getElementById("reciveSection").style.display = "flex"
    setTimeout(() => {
        document.getElementById("reciveSection").style.opacity = "1"
    }, 1);
}
closeReciveSection.onclick = function () {
    document.getElementById("reciveSection").style.opacity = "0"
    setTimeout(() => {
        document.getElementById("reciveSection").style.display = "none"
    }, 200);
}


async function initReciveCash(reciveCash, userEmail, key, name) {
    incrementCash(userEmail, -reciveCash)
    let docRef = await addDoc(collection(db, "recives"), {
        pixKey: `${key}`,
        userName: `${name}`,
        value: Number(reciveCash),
        email: `${userEmail}`
    });
    document.getElementById("reciveSection").style.opacity = "0"
    setTimeout(() => {
        document.getElementById("reciveSection").style.display = "none"
    }, 200);
    let body = document.querySelector("body")
    let errorDiv = document.createElement("div")
    body.insertAdjacentElement("beforeend", errorDiv)
    errorDiv.classList.add("error")
    errorDiv.style.background = "#00FF85"
    errorDiv.innerHTML = `        
        <div class="error__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
        </div>
        <div class="error__title">Saque efetuado com sucesso</div>
        <div class="error__close"><svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 20 20" height="20"><path fill="#393a37" d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z"></path></svg></div>        
    `
    errorDiv.children[2].onclick = function () {
        errorDiv.parentNode.removeChild(errorDiv);
    }    
}


confirmRecive.onclick = function () {
    let reciveKey = document.getElementById("reciveKeyInput").value
    let reciveName = document.getElementById("reciveNameInput").value
    let reciveCash = document.getElementById("reciveCashInput").value
    if (reciveKey != "" && reciveName != "" && reciveCash != "") {
        if (reciveCash >= 20) {
            verifyConectedUser().then(user => {
                getCash(user.email).then(userCash => {
                    if (reciveCash <= userCash) {
                        initReciveCash(reciveCash, user.email, reciveKey, reciveName)
                    } else {
                        createError("Saldo insuficiente", "error")
                    }
                })
            })
        } else {
            createError("Saque mínimo de R$20", "error")
        }
    } else {
        createError("Preencha todos os campos", "error")
    }
}
