import { firebaseConfig } from "./firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { verifyConectedUser } from "./verifyConectedUser";
import { getFirestore, collection, query, where, getDocs, getDoc, deleteDoc, doc, setDoc, addDoc, updateDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getUserDoc } from "./userData";
import { incrementCash } from "./userCash";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

setInterval(async () => {
    let q = query(collection(db, "payments"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        verifyPay(doc.data(), doc.id)
    });
}, 3000);

async function getPayData(id) {
    return new Promise(resolve => {
        let requestBody = {
            payId: id,
        };
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        fetch('http://localhost:3000/api/getPay', requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao enviar requisição: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                resolve(data)
            })
    })
}

async function deletePay(id) {
    await deleteDoc(doc(db, "payments", `${id}`));
}

async function userPayed(userData, id, payData, vouncherData) {
    incrementCash(userData.email, vouncherData.amount)    

    const paymentRef = doc(db, "payments", `${id}`);
    await updateDoc(paymentRef, {
        status: `${payData.result.status}`
    });
    const mountRef = doc(db, "mount", `main`);
    await updateDoc(mountRef, {
        totalCash: increment(Number(vouncherData.amount))
    });


}

function verifyPay(data, id) {
    verifyConectedUser().then((userData) => {
        if (data.payerEmail == userData.email) {
            getPayData(Number(data.paymentId)).then(response => {
                if (response.result.status == "cancelled") {
                    deletePay(id)
                }
                if (response.result.status == "approved") {
                    userPayed(userData, id, response, data)
                }                
            })
        }
    })
}