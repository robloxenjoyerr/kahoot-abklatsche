const clients = new Map()


let nextPlayerID = 1
const nextHostID = 0

export default function registerGameSocket(io) {
    io.on("connection", (socket) => {

        socket.on("joinHost", (data) => {

            const hostExists = [...clients.values()].some(c => c.role === "host");

            if (hostExists) {
                console.log(`ERROR: There is an Host already!`)
                socket.emit("hostJoinFailed", { message: "Host already exists" })
                return
            }


            let hostID = data.id ?? nextHostID

            clients.set(hostID, { socketID: socket.id, role: data.role })

            if (!data.id) {
                socket.emit("assignID", { id: hostID })
            }

            socket.emit("loadView", { view: "./host"})

            console.log(`${data.role} joined with hostID: ${data.id} and socketId: ${socket.id}`);
        })

        socket.on("joinGame", (data) => {
            let playerID = data.id ?? nextPlayerID++

            clients.set(playerID, { socketID: socket.id, role: data.role, score: 0 })

            if (!data.id) {
                socket.emit("assignID", { id: playerID })
            }

            console.log(`${data.role} joined with playerId: ${data.id} and socketId: ${socket.id}`);
        })

        socket.on("disconnect", () => {
            for (const { id, info } of clients.entries()) {
                if (info && info.socketID === socket.id) {
                    console.log(`Player ${id} (${info.role}) disconnected`)

                    info.socketID = null
                    break
                }
            }
        })
    })

}


// export function loadView(landingPage){
//     socket.emit("loadView", { view: landingPage})
// }



export function addScore(playerID, points) {
    const player = clients.get(playerID)

    player.score += points

    clients.set(playerID, player)
}


