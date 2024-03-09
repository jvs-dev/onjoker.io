import { firebaseConfig } from "./functions/firebaseConfig"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, setDoc, addDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createError } from "./functions/error"
import { getUserDoc, getUserDocById, updateUserInvite } from "./functions/userData"
import { verifyConectedUser } from "./functions/verifyConectedUser"
import { incrementCash } from "./functions/userCash";
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const db = getFirestore(app);

let inviteBtn = document.getElementById("inviteBtn")
let inviteSection = document.getElementById("inviteSection")
let confirmInvite = document.getElementById("confirmInvite")
let inviteSectionCopyIcon = document.getElementById("inviteSectionCopyIcon")
let inviteSectionMyInviteCode = document.getElementById("inviteSectionMyInviteCode")

inviteBtn.onclick = function () {
    verifyConectedUser().then(actualUser => {
        if (actualUser != 'User is signed out') {
            getUserDoc(actualUser.email).then(userDoc => {
                inviteSectionMyInviteCode.textContent = `${userDoc.data().inviteCode}`
                inviteSection.style.display = "flex"
                setTimeout(() => {
                    inviteSection.style.opacity = "1"
                }, 1);
            })
        } else {
            createError('Faça login para continuar', 'error')
        }
    })
}

inviteSectionCopyIcon.onclick = function () {
    let temporaryInput = document.createElement('textarea');
    temporaryInput.value = inviteSectionMyInviteCode.textContent;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand('copy');
    document.body.removeChild(temporaryInput);
    inviteSectionCopyIcon.name = "checkmark-circle-outline"
    inviteSectionCopyIcon.style.color = "var(--joker-green)"
    setTimeout(() => {
        inviteSectionCopyIcon.name = "copy-outline"
        inviteSectionCopyIcon.style.color = ""
    }, 2000);
}

confirmInvite.onclick = function () {
    verifyConectedUser().then(actualUser => {
        if (actualUser != 'User is signed out') {
            let inviteSectionInviteCode = document.getElementById("inviteSectionInviteCode").value
            if (inviteSectionInviteCode != "") {
                getUserDoc(actualUser.email).then(actualUserStoreData => {
                    if (actualUserStoreData.data().invited == false) {
                        getUserDocById(inviteSectionInviteCode).then(result => {
                            if (result != 'account is not exists') {
                                if (result.email != actualUser.email) {
                                    updateUserInvite(actualUserStoreData.id)
                                    if (actualUserStoreData.data().cash <= 15) {
                                        incrementCash(actualUser.email, 2)
                                    }
                                    if (result.cash <= 15) {
                                        incrementCash(result.email, 2)
                                    }
                                    inviteSection.style.opacity = "0"
                                    setTimeout(() => {
                                        inviteSection.style.display = "none"
                                        document.getElementById("inviteSectionInviteCode").value = ""
                                    }, 200);
                                } else {
                                    createError('Você não pode se convidar', 'error')
                                }

                            } else {
                                createError('Código não registrado', 'error')
                            }
                        })
                    } else {
                        createError('Você já foi convidado', 'error')
                    }
                })
            } else {
                inviteSection.style.opacity = "0"
                setTimeout(() => {
                    inviteSection.style.display = "none"
                }, 200);
            }
        } else {
            createError('Faça login para continuar', 'error')
        }
    })
}