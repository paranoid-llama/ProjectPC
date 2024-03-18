const {apriballLiterals, specialBalls, uniqueAlternateFormPokemon, uniqueRegionalFormPokemon} = require('./../../infoconstants.js')

function handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen) {
    const multiplePokemon = []
    const altForms = Object.keys(pokemon.info.alternateForm.name)
    if (uniqueAlternateFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Basculin' ? handleBasculin : pokename === 'Rockruff' ? handleRockruff : pokename === 'Flabébé' && handleFlabébé
        return handlerFunction(altForms, pokename, pokemon, ownedBallList, parsedGen)
    } else {
        altForms.forEach(form => {
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

function handleRegionalForms(pokemonInfo, ownedBallList, pokename, gen, multiplePokemonArr) {
    const copyOfArr = multiplePokemonArr
    const regionalForms = Object.keys(pokemonInfo.info.regionalForm.forms)
    if (uniqueRegionalFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Tauros' && handlePaldeanTauros
        return handlerFunction(regionalForms, pokename, pokemonInfo, ownedBallList, gen, multiplePokemonArr)
    } else {
        regionalForms.forEach((regionF) => {
            gen >= regionF.gen ?
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(pokename),
                    nickname: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                }
            ) : null
        })
    }
    return copyOfArr
}

function setBallInfo(pokemon, genKey, ballLegality) {
    const hasHAAndIsLegal = pokemon.info.HA.hasHA && (ballLegality.haIsLegal === true)
    const hasEMs = pokemon.specificGenInfo[genKey].eggmoves ? true : false
    if (hasHAAndIsLegal === false && hasEMs === false) {
        return {isOwned: false}
    } else if (hasHAAndIsLegal === true && hasEMs === false) {
        return {isOwned: false, isHA: false}
    } else if (hasHAAndIsLegal === false && hasEMs === true) {
        return {isOwned: false, emCount: 0, EMs: []}
    } else {
        return {isOwned: false, isHA: false, emCount: 0, EMs: []}
    }
}

function capitalizeFirstLetter(pokename) {
    return pokename.charAt(0).toUpperCase() + pokename.slice(1)
}

//this function handles baby and incense mons - mons where the user needs to have one or the other. no overlap so i can separate both cases.
function handleIncenseAndBabyMons(pokemon, babyMonScope, incenseMonScope) {
    if (pokemon.info.special === undefined) {
        const pokename = capitalizeFirstLetter(pokemon.name)
        const pokeNatDexNum = pokemon.info.natDexNum
        const pokeGen = pokemon.gen
        return { pokename, pokeNatDexNum, pokeGen }
    }
    //if statements allow for the scope param to be a boolean (if including all baby mons) or object (if having some vers as adults and some babies). object consists of key names being dexnum of the adult and boolean meaning we use the baby version instead of the adult.
    if (pokemon.info.special.hasBabyMon === true && (babyMonScope === true || (babyMonScope[`num${pokemon.info.natDexNum}`] === true))) { 
        const child = pokemon.info.special.child
        const pokename = capitalizeFirstLetter(child)
        const pokeNatDexNum = child.natDexNum
        const pokeGen = child.gen
        return { pokename, pokeNatDexNum, pokeGen }
    //if statement same logic as above.
    } else if (pokemon.info.special.incenseMon === true && (incenseMonScope === true || (incenseMonScope[`num${pokemon.info.natDexNum}`] === true))) { 
        const child = pokemon.info.special.child
        const pokename = capitalizeFirstLetter(child)
        const pokeNatDexNum = child.natDexNum
        const pokeGen = child.gen
        return { pokename, pokeNatDexNum, pokeGen }
    }
}

//this function returns an owned ball list based on legality
function setOwnedBallList(genKey, ballLegality, fullPokemonInfo) {
    const ownedBallList = {}
    if (ballLegality.apriball.isLegal === true) {
        apriballLiterals.forEach((b) => {
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality.apriball)
        })
    } 
    specialBalls.forEach((b) => {
        if (b === 'beast' && genKey === 6) {
            null
        } else if (ballLegality[b].isLegal === true) {
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality[b])
        }
    })
    return ownedBallList
}

//these functions apply to alternate form pokemon who have special cases, and must be singled out. see infoconstants/uniqueAlternateFormPokemon for more info. 
function handleBasculin(altForms, name, pokemonInfo, ownedBallList, gen) {
    const multiplePokemon = []
    altForms.forEach(form => {
        gen === 9 ? 
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                displayName: '',
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: ownedBallList
            }
        ) : 
        pokemonInfo.info.alternateForm.name[form] === 'White-Striped' ? 
        null :
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                displayName: '',
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: ownedBallList
            }
        ) 
    })
    return multiplePokemon
}

function handleRockruff(altForms, name, pokemonInfo, ownedBallList, gen) {
    const multiplePokemon = []
    altForms.forEach(form => {
        if (form === 'Dusk') {
            const copyOfOwnedBallList = ownedBallList
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: copyOfOwnedBallList
                }
            )
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                }
            )
        }
    })
    return multiplePokemon
}

function handleFlabébé(altForms, name, pokemonInfo, ownedBallList, gen) {
    const multiplePokemon = []
    altForms.forEach(form => {
        if (gen === 7 && form === 'Blue') {
            const copyOfOwnedBallList = ownedBallList
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: copyOfOwnedBallList
                }
            ) 
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                }
            )
        }
    })
    return multiplePokemon
}

//these functions apply to regional form pokemon who have special cases, and must be singled out. see infoconstants/uniqueRegionalFormPokemon for more info.
function handlePaldeanTauros(regionalForms, name, pokemonInfo, ownedBallList, gen, multiplePokemonArr) {
    const copyOfArr = multiplePokemonArr
    regionalForms.forEach((regionF) => {
        if (regionF.gen <= gen) {
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name),
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[0]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[1]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: ownedBallList
                },
            )
        }
    })
    return copyOfArr
}

module.exports = {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, setOwnedBallList, }