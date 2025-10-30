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
})

socket.on("assignClientID", (data)=>{
    console.log("Server assigned you a new ID:", data.clientID)
    localStorage.setItem("clientID", data.clientID)

})

socket.on("loadView", (data)=>{
    window.location.href = data.view
})


const buttons = document.querySelectorAll("button")

buttons[0].addEventListener("click", ()=>{
    socket.emit("beHost", { view: "./host.html"})
})

buttons[1].addEventListener("click", ()=>{
    
})