export default function loadExistingGames(gamesJson){
    const games = JSON.parse(gamesJson)
    const root = document.querySelector(".existing-games-container")

    for(let game in games){
        const gameBox = document.createElement("div")
        gameBox.innerText = game.gameName

        root.appendChild(gameBox)
    }
    
}