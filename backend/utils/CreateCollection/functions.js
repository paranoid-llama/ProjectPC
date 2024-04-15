import {apriballLiterals, specialBalls, uniqueAlternateFormPokemon, uniqueRegionalFormPokemon, interchangeableAltFormMons, nonBreedableAltFormMons} from './../../infoconstants.js'

//JSON.parse(JSON.stringify(ownedBallList)) ---- this makes a new ref for the owned ball list allowing changes in one alt form to not affect the other

function handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing=false, setType=false) {
    const multiplePokemon = []
    const nonBreedableAltForm = pokemon.info.alternateForm.nonBreedable !== undefined
    const altForms = pokename !== 'Alcremie' && (pokemon.info.specialAlternateForms !== undefined ? Object.keys(pokemon.info.specialAlternateForms.name) : pokename === 'Vivillon' ? pokemon.info.alternateForm.name : Object.keys(pokemon.info.alternateForm.name))
    const altFormType = setType ? {type: 'alternateForms'} : {}
    const altFormNestedType = setType ? 
        pokemon.info.alternateForm.interchangeable !== undefined ? {nestedType: 'interchangeable'} : 
        nonBreedableAltForm ? {nestedType: 'nonBreedable'} : 
        pokename === 'Vivillon' ? {nestedType: 'vivillon'} : 
        pokename === 'Alcremie' ? {nestedType: 'alcremie'} : {nestedType: 'breedable'} : {}
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    if (uniqueAlternateFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Basculin' ? handleBasculin : 
                                pokename === 'Rockruff' ? handleRockruff : 
                                pokename === 'Flabébé' ? handleFlabébé : 
                                pokename === 'Vivillon' && handleVivillon
        return pokename === 'Alcremie' ? 
            handleAlcremie(pokemon.info.alternateForm.sweets, pokemon.info.alternateForm.creams, pokename, pokemon, ownedBallList, parsedGen, importing, setType, altFormType, altFormNestedType) : 
            handlerFunction(altForms, pokename, pokemon, ownedBallList, parsedGen, importing, setType, altFormType, altFormNestedType)
    } else {
        altForms.forEach((form, idx) => {
            const formName = pokemon.info.alternateForm.name[form]
            const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))} 
            //we add stipulation below since ppl collecting nonbreedable alt form (as of april 2024, only sinistea and poltchageist antiques) is very rare, so we mark
            //the phony form as just the regular pokemon
            //though we set the display name
            const finalName = (nonBreedableAltForm && idx === 0) ? pokename : pokename + ' ' + `(${formName})` 
            const displayName = setType ? {} : (nonBreedableAltForm && idx === 0) ? {displayName: pokename + ' ' + `(${formName})`} : {displayName: ''} 
            const fullType = (nonBreedableAltForm && idx === 0) ? {type: 'breedables', nestedType: 'regular'} : {...altFormType, ...altFormNestedType}
            multiplePokemon.push(
                {
                    name: finalName,
                    ...displayName,
                    natDexNum: pokemon.info.natDexNum,
                    gen: pokemon.gen,
                    ...balls,
                    ...fullType,
                    ...importAltIdentifier
                }
            )
        })
    }
    return multiplePokemon
}

function handleRegionalForms(pokemonInfo, ownedBallList, pokename, gen, multiplePokemonArr, importing=false, setType=false) {
    const copyOfArr = multiplePokemonArr
    const regionalForms = pokemonInfo.info.regionalForm.forms
    const importAltIdentifier = importing ? {originalPokemon: pokename} : {}
    const altFormType = setType ? {type: 'breedables'} : {}
    const altFormNestedType = setType ? {nestedType: 'regionalForms'} : {}
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    if (uniqueRegionalFormPokemon.includes(pokename)) {
        const handlerFunction = pokename === 'Tauros' && handlePaldeanTauros
        return handlerFunction(regionalForms, pokename, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing, setType, altFormType, altFormNestedType)
    } else {
        regionalForms.forEach((regionF) => {
            gen >= regionF.gen ?
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(pokename),
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
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
        const adultChildType = pokemon.info.special.hasBabyMon === true ? 'regular' : 'incense'
        const childName = capitalizeFirstLetter(child.name)
        const childNatDexNum = child.natDexNum
        const childGen = child.gen
        const adultName = capitalizeFirstLetter(pokemon.name)
        const adultNatDexNum = pokemon.info.natDexNum
        const adultGen = pokemon.gen
        return {childName, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen, adultChildType}
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
function setOwnedBallList(genKey, ballLegality, fullPokemonInfo, onlyGettingLegalBalls=false) {
    const ownedBallList = {}
    const legalBalls = []
    if (ballLegality.apriball.isLegal === true) {
        apriballLiterals.forEach((b) => {
            
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality.apriball)
        })
        legalBalls.push('apriball')
    } 
    specialBalls.forEach((b) => {
        if (b === 'beast' && genKey === 'gen6') {
            null
        } else if (ballLegality[b].isLegal === true) {
            legalBalls.push(b)
            ownedBallList[b] = setBallInfo(fullPokemonInfo, genKey, ballLegality[b])
        }
    })
    return onlyGettingLegalBalls ? legalBalls : ownedBallList
}

//these functions apply to alternate form pokemon who have special cases, and must be singled out. see infoconstants/uniqueAlternateFormPokemon for more info. 
function handleBasculin(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const multiplePokemon = []
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        gen === 9 ? 
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                ...displayName,
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                ...balls,
                ...altFormType,
                ...altFormNestedType,
                ...importAltIdentifier
            }
        ) : 
        pokemonInfo.info.alternateForm.name[form] === 'White-Striped' ? 
        null :
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                ...displayName,
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                ...balls,
                ...altFormType,
                ...altFormNestedType,
                ...importAltIdentifier
            }
        ) 
    })
    return multiplePokemon
}

