const socket = io()

const selectGameContent = document.querySelector(".dashboard-container")
const createGameContent = document.querySelector(".create-game-container")


// Every Refresh of the Website 
socket.on("connect", () => {
    console.log("Connected with Socket: ", socket.id)



    // if no id in localstorage, request new id from server
    if (!localStorage.getItem("clientID")) {
        socket.emit("requestClientID")
    }
    else {
        // if there is an id in localstorage, send this to ID to server to get registered on the server with the current socketid
        const clientID = localStorage.getItem("clientID")
        socket.emit("registerClient", { clientID })
    }

    //send request for all game sets to server
    socket.emit("requestGamesData")
    console.log("Requested Game Data from Server")
})

//if there is no current clientID, server sends new ID, then store it in localstorage 
socket.on("assignClientID", (data) => {
    console.log("Server assigned you a new ID:", data.clientID)
    localStorage.setItem("clientID", data.clientID)
})


// Get get available game sets and create buttons to choose on Page
const gamesContainer = document.querySelector(".game-list")
let currentSelectedGame = 0
const selectedGameText = document.querySelector(".selected-game-set-text")

socket.on("sendGameData", (data) => {
    const games = data.gamesData

    for (let i = 0; i < games.length; i++) {
        const selectbtn = document.createElement("button")

        selectbtn.className = "gamesbutton"
        selectbtn.innerText = games[i].gameName

        selectbtn.addEventListener("click", () => {
            currentSelectedGame = i
            console.log("Selected Game Button: " + i)
            selectedGameText.textContent = games[i].gameName
        })

        gamesContainer.appendChild(selectbtn)
    }
})



// When Clicked on StartGame, send the current selected gameSetIndex to server
const hostGameBtn = document.querySelector(".host-game-button")

hostGameBtn.addEventListener("click", (e) => {
    if (selectedGameText.textContent) {
        socket.emit("startGame", { gameSetIndex: currentSelectedGame })
    }
})

/* =========================
   Dashboard Container
   ========================= */

const createNewGameSetBtn = document.querySelector(".create-new-gameset")

createNewGameSetBtn.addEventListener("click", () => {
    createGameContent.style.display = "flex"
    selectGameContent.style.display = "none"
})

const backToStartPageBtn = document.querySelector(".back-start-button")

backToStartPageBtn.addEventListener("click", () => {
    console.log("Back Start")
    window.location.href = "./index.html"
})

/* =========================
   Create New Game Site
   ========================= */
const questionSettingInputs = document.querySelectorAll(".question-settings-container input")
const answerInputs = document.querySelectorAll(".answer-container .answer_input")
const addQuestionBtn = document.querySelector(".create-question-button")
const correctCheckboxBtns = document.querySelectorAll(".answers-container .checkbox")
const questionsList = document.querySelector(".questions-container .questions-list")
const questionsContainer = document.querySelector(".questions-container")

let questionIndexCounter = 0

//add question logic
addQuestionBtn.addEventListener("click", () => {
    let allValid = true
    const answersArr = []

   

    // check if settings inputs are empty and make border red 
    questionSettingInputs.forEach(element => {
        if (element.value === "") {
            element.style.border = "solid 1px red"
            allValid = false
        }
        else { element.style.border = "1px solid #ccc" }
    });

    //check if required answer inputs are empty and make red, if not check if answer value empty and push into answers array
    answerInputs.forEach((element, index) => {
        if (element.required && element.value === "") {
            element.style.border = "solid 1px red"
            allValid = false
        }
        else {
            element.style.border = "1px solid #ccc"
            if (element.value !== "") {
                answersArr.push({ id: index, text: element.value, correct: correctCheckboxBtns[index].checked })
            }
        }
    })



    //when everythng is valid, send question to server, clear every input
    if (allValid) {

        const data = {
            question: questionSettingInputs[0].value,
            timeLimit: questionSettingInputs[1].value,
            points: questionSettingInputs[2].value,
            answers: answersArr
        }
        console.log(data)

        socket.emit("createNewQuestion", { data } )

        //add question to questions list 
        const questionBox = document.createElement("div")
        questionBox.className = "qu"
        questionBox.id = questionIndexCounter++
        questionBox.textContent = questionSettingInputs[0].value

        questionsList.appendChild(questionBox)
        resetAll()
    }
})

// Create the Game Template 
const createGameTemplateBtn = document.querySelector(".create-game-template-button")
const cont = questionsList.ch

createGameTemplateBtn.addEventListener("click", ()=>{
    console.log(questionsList)
    if(questionsList.children.length <= 0){
        questionsContainer.style.border = "solid 1px red"
    }
    else{
        questionsContainer.style.border = "solid 1px green"
    }
})


// Go back to Host Dashboard
const backToHostBtn = document.querySelector(".back-dashboard-button")

backToHostBtn.addEventListener("click", () => {
    createGameContent.style.display = "none"
    selectGameContent.style.display = "flex"
})

//reset all inputs 
function resetAll() {
    const allInputs = document.querySelectorAll(".right-side-container input")

    allInputs.forEach(element => {
        element.value = ""
    });
    correctCheckboxBtns.forEach(element => {
        element.checked = false
    })
}