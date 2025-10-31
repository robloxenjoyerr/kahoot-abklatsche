
import loadExistingGames from "../../frontend/public/js/functions.js"

const clients = new Map()


let nextClientID = 0
let activeGames = []

export default function registerGameSocket(io) {
    io.on("connection", (socket) => {
        
        // When a client has no ID, server gets a request to make one
        socket.on("requestClientID", ()=>{
            const newClientID = nextClientID++
            clients[newClientID] = socket.id
            socket.clientID = newClientID

            socket.emit("assignClientID", { clientID: newClientID })
            console.log(`New Client ID generated: ${newClientID}`)
        })

        // When a client has an ID, he sends it to the server so it can register him with the new socket id
        socket.on("registerClient", ({clientID})=>{
            clients[clientID] = socket.id
            socket.clientID = clientID
            console.log(`Client with ID ${clientID} and Socket ID ${socket.id} reconnected`)
        })

        // When a client needs the available game sets, he sends a request to the server here, server responds with all gamesets
        socket.on("requestGamesData", ()=>{
            socket.emit("sendGameData", { gamesData: loadExistingGames()})
        })

        socket.on("beHost", (data)=>{
            socket.emit("loadView", { view: data.view, games: loadExistingGames()})
        })

        
        socket.on("createNewQuestion", (data)=>{
            
        })

        socket.on("createNewGameSet", (data)=>{
            
        })



        socket.on("startGame", (data)=>{
            console.log("start game ", data.gameSetIndex)
        })

        socket.on("joinGame", (data)=>{
            
        })
        
        socket.on("disconnect", (data)=>{
            
        })
        

        socket.on("nextQuestion", (data)=>{

        })
    })
}