function handleRockruff(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const multiplePokemon = []
    const displayName = setType ? {} : {displayName: ''} 
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach((form) => {
        if (pokemonInfo.info.alternateForm.name[form] === 'Dusk') {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            const diffBalls = setType ? {} : {balls: copyOfOwnedBallList} 
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...diffBalls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleFlabébé(altForms, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const multiplePokemon = []
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    altForms.forEach(form => {
        if (gen === 7 && form === 'Blue') {
            const copyOfOwnedBallList = JSON.parse(JSON.stringify(ownedBallList))
            Object.keys(ownedBallList).forEach(ball => {
                delete copyOfOwnedBallList[ball].isHA
            })
            const diffBalls = setType ? {} : {balls: copyOfOwnedBallList}
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...diffBalls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            ) 
        } else {
            multiplePokemon.push(
                {
                    name: name + ' ' + `(${pokemonInfo.info.alternateForm.name[form]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                }
            )
        }
    })
    return multiplePokemon
}

function handleVivillon(patterns, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const multiplePokemon = []
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    const adjustedPatterns = gen === 7 ? patterns.filter(p => p !== 'Fancy') : patterns //fancy pattern is an event only pattern in gen 6/7, and when vivillon was reintroduced in scarlet/violet, it became the ONLY pattern obtainable. Funny.
    adjustedPatterns.forEach(pattern => {
        multiplePokemon.push(
            {
                name: name + ' ' + `(${pattern})`,
                ...displayName,
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                ...balls,
                ...altFormType,
                ...altFormNestedType,
                ...importAltIdentifier
            }
        )
    })
    return multiplePokemon
}

function handleAlcremie(sweets, creams, name, pokemonInfo, ownedBallList, gen, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const multiplePokemon = []
    const allAlcremieForms = []
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
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
                ...displayName,
                natDexNum: pokemonInfo.info.natDexNum,
                gen: pokemonInfo.gen,
                ...balls,
                ...altFormType,
                ...altFormNestedType,
                ...importAltIdentifier
            }
        )
    })
    return multiplePokemon
}


//these functions apply to regional form pokemon who have special cases, and must be singled out. see infoconstants/uniqueRegionalFormPokemon for more info.
function handlePaldeanTauros(regionalForms, name, pokemonInfo, ownedBallList, gen, multiplePokemonArr, importing=false, setType=false, altFormType={}, altFormNestedType={}) {
    const copyOfArr = multiplePokemonArr
    const importAltIdentifier = importing ? {originalPokemon: name} : {}
    const displayName = setType ? {} : {displayName: ''}
    const balls = setType ? {} : {balls: JSON.parse(JSON.stringify(ownedBallList))}
    regionalForms.forEach((regionF) => {
        if (regionF.gen <= gen) {
            copyOfArr.push(
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name),
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[0]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                },
                {
                    name: regionF.name + " " + capitalizeFirstLetter(name) + " " + `(${regionF.special[1]})`,
                    ...displayName,
                    natDexNum: pokemonInfo.info.natDexNum,
                    gen: pokemonInfo.gen,
                    ...balls,
                    ...altFormType,
                    ...altFormNestedType,
                    ...importAltIdentifier
                },
            )
        }
    })
    return copyOfArr
}



export {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, setOwnedBallList}