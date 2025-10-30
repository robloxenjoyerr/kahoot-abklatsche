
export function getGamesJson(){
    const gamesJson = JSON.parse(fs.readFileSync("games.json"))
    return gamesJson
}

export function addScore(playerID, points) {
    const player = clients.get(playerID)

    player.score += points

    clients.set(playerID, player)
}