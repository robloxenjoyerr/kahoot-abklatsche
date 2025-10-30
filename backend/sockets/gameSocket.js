import fs from "fs"

const clients = new Map()


let nextClientID = 0
let activeGames = []

export default function registerGameSocket(io) {
    io.on("connection", (socket) => {
        
        socket.on("requestClientID", ()=>{
            const newClientID = nextClientID++
            clients[newClientID] = socket.id
            socket.clientID = newClientID

            socket.emit("assignClientID", { clientID: newClientID })
            console.log(`New Client ID generated: ${newClientID}`)
        })

        socket.on("registerClient", ({clientID})=>{
            clients[clientID] = socket.id
            socket.clientID = clientID
            console.log(`Client with ID ${clientID} and Socket ID ${socket.id} reconnected`)
        })

        socket.on("createGame", (data)=>{
            socket.emit("loadView", )
        })






        socket.on("joinGame", (data)=>{
            
        })
        
        socket.on("disconnect", (data)=>{
            
        })
        
        socket.on("startGame", (data)=>{

        })

        socket.on("nextQuestion", (data)=>{

        })
    })
}
