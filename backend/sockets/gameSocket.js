
import loadExistingGames from "../../frontend/public/js/functions.js"

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




        socket.on("requestGamesData", ()=>{

            console.log("Request for Game Data is here")
            socket.emit("sendGameData", { gamesData: loadExistingGames()})
        })




        
        socket.on("createGame", (data)=>{

            socket.emit("loadView", { view: data.view, games: loadExistingGames()})

            // window.location.href = "/host."
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
