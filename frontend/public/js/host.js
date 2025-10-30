
const socket = io()

socket.on("connect", ()=>{
    console.log("Connected with Socket: ", socket.id)

    if(!localStorage.getItem("clientID")){
        socket.emit("requestClientID")
    }
    else{
        const clientID = localStorage.getItem("clientID")
        socket.emit("registerClient", { clientID })
    }

    socket.emit("requestGamesData")
    console.log("Requested Game Data from Server")
})

socket.on("assignClientID", (data)=>{
    console.log("Server assigned you a new ID:", data.clientID)
    localStorage.setItem("clientID", data.clientID)
})


const gamesContainer = document.querySelector(".games-container")

socket.on("sendGameData", (data)=>{
    console.log("Game Data is here")
    console.log(data.gamesData.length)

    const games = data.gamesData
    const root = document.querySelector(".games-container")

    for(let i=0; i< games.length; i++){
        const selectbtn = document.createElement("button")

        selectbtn.className = "gamesbutton"
        selectbtn.innerText = games[i].gameName
        root.appendChild(selectbtn)
    }
})






const buttons = document.querySelectorAll("button")

buttons[0].addEventListener("click", (e)=>{
    // socket.emit("createNewGame")
})