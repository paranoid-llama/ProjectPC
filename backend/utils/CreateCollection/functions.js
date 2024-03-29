import {apriballLiterals, specialBalls, uniqueAlternateFormPokemon, uniqueRegionalFormPokemon} from './../../infoconstants.js'

//JSON.parse(JSON.stringify(ownedBallList)) ---- this makes a new ref for the owned ball list allowing changes in one alt form to not affect the other

function handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing=false) {
    const multiplePokemon = []
    const altForms = pokename !== 'Alcremie' && (pokemon.info.specialAlternateForms !== undefined ? Object.keys(pokemon.info.specialAlternateForms.name) : Object.keys(pokemon.info.alternateForm.name))
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    if (uniqueAlternateFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Basculin' ? handleBasculin : 
                                pokename === 'Rockruff' ? handleRockruff : 
                                pokename === 'Flabébé' ? handleFlabébé : 
                                pokename === 'Vivillon' && handleVivillon
        return pokename === 'Alcremie' ? 
            handleAlcremie(pokemon.info.alternateForm.sweets, pokemon.info.alternateForm.creams, pokename, pokemon, ownedBallList, parsedGen, importing) : 
            handlerFunction(altForms, pokename, pokemon, ownedBallList, parsedGen, importing)
    } else {
        altForms.forEach(form => {
            const formName = pokemon.info.specialAlternateForms !== undefined ? pokemon.info.specialAlternateForms.name[form] : pokemon.info.alternateForm.name[form]
            multiplePokemon.push(
                {
                    name: pokename + ' ' + `(${formName})`,
                    displayName: '',
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                }
            )
        })
    }
    return multiplePokemon
}

function handleRegionalForms(pokemonInfo, ownedBallList, pokename, gen, multiplePokemonArr, importing=false) {
    const copyOfArr = multiplePokemonArr
    const regionalForms = pokemonInfo.info.regionalForm.forms
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    if (uniqueRegionalFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Tauros' && handlePaldeanTauros
        return handlerFunction(regionalForms, pokename, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing)
    } else {
        regionalForms.forEach((regionF) => {
            gen >= regionF.gen ?
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(pokename),
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
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
function handleIncenseAndBabyMons(pokemon, babyMonScope, incenseMonScope, importing=false) {
    if (pokemon.info.special === undefined) {
        const pokename = capitalizeFirstLetter(pokemon.name)
        const pokeNatDexNum = pokemon.info.natDexNum
        const pokeGen = pokemon.gen
        return { pokename, pokeNatDexNum, pokeGen }
    }
    //when importing we make an instance of a collection with every pokemon, then filter by their name list. therefore we need both adult and baby.
    if (importing) {
        const child = pokemon.info.special.child
        const childName = capitalizeFirstLetter(child.name)
        const childNatDexNum = child.natDexNum
        const childGen = child.gen
        const adultName = capitalizeFirstLetter(pokemon.name)
        const adultNatDexNum = pokemon.info.natDexNum
        const adultGen = pokemon.gen
        return {childName, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen}
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
        if (b === 'beast' && genKey === 'gen6') {
            null
        } else if (ballLegality[b].isLegal === true) {
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality[b])
        }
    })
    return ownedBallList
}

//these functions apply to alternate form pokemon who have special cases, and must be singled out. see infoconstants/uniqueAlternateFormPokemon for more info. 
function handleBasculin(altForms, name, pokemonInfo, ownedBallList, gen, importing=false) {
    const multiplePokemon = []
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        gen === 9 ? 
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                displayName: '',
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: JSON.parse(JSON.stringify(ownedBallList)),
                ...importAltIdentifier
            }
        ) : 
        pokemonInfo.info.alternateForm.name[form] === 'White-Striped' ? 
        null :
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: JSON.parse(JSON.stringify(ownedBallList)),
                ...importAltIdentifier
            }
        ) 
    })
    return multiplePokemon
}

function handleRockruff(altForms, name, pokemonInfo, ownedBallList, gen, importing=false) {
    const multiplePokemon = []
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach((form) => {
        if (pokemonInfo.info.alternateForm.name[form] === 'Dusk') {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: copyOfOwnedBallList,
                    ...importAltIdentifier
                }
            )
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleFlabébé(altForms, name, pokemonInfo, ownedBallList, gen, importing=false) {
    const multiplePokemon = []
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        if (gen === 7 && form === 'Blue') {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: copyOfOwnedBallList,
                    ...importAltIdentifier
                }
            ) 
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleVivillon(patterns, name, pokemonInfo, ownedBallList, gen, importing=false) {
    const multiplePokemon = []
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    patterns.forEach(pattern => {
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pattern})`,
                displayName: '',
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: JSON.parse(JSON.stringify(ownedBallList)),
                ...importAltIdentifier
            }
        )
    })
    return multiplePokemon
}

function handleAlcremie(sweets, creams, name, pokemonInfo, ownedBallList, gen, importing=false) {
    const multiplePokemon = []
    const allAlcremieForms = []
    for (let sweet of sweets) {
        for (let cream of creams) {
            allAlcremieForms.push(`${sweet} ${cream}`)
        }
    }
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    allAlcremieForms.forEach(alcremieForm => {
        multiplePokemon.push(
            {
                name: name + ' ' + `(${alcremieForm})`,
                displayName: '',
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                balls: JSON.parse(JSON.stringify(ownedBallList)),
                ...importAltIdentifier
            }
        )
    })
    return multiplePokemon
}


//these functions apply to regional form pokemon who have special cases, and must be singled out. see infoconstants/uniqueRegionalFormPokemon for more info.
function handlePaldeanTauros(regionalForms, name, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing=false) {
    const copyOfArr = multiplePokemonArr
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    regionalForms.forEach((regionF) => {
        if (regionF.gen <= gen) {
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name),
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[0]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[1]})`,
                    displayName: '',
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    balls: JSON.parse(JSON.stringify(ownedBallList)),
                    ...importAltIdentifier
                },
            )
        }
    })
    return copyOfArr
}



export {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, setOwnedBallList}