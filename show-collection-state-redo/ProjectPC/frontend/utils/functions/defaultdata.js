export default function getDefaultData(globalDefault, ballDefault, pokemonBallData, maxEMs, possibleEMs) {
    //maxEMs and possibleEMs are used for if the globaldefault is, say, 4EMCount, and the pokemon only has 3 ems, in order to correct it as well as
    //set the EM field if it's max.
    const randomBallData = Object.values(pokemonBallData)[0]
    const ballDefaultData = pokemonBallData[ballDefault]
    if (ballDefault === 'none' && globalDefault === 'none') {
        return {}
    } else if (ballDefault === 'none' && globalDefault !== 'none') { //ball defaults (which are essentially pokemon specific defaults) override global defaults
        const specificPokemonData = {}
        if (globalDefault.isHA === true && randomBallData.isHA !== undefined) {
            specificPokemonData.isHA = true
        }
        if (globalDefault.emCount !== 0 && randomBallData.emCount !== undefined) {
            if ((maxEMs <= 4) && (globalDefault.emCount >= maxEMs)) {
                specificPokemonData.emCount = maxEMs
                specificPokemonData.EMs = possibleEMs
            } else {
                specificPokemonData.emCount = globalDefault.emCount
            }
        }
        return specificPokemonData
    } else if (ballDefault !== 'none') {
        const specificPokemonData = {}
        if (ballDefaultData.isHA !== undefined) {
            specificPokemonData.isHA = ballDefaultData.isHA
        }
        if (ballDefaultData.emCount !== undefined) {
            specificPokemonData.emCount = ballDefaultData.emCount
            specificPokemonData.EMs = ballDefaultData.EMs
        }
        return specificPokemonData
    }
}