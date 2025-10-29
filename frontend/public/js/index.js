const socket = io()
let clientID = localStorage.getItem("playerID")


socket.on("assignID", (data)=>{
    localStorage.setItem("playerID", data.id)
    clientID = data.id
    console.log("Neue Spieler-ID erhalten:", clientID);
})

socket.on("hostJoinFailed", ()=>{
    alert("Error: There is a Host already")
})

socket.on("loadView", (data)=>{
    window.location.href = data.view
})

const buttons = document.querySelectorAll("button")

buttons[0].addEventListener("click", ()=>{
    socket.emit("joinHost", { id: clientID, role: "host"})
})

buttons[1].addEventListener("click", ()=>{
    socket.emit("joinGame", { id: clientID, role: "player"})
})