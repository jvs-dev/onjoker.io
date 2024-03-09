import { firebaseConfig } from "./functions/firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createError } from "./functions/error"
import { verifyConectedUser } from "./functions/verifyConectedUser"
import QRCode from 'qrcode';
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

let prices = [1, 2, 5, 10, 15, 20]
let priceSelected = prices[0]
let closeRechargeSection = document.getElementById("closeRechargeSection")
let rechargeSection = document.getElementById("rechargeSection")
let rechargeBtn = document.getElementById("rechargeBtn")
let confirmPayValue = document.getElementById("confirmPayValue")
let paySection = document.getElementById("paySection")
let confirmPay = document.getElementById("confirmPay")
let payCode = document.getElementById("payCode")
let payQrCodeImg = document.getElementById("payQrCodeImg")

rechargeBtn.onclick = function () {
    rechargeSection.style.display = "flex"
    setTimeout(() => {
        rechargeSection.style.opacity = "1"
    }, 1);
}

closeRechargeSection.onclick = function () {
    rechargeSection.style.opacity = "0"
    setTimeout(() => {
        rechargeSection.style.display = "none"
    }, 200);
}

confirmPay.onclick = function () {
    paySection.style.opacity = "0"
    setTimeout(() => {
        paySection.style.display = "none"
        payCode.textContent = ``
        payQrCodeImg.src = ``
    }, 200);
}

async function generateQRCode(text) {
    return new Promise(async (resolve) => {
        try {
            const qrCodeImage = await QRCode.toDataURL(text);
            resolve(qrCodeImage)
        } catch (error) {
            resolve('error')
        }
    })
}

async function createPay(email, value) {
    return new Promise(resolve => {
        let requestBody = {
            payerEmail: `${email}`,
            value: `${value}`
        };
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        fetch('https://mercadopago-api-rest.vercel.app/api/createpay', requestOptions)
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

function loadPrices() {
    let rechargePricesDiv = document.getElementById("rechargePricesDiv")
    rechargePricesDiv.innerHTML = ``
    prices.forEach(element => {
        let btn = document.createElement("button")
        rechargePricesDiv.insertAdjacentElement("beforeend", btn)
        btn.classList.add("rechargeSection__selectPrice")
        btn.textContent = `$${element}`
        if (element == prices[0]) {
            btn.classList.add("selected")
        }
        if (element == prices[prices.length - 1]) {
            btn.classList.add("promo")
        }
        btn.onclick = function () {
            let selectPriceBtns = document.querySelectorAll(".rechargeSection__selectPrice")
            selectPriceBtns.forEach(desactiveBtn => {
                desactiveBtn.classList.remove("selected")
            });
            btn.classList.add("selected")
            priceSelected = element
        }
    });
}

confirmPayValue.onclick = function () {
    rechargeSection.style.opacity = "0"
    verifyConectedUser().then((userData) => {
        if (userData != 'User is signed out') {
            createPay(`${userData.email}`, priceSelected).then(async (data) => {
                if (data.result.point_of_interaction != undefined) {
                    let copyCodeBtn = document.getElementById("copyCodeBtn")
                    rechargeSection.style.display = "none"
                    paySection.style.opacity = "1"
                    paySection.style.display = "flex"
                    payCode.textContent = `${data.result.point_of_interaction.transaction_data.qr_code}`
                    copyCodeBtn.onclick = function () {                          
                        let temporaryInput = document.createElement('textarea');                    
                        temporaryInput.value = payCode.textContent;                      
                        document.body.appendChild(temporaryInput);                    
                        temporaryInput.select();
                        document.execCommand('copy');                    
                        document.body.removeChild(temporaryInput);   
                        copyCodeBtn.name = "checkmark-circle-outline"                                                     
                        copyCodeBtn.style.color = "var(--joker-green)"
                        setTimeout(() => {
                            copyCodeBtn.name = "copy-outline"
                            copyCodeBtn.style.color = ""
                        }, 2000);
                    }
                    generateQRCode(data.result.point_of_interaction.transaction_data.qr_code).then((qrCodeLink) => {
                        payQrCodeImg.src = `${qrCodeLink}`
                    })
                    const docRef = await addDoc(collection(db, "payments"), {
                        payerEmail: `${userData.email}`,
                        paymentId: `${data.result.id}`,
                        status: `${data.result.status}`,
                        amount: `${data.result.transaction_amount}`
                    });
                } else {                    
                    createError('Ocorreu um erro na transação', 'error')
                    paySection.style.opacity = "0"
                    setTimeout(() => {
                        paySection.style.display = "none"
                        rechargeSection.style.display = "none"
                    }, 200);
                }
            })
        } else {
            createError('Faça login para recarregar', 'error')
            paySection.style.opacity = "0"
                    setTimeout(() => {
                        paySection.style.display = "none"
                        rechargeSection.style.display = "none"
                    }, 200);
        }
    })
}

loadPrices()