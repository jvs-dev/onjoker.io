let rulePage = 1
let rulesBtn = document.getElementById("rulesBtn")
let rulesSection = document.getElementById("rulesSection")
let continueRules = document.getElementById("continueRules")
let rulesText1 = document.getElementById("rulesText1")
let rulesText2 = document.getElementById("rulesText2")
let rulesDemo = document.getElementById("rulesDemo")
rulesBtn.onclick = function () {
    rulesText1.textContent = "DENTRE AS 4 CARTAS PRESENTES NO JOGO UMA DELAS É O ÁS E A OUTRA O CORINGA"
    rulesText2.textContent = "SELECIONAR QUALQUER CARTA QUE NÂO SEJA UMA DAS CITADAS ACIMA RESULTARÁ EM FALHA"
    rulesDemo.innerHTML = `
            <span class="rulesSection__demo__fail">FAIL <ion-icon name="arrow-forward-outline"></ion-icon></span>
            <div class="gameCard">
                <div class="innerCard">
                <div class="frontSide">
                    <span class="frontSide__spanTop">ONJOKER</span>
                    <span class="frontSide__spanNumber">1</span>
                    <span class="frontSide__spanBotton">ONJOKER</span>
                </div>
                <div class="backSide">
                    <span class="frontSide__spanLoseTop">1</span>
                    <span class="frontSide__spanLoseIcon"></span>
                    <span class="frontSide__spanLoseBotton">1</span>
                </div>
                </div>
            </div>`
    rulesSection.style.display = "flex"
    setTimeout(() => {
        rulesSection.style.opacity = "1"
    }, 1);
}

continueRules.onclick = function () {
    if (rulePage == 1) {
        rulesText1.textContent = "CASO VOCÊ TIRE A CARTA CORINGA(JOKER) VOCÊ GANHARÁ 50% DO VALOR TOTAL DE APOSTAS GERAL"
        rulesText2.textContent = "O VALOR PODE VARIAR ENTRE R$10 ATÉ R$100"
        rulesDemo.innerHTML = `        
            <div class="gameCard">
                <div class="innerCard">
                <div class="frontSide">
                    <span class="frontSide__spanTop">ONJOKER</span>
                    <span class="frontSide__spanNumber">1</span>
                    <span class="frontSide__spanBotton">ONJOKER</span>
                </div>
                <div class="backSide">
                <span class="frontSide__spanJokerTop">JOKER</span>
                <span class="frontSide__spanJokerIcon"><img src="https://img.hotimg.com/jokerHat.jpeg" alt=""></span>
                <span class="frontSide__spanJokerBotton">JOKER</span>
                </div>
                </div>
            </div>`
        rulePage++
    } else if (rulePage == 2) {
        rulesText1.textContent = "CASO VOCÊ TIRE A CARTA ÁS(ÁS DE ESPADAS) VOCÊ GANHARÁ 100% DO VALOR TOTAL DE APOSTAS GERAL"
        rulesText2.textContent = "O VALOR PODE VARIAR ENTRE R$20 ATÉ R$9999..."
        rulesDemo.innerHTML = `
            <div class="gameCard">
                    <div class="innerCard">
                    <div class="frontSide">
                        <span class="frontSide__spanTop">ONJOKER</span>
                        <span class="frontSide__spanNumber">1</span>
                        <span class="frontSide__spanBotton">ONJOKER</span>
                    </div>
                    <div class="backSide">
                    <span class="frontSide__spanAceTop"><i class="bi bi-suit-spade-fill"></i></span>
                    <span class="frontSide__spanAceIcon"><i class="bi bi-suit-spade-fill"></i></span>
                    <span class="frontSide__spanAceBotton"><i class="bi bi-suit-spade-fill"></i></span>
                    </div>
                    </div>
                </div>`
        continueRules.textContent = "CONFIRMAR"
        rulePage++
    } else if (rulePage == 3) {
        rulesSection.style.opacity = "0"
        setTimeout(() => {
            rulesSection.style.display = "none"
            continueRules.textContent = "CONTINUAR"
            rulesText1.textContent = "DENTRE AS 4 CARTAS PRESENTES NO JOGO UMA DELAS É O ÁS E A OUTRA O CORINGA"
            rulesText2.textContent = "SELECIONAR QUALQUER CARTA QUE NÂO SEJA UMA DAS CITADAS ACIMA RESULTARÁ EM FALHA"
            rulesDemo.innerHTML = `
            <span class="rulesSection__demo__fail">FAIL <ion-icon name="arrow-forward-outline"></ion-icon></span>
            <div class="gameCard">
                <div class="innerCard">
                <div class="frontSide">
                    <span class="frontSide__spanTop">ONJOKER</span>
                    <span class="frontSide__spanNumber">1</span>
                    <span class="frontSide__spanBotton">ONJOKER</span>
                </div>
                <div class="backSide">
                    <span class="frontSide__spanLoseTop">1</span>
                    <span class="frontSide__spanLoseIcon"></span>
                    <span class="frontSide__spanLoseBotton">1</span>
                </div>
                </div>
            </div>`
        }, 200);
        rulePage = 1
    }
}