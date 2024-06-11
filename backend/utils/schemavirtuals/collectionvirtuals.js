import {handleGen8EMs, handleDifferentFormEMs, selectPokemonInfo} from './infoandotherfuncs.js'
import { incenseBabiesWithExclusiveEMs, incenseAdultsWithExclusiveEMs, altFormMonsWithExclusiveEMs, pokemonNamesWithSpaces, regionalFormRegions } from '../../../common/infoconstants/pokemonconstants.mjs'
import { genGames, noRegionalFormGens } from '../../../common/infoconstants/miscconstants.mjs'
import allPokemon from '../aprimonAPI/allpokemoninfo.js'

function getImgLink(p) {
    if (p.name) {
        if (p.name.includes(' ') && !pokemonNamesWithSpaces.includes(p.name)) {
            if (regionalFormRegions.map((region) => p.name.includes(region)).includes(true)) {
                if (p.name.includes('Tauros')) {
                    if (p.name.includes('(')) {
                        return `128-p-${p.name.charAt(16).toLowerCase()}`
                    }
                    return '128-p'
                }
                const modifier = p.natDexNum < 100 ? '0' : ''
                const modifiedDexNum = modifier + p.natDexNum
                return modifiedDexNum + `-${p.name.charAt(0).toLowerCase()}`
            } else if (p.name.includes('(')) {
                const startIndex = p.name.indexOf('(') + 1
                if (p.name.includes('Pumpkaboo') || p.name.includes('Rockruff')) {
                    if (p.name.includes('Small')) {
                        return p.natDexNum + `-sm`
                    }
                    if (p.name.includes('Average')) {
                        return `${p.natDexNum}`
                    }
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                } 
                if (p.name.includes('Deerling')) {
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase() + p.name.slice(startIndex + 1, startIndex + 3)}`
                } else if (p.name.includes('Oricorio')) {
                    if (p.name.includes("Pa'u")) {
                        return p.natDexNum + '-pau'
                    }
                    else {
                        return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                    }
                } else if (p.name.includes('Alcremie')) {
                    //Alcremie (Strawberry Matcha Cream)
                    //         ^          ^      ^
                    //      startindex   2ndspac 3rdspace
                    const indexOfSecondSpace = p.name.indexOf(' ', startIndex)
                    
                    const indexOfThirdSpace = p.name.indexOf(' ', indexOfSecondSpace+1)
                    const sweetName = p.name.slice(startIndex, indexOfSecondSpace).toLowerCase()
                    const creamName = p.name.slice(indexOfSecondSpace+1, indexOfThirdSpace).toLowerCase()
                    const creamSwirlId = p.name.slice(indexOfThirdSpace+1, indexOfThirdSpace+2).toLowerCase()

                    return `869-${sweetName}${creamName}${creamSwirlId}`
                } else if (p.name.includes('Vivillon')) {
                    return `666-${p.name.slice(startIndex, p.name.length-1).toLowerCase().replace(' ', '-')}`
                } else {
                    return p.natDexNum + `-${p.name.charAt(startIndex).toLowerCase()}`
                }
            }
        } else {
            const modifier = p.natDexNum < 100 && p.natDexNum >= 10 ? '0' : p.natDexNum < 10 ? '00' : ''
            const modifiedDexNum = modifier + p.natDexNum
            return modifiedDexNum
        }
    } else {
        return
    }
}

function getPossibleEggMoves(ownedPokemon, gen) {
    const collectionGen = gen === 'swsh' || gen === 'bdsp' ? 8 : parseInt(gen)
    const eggMoveInfo = {}
    ownedPokemon.map(p => {
        const pokemonInfo = selectPokemonInfo(p.name, p.gen, p.natDexNum)
        const isRegionalVariant = p.name.includes('Paldean') || p.name.includes('Hisuian') || p.name.includes('Galarian') || p.name.includes('Alolan')
        const incenseMonExclusiveEMs = incenseBabiesWithExclusiveEMs.includes(p.name) || incenseAdultsWithExclusiveEMs.includes(p.name)
        const hasRegionalVariant = pokemonInfo.info.regionalForm !== undefined && collectionGen >= pokemonInfo.info.regionalForm.forms[0].gen
        const altFormWithExclusiveEMs = altFormMonsWithExclusiveEMs.includes(p.name)
        const eggMovePath = pokemonInfo.specificGenInfo[`gen${collectionGen}`].eggmoves
        if (eggMovePath === undefined) {
            eggMoveInfo[p.name] = []
        } else {
            const normEMs = collectionGen === 7 && eggMovePath.usumOnly !== undefined ? 
                [...eggMovePath.moves, ...eggMovePath.usumOnly] : eggMovePath.moves !== undefined ? 
                eggMovePath.moves : []
            if (isRegionalVariant || incenseMonExclusiveEMs || hasRegionalVariant || altFormWithExclusiveEMs) {
                eggMoveInfo[p.name] = handleDifferentFormEMs(isRegionalVariant, hasRegionalVariant, incenseMonExclusiveEMs, altFormWithExclusiveEMs, collectionGen, gen, p, eggMovePath, normEMs)
            } else if (collectionGen === 8) {
                eggMoveInfo[p.name] = handleGen8EMs(eggMovePath, normEMs, gen)
            } else {
                eggMoveInfo[p.name] = normEMs
            }
        }
    })
    return eggMoveInfo
}

function getPossibleGender(p) {
    const maleOnlyPokemon = ['Nidoran♂', 'Tauros', 'Paldean Tauros', 'Paldean Tauros (Aqua)', 'Paldean Tauros (Blaze)', 'Tyrogue', 'Volbeat', 'Throh', 'Sawk', 'Rufflet', 'Impidimp']
    const femaleOnlyPokemon = ['Nidoran♀', 'Chansey', 'Kangaskhan', 'Jynx', 'Smoochum', 'Miltank', 'Illumise', 'Happiny', 'Petilil', 'Vullaby', 'Flabébé', 'Bounsweet', 'Hatenna', 'Milcery', 'Tinkatink']
    const genderlessPokemon = ['Magnemite', 'Voltorb', 'Hisuian Voltorb', 'Staryu', 'Porygon', 'Lunatone', 'Solrock', 'Baltoy', 'Beldum', 'Bronzor', 'Rotom', 'Klink', 'Cryogonal', 'Golett', 'Carbink', 'Minior', 'Dhelmise', 'Sinistea', 'Falinks', 'Tandemaus', 'Poltchageist']
    if (maleOnlyPokemon.includes(p.name)) {
        return 'male'
    } else if (femaleOnlyPokemon.includes(p.name)) {
        return 'female'
    } else if (genderlessPokemon.includes(p.name)) {
        return 'none'
    } else {
        return 'both'
    }
}

function getCollectionProgress(ownedPokemonList) {
    // console.log(ownedPokemonList)
    let totalToCollect = 0
    let totalCollected = 0
    ownedPokemonList.forEach(p => {
        const ballsToCollect = Object.keys(p.balls).filter(ball => p.balls[ball].disabled !== true)
        for (let ball of ballsToCollect) {
            totalToCollect +=1
            if (p.balls[ball].isOwned === true) {
                totalCollected+=1
            }
        }
    })
    const ballProgress = {display: `${totalCollected}/${totalToCollect}`, percent: (totalCollected/totalToCollect)*100}
    // console.log(ballProgress)
    return ballProgress
}

function getAvailableHomeGames(ownedPokemonList) {
    const availableGamesData = {}
    ownedPokemonList.forEach((pokemon) => {
        availableGamesData[pokemon.name] = []
        const pokemonAPIData = allPokemon.filter(pInfo => {
            const nameMatches = pokemon.natDexNum === pInfo.info.natDexNum || (pInfo.info.special !== undefined && pokemon.natDexNum === pInfo.info.special.child.natDexNum)
            return nameMatches
        })[0]
        Object.keys(pokemonAPIData.specificGenInfo).forEach((genInfo) => {
            const isHomeGame = genInfo !== 'gen6' && genInfo !== 'gen7'
            const isRegionalFormPokemon = regionalFormRegions.map((region) => pokemon.name.toLowerCase().includes(region.toLowerCase())).includes(true) && pokemonAPIData.info.regionalForm !== undefined
            const regionalFormIntro = isRegionalFormPokemon && pokemonAPIData.info.regionalForm.forms.filter(rForm => pokemon.name.includes(rForm.name))[0].gen
            const extraConsideration = pokemon.name.includes('White-Striped') //white-striped basculin is the only alt form pokemon who was introduced in a later gen (was introduced in legends arceus and made available in apriballs in sv)
            if (isHomeGame) {
                const genNum = parseInt(genInfo.slice(3))
                const genGameData = genGames.filter(gGInfo => gGInfo.gen === genNum)[0]
                const hasMultipleGames = genGameData !== undefined
                if (hasMultipleGames) {
                    const games = Object.keys(pokemonAPIData.specificGenInfo[genInfo].balls)
                    const availableGamesInGen = genGameData.games.filter(game => games.includes(game))
                    if (isRegionalFormPokemon && (regionalFormIntro > genNum)) {
                        return
                    } else {
                        availableGamesInGen.forEach(game => {
                            if ((isRegionalFormPokemon && noRegionalFormGens.includes(game)) || extraConsideration) {
                                return
                            } else {
                                availableGamesData[pokemon.name].push(game)
                            }
                        })
                    }
                    
                } else {
                    if (isRegionalFormPokemon && noRegionalFormGens.includes(genNum)) {
                        return
                    } else {
                        availableGamesData[pokemon.name].push(genNum)
                    }
                }
            }
        })
    })
    return availableGamesData
}

export {getImgLink, getPossibleEggMoves, getPossibleGender, getCollectionProgress, getAvailableHomeGames}