import fs from "fs"


export default function loadExistingGames(){
    console.log("loading...")
    const games = JSON.parse(fs.readFileSync("./game_sets.json"))
    
    return games
}