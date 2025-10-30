const socket = io()

const selectGameContent = document.querySelector(".dashboard-container")
const createGameContent = document.querySelector(".create-game-container")


// Every Refresh of the Website 
socket.on("connect", ()=>{
    console.log("Connected with Socket: ", socket.id)

   

    // if no id in localstorage, request new id from server
    if(!localStorage.getItem("clientID")){
        socket.emit("requestClientID")
    }
    else{ 
        // if there is an id in localstorage, send this to ID to server to get registered on the server with the current socketid
        const clientID = localStorage.getItem("clientID")
        socket.emit("registerClient", { clientID })
    }

    //send request for all game sets to server
    socket.emit("requestGamesData")
    console.log("Requested Game Data from Server")
})

//if there is no current clientID, server sends new ID, then store it in localstorage 
socket.on("assignClientID", (data)=>{
    console.log("Server assigned you a new ID:", data.clientID)
    localStorage.setItem("clientID", data.clientID)
})


// Get get available game sets and create buttons to choose on Page
const gamesContainer = document.querySelector(".game-list")
let currentSelectedGame = 0
const selectedGameText = document.querySelector(".selected-game-set-text")

socket.on("sendGameData", (data)=>{
    const games = data.gamesData

    for(let i=0; i< games.length; i++){
        const selectbtn = document.createElement("button")

        selectbtn.className = "gamesbutton"
        selectbtn.innerText = games[i].gameName
        
        selectbtn.addEventListener("click", ()=>{
            currentSelectedGame = i
            console.log("Selected Game Button: "+i)
            selectedGameText.textContent = games[i].gameName
        })

        gamesContainer.appendChild(selectbtn) 
    }
})

// When Clicked on StartGame, send the current selected gameSetIndex to server
const hostGameBtn = document.querySelector(".host-game-button")

hostGameBtn.addEventListener("click", (e)=>{
    if(selectedGameText.textContent){
        socket.emit("startGame", { gameSetIndex: currentSelectedGame})
    }
})


const createNewGameSetBtn = document.querySelector(".create-new-gameset")

createNewGameSetBtn.addEventListener("click", ()=>{
    createGameContent.style.display = "flex"
    selectGameContent.style.display = "none"
})

const backToHostBtn = document.querySelector(".back-button")

backToHostBtn.addEventListener("click", ()=>{
    createGameContent.style.display = "none"
    selectGameContent.style.display = "flex"
})


const backToStartBtn = document.querySelector(".back-start-button")

backToStartBtn.addEventListener("click", ()=>{
    console.log("Back Start")
    window.location.href = "./index.html"
})