document.cookie = "secureCookie=1; SameSite=None; Secure";

import { createError } from "./functions/error"
import { firebaseConfig } from "./functions/firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { verifyConectedUser } from "./functions/verifyConectedUser";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
let openMoreDiv = false
let perfilDiv = document.getElementById("perfilDiv")
let perfilBtn = document.getElementById("perfilBtn")
let perfilMoreDiv = document.getElementById("perfilMoreDiv")
let loginBtn = document.getElementById("loginBtn")
let body = document.querySelector("body")
body.onclick = function () {
    if (openMoreDiv == true) {
        perfilMoreDiv.innerHTML = ``
        openMoreDiv = false
    }
}

function isLogged() {
    perfilDiv.style.display = "flex"
    loginBtn.style.display = "none"
    loginBtn.onclick = function () { }
}

function isNotLogged() {
    perfilDiv.style.display = "none"
    loginBtn.style.display = "flex"
    perfilBtn.children[0].src = ``
    perfilMoreDiv.onclick = function () { }
    loginBtn.onclick = function () {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                initLogin()
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }
}

function initLogin() {
    verifyConectedUser().then((result) => {
        if (result == 'User is signed out') {
            isNotLogged()
            signInWithPopup(auth, provider)
                .then((result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const user = result.user;
                    initLogin()
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.customData.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                });
        } else {
            isLogged()
            perfilBtn.children[0].src = `${result.photoURL}`
            perfilDiv.onclick = function (event) {
                event.stopPropagation()
                if (openMoreDiv == false) {
                    let buttonAccounts = document.createElement("button")
                    let buttonExit = document.createElement("button")
                    perfilMoreDiv.insertAdjacentElement("beforeend", buttonAccounts)
                    perfilMoreDiv.insertAdjacentElement("beforeend", buttonExit)
                    buttonAccounts.classList.add("perfilDiv__btn")
                    buttonExit.classList.add("perfilDiv__btn")
                    buttonExit.classList.add("red")
                    buttonExit.innerHTML = `<ion-icon name="exit-outline"></ion-icon>Sair`
                    buttonAccounts.innerHTML = `<ion-icon name="people-outline"></ion-icon>Trocar conta`
                    buttonExit.onclick = function () {
                        signOut(auth).then(() => {
                            isNotLogged()
                        }).catch((error) => {
                            console.log("erro ao sair");
                        });
                    }
                    buttonAccounts.onclick = function () {
                        signInWithPopup(auth, provider)
                            .then((result) => {
                                const credential = GoogleAuthProvider.credentialFromResult(result);
                                const token = credential.accessToken;
                                const user = result.user;
                                initLogin()
                            }).catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                const email = error.customData.email;
                                const credential = GoogleAuthProvider.credentialFromError(error);
                            });
                    }
                    openMoreDiv = true
                }
            }
        }
    })
}

fetch('https://mercadopago-api-rest.vercel.app/api/createpay')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao recuperar os dados da API: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Ocorreu um erro:', error);
    });



initLogin()