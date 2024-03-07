import { createError } from "./functions/error";
import { getMount, incrementMount } from "./functions/mountCash";
import { getCash, incrementCash } from "./functions/userCash";
import { verifyConectedUser } from "./functions/verifyConectedUser";

let oneCardSelected = false
let cardFlipSound = document.getElementById("cardFlipSound")
const cardsDiv = document.getElementById("cardsDiv")

function sortearNumeros() {
    let jokerNumber = Math.floor(Math.random() * 15) + 1;
    let aceNumber = Math.floor(Math.random() * 20) + 1;
    while (jokerNumber === aceNumber) {
        aceNumber = Math.floor(Math.random() * 10) + 1;
    }

    return [jokerNumber, aceNumber];
}

function selectCard(email, result) {
    oneCardSelected = true
    if (result == "lose") {
        setTimeout(() => {
            cardsDiv.style.transform = "translateY(100vh)"
            cardsDiv.style.gap = "0px"
            setTimeout(() => {
                randomCards()
                oneCardSelected = false
                cardsDiv.style.transform = "translateY(0vh)"
                cardsDiv.style.gap = "52px"
            }, 1000);
        }, 2000);
    }
    if (result == "joker") {
        getMount().then(mountCash => {
            let total = Number(mountCash) / 4
            incrementMount(-total)            
            incrementCash(email, total)
        })        
        setTimeout(() => {
            cardsDiv.style.transform = "translateY(100vh)"
            cardsDiv.style.gap = "0px"
            setTimeout(() => {
                randomCards()
                oneCardSelected = false
                cardsDiv.style.transform = "translateY(0vh)"
                cardsDiv.style.gap = "52px"
            }, 1000);
        }, 2000);
    }
    if (result == "ace") {
        getMount().then(mountCash => {
            let total = Number(mountCash) / 2
            incrementMount(-total)            
            incrementCash(email, total)
        })        
        setTimeout(() => {
            cardsDiv.style.transform = "translateY(100vh)"
            cardsDiv.style.gap = "0px"
            setTimeout(() => {
                randomCards()
                oneCardSelected = false
                cardsDiv.style.transform = "translateY(0vh)"
                cardsDiv.style.gap = "52px"
            }, 1000);
        }, 2000);
    }
}

function randomCards() {
    cardsDiv.innerHTML = ``
    const jokerAceNumber = sortearNumeros();
    for (let index = 0; index < 4; index++) {
        let thisCardNumber = index + 1
        let card = document.createElement("div")
        cardsDiv.insertAdjacentElement("beforeend", card)
        card.classList.add("gameCard")
        card.innerHTML = `
        <div class="innerCard">
            <div class="frontSide">      
                <span class="frontSide__spanTop">ONJOKER</span>
                <span class="frontSide__spanNumber">${thisCardNumber}</span>
                <span class="frontSide__spanBotton">ONJOKER</span>
            </div>
            <div class="backSide">                        
            </div>
        </div>
        `
        card.onclick = function () {
            verifyConectedUser().then((result) => {
                getCash(result.email).then((cash) => {
                    if (cash >= 1) {
                        if (oneCardSelected == false) {
                            incrementCash(result.email, -1)
                            cardFlipSound.currentTime = 0;
                            cardFlipSound.play()
                            card.children[0].style.transform = "rotateY(180deg)"
                            if (thisCardNumber != jokerAceNumber[0] && thisCardNumber != jokerAceNumber[1]) {
                                card.children[0].children[1].innerHTML = `
                                    <span class="frontSide__spanLoseTop">${thisCardNumber}</span>
                                    <span class="frontSide__spanLoseIcon"></span>
                                    <span class="frontSide__spanLoseBotton">${thisCardNumber}</span>`
                                selectCard(result.email, 'lose')
                            } else {
                                if (thisCardNumber == jokerAceNumber[0]) {
                                    card.children[0].children[1].innerHTML = `
                                    <span class="frontSide__spanJokerTop">JOKER</span>
                                    <span class="frontSide__spanJokerIcon"><img src="https://img.hotimg.com/jokerHat.jpeg" alt=""></span>
                                    <span class="frontSide__spanJokerBotton">JOKER</span>`
                                    selectCard(result.email, 'joker')
                                }
                                if (thisCardNumber == jokerAceNumber[1]) {
                                    card.children[0].children[1].innerHTML = `
                                    <span class="frontSide__spanAceTop"><i class="bi bi-suit-spade-fill"></i></span>
                                    <span class="frontSide__spanAceIcon"><i class="bi bi-suit-spade-fill"></i></span>
                                    <span class="frontSide__spanAceBotton"><i class="bi bi-suit-spade-fill"></i></span>`
                                    selectCard(result.email, 'ace')
                                }
                            }
                        }
                    } else {
                        createError("Recarregue para continuar", "error")
                    }
                })
            })
        }
    }
}
randomCards()