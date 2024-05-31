import { genGames } from "../../../common/infoconstants/miscconstants.mjs"

const getGenNum = (genStr) => {
    const isGameGenStr = isNaN(parseInt(genStr))
    const gen = isGameGenStr ? genGames.filter((genGame) => {
        let isGame = false
        genGame.games.forEach(gameName => {
            if (gameName === genStr) {
                isGame = true
            }
        })
        return isGame
    }).map(genGame => genGame.gen)[0] : parseInt(genStr)
    return gen
}

export {getGenNum}