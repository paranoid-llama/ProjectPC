function handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen) {
    const multiplePokemon = []
    const altForms = Object.keys(pokemon.info.alternateForm.name)
    if (pokename === 'Basculin') {
        altForms.map(form => {
            parsedGen === 9 ? 
            multiplePokemon.push(
                {
                    name: pokename + ' ' + `(${pokemon.info.alternateForm.name[form]})`,
                    nickname: '',
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    balls: ownedBallList
                }
            ) : 
            pokemon.info.alternateForm.name[form] === 'White-Striped' ? 
            null :
            multiplePokemon.push(
                {
                    name: pokename + ' ' + `(${pokemon.info.alternateForm.name[form]})`,
                    nickname: '',
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    balls: ownedBallList
                }
            ) 
        })
    } else if (pokename === 'Rockruff'){
        const balls = parsedGen <= 7 ? {
            fast: {isOwned: false, emCount: 0, EMs: []},
            friend: {isOwned: false, emCount: 0, EMs: []},
            heavy: {isOwned: false, emCount: 0, EMs: []},
            level: {isOwned: false, emCount: 0, EMs: []},
            love: {isOwned: false, emCount: 0, EMs: []},
            lure: {isOwned: false, emCount: 0, EMs: []},
            moon: {isOwned: false, emCount: 0, EMs: []},
            beast: {isOwned: false, emCount: 0, EMs: []},
        } : {
            fast: {isOwned: false, emCount: 0, EMs: []},
            friend: {isOwned: false, emCount: 0, EMs: []},
            heavy: {isOwned: false, emCount: 0, EMs: []},
            level: {isOwned: false, emCount: 0, EMs: []},
            love: {isOwned: false, emCount: 0, EMs: []},
            lure: {isOwned: false, emCount: 0, EMs: []},
            moon: {isOwned: false, emCount: 0, EMs: []},
            beast: {isOwned: false, emCount: 0, EMs: []},
            dream: {isOwned: false, emCount: 0, EMs: []},
            safari: {isOwned: false, emCount: 0, EMs: []},
            sport: {isOwned: false, emCount: 0, EMs: []}
        } 
        return {
            name: pokename + ' (Dusk)',
            nickname: '',
            natDexNum: pokemon.info.natDexNum,
            gen: pokemon.gen,
            balls: balls
        }
    } else {
        altForms.map(form => {
            parsedGen === 7 && pokename === 'Flabébé' ? 
            multiplePokemon.push(
                {
                    name: pokename + ' ' + `(${pokemon.info.alternateForm.name[form]})`,
                    nickname: '',
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    balls: pokemon.info.alternateForm.name[form] === 'Blue' ? 
                        {
                            fast: {isOwned: false, emCount: 0, EMs: []},
                            friend: {isOwned: false, emCount: 0, EMs: []},
                            heavy: {isOwned: false, emCount: 0, EMs: []},
                            level: {isOwned: false, emCount: 0, EMs: []},
                            love: {isOwned: false, emCount: 0, EMs: []},
                            lure: {isOwned: false, emCount: 0, EMs: []},
                            moon: {isOwned: false, emCount: 0, EMs: []},
                            beast: {isOwned: false, emCount: 0, EMs: []},
                        } :
                        ownedBallList
                }
            ) :
            multiplePokemon.push(
                {
                    name: pokename + ' ' + `(${pokemon.info.alternateForm.name[form]})`,
                    nickname: '',
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    balls: ownedBallList
                }
            )
        })
    }
    return multiplePokemon
}

function setBallInfo(pokemon, genKey) {
    const hasHA = pokemon.info.HA.hasHA
    const hasEMs = pokemon.specificGenInfo[genKey].eggmoves ? true : false
    if (hasHA === false && hasEMs === false) {
        return {isOwned: false}
    } else if (hasHA === true && hasEMs === false) {
        return {isOwned: false, isHA: false}
    } else if (hasHA === false && hasEMs === true) {
        return {isOwned: false, emCount: 0, EMs: []}
    } else {
        return {isOwned: false, isHA: false, emCount: 0, EMs: []}
    }
}

module.exports = {handleAlternateForms, setBallInfo}