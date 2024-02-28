const cardsDiv = document.getElementById("cardsDiv")
function sortearNumeros() {
    let jokerNumber = Math.floor(Math.random() * 8) + 1;
    let aceNumber = Math.floor(Math.random() * 8) + 1;
    while (jokerNumber === aceNumber) {
        aceNumber = Math.floor(Math.random() * 8) + 1;
    }

    return [jokerNumber, aceNumber];
}

function randomCards() {
    const jokerAceNumber = sortearNumeros();
    for (let index = 0; index < 8; index++) {
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
            card.children[0].style.transform = "rotateY(180deg)"
            if (thisCardNumber != jokerAceNumber[0] && thisCardNumber != jokerAceNumber[1]) {
                card.children[0].children[1].innerHTML = `
                    <span class="frontSide__spanLoseTop">${thisCardNumber}</span>
                    <span class="frontSide__spanLoseIcon"></span>
                    <span class="frontSide__spanLoseBotton">${thisCardNumber}</span>`
            } else {
                if (thisCardNumber == jokerAceNumber[0]) {
                    card.children[0].children[1].innerHTML = `
                    <span class="frontSide__spanJokerTop">JOKER</span>
                    <span class="frontSide__spanJokerIcon"><img src="src/assets/jokerHat.jpg" alt=""></span>
                    <span class="frontSide__spanJokerBotton">JOKER</span>`
                }
                if (thisCardNumber == jokerAceNumber[1]) {
                    card.children[0].children[1].innerHTML = `
                    <span class="frontSide__spanAceTop"><i class="bi bi-suit-spade-fill"></i></span>
                    <span class="frontSide__spanAceIcon"><i class="bi bi-suit-spade-fill"></i></span>
                    <span class="frontSide__spanAceBotton"><i class="bi bi-suit-spade-fill"></i></span>`                    
                }
            }
        }
    }
}
randomCards()