export default function getDefaultData(globalDefault, ballDefault, pokemonBallData, maxEMs, possibleEMs, addedBall) {
    //maxEMs and possibleEMs are used for if the globaldefault is, say, 4EMCount, and the pokemon only has 3 ems, in order to correct it as well as
    //set the EM field if it's max.
    const addedBallData = pokemonBallData[addedBall]
    const ballDefaultData = pokemonBallData[ballDefault]
    const noBallDefault = ballDefault === 'none'
    if (!noBallDefault) {
        const specificPokemonData = {}
        if (addedBallData.isHA !== undefined) {
            specificPokemonData.isHA = ballDefaultData.isHA
        }
        if (addedBallData.emCount !== undefined) {
            specificPokemonData.emCount = ballDefaultData.emCount
            specificPokemonData.EMs = ballDefaultData.EMs
        }
        return specificPokemonData
    } else if (noBallDefault) { //ball defaults (which are essentially pokemon specific defaults) override global defaults, which means this if happens AFTER
        const specificPokemonData = {}
        if (globalDefault.isHA === true && addedBallData.isHA !== undefined) {
            specificPokemonData.isHA = true
        }
        if (globalDefault.emCount !== 0 && addedBallData.emCount !== undefined) {
        const numOfPossibleEMs = possibleEMs.length
            if ((numOfPossibleEMs <= 4) && (globalDefault.emCount >= numOfPossibleEMs)) {
                specificPokemonData.emCount = maxEMs
                specificPokemonData.EMs = possibleEMs
            } else {
                specificPokemonData.emCount = globalDefault.emCount
            }
        }
        return specificPokemonData
    } 
}