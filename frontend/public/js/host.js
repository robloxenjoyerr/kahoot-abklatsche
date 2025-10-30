const socket = io()

console.log("Arsch")

socket.on("loadView", (data)=>{
    
    console.log(data.games)
    
})

