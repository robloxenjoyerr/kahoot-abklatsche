const socket = io()
let clientID = localStorage.getItem("playerID")


socket.on("assignID", (data)=>{
    localStorage.setItem("clientID", data.id)
    clientID = data.id
    console.log("New Client-ID assigned:", clientID);
})

socket.on("hostJoinFailed", (data)=>{
    alert(data.message)
    console.log(`Error: ${data.message}`)
})

socket.on("loadView", (data)=>{
    window.location.href = data.view
})




const buttons = document.querySelectorAll("button")

buttons[0].addEventListener("click", ()=>{
    if(localStorage.getItem("clientID") != 0){
        socket.emit("joinHost", { id: clientID, role: "host"})
    }
})

buttons[1].addEventListener("click", ()=>{
    socket.emit("joinGame", { id: clientID, role: "player"})
})