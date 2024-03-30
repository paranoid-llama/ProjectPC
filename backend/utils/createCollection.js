import allPokemon from './aprimonAPI/allpokemoninfo.js'
import {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, setOwnedBallList} from './CreateCollection/functions.js'
import {interchangeableAltFormMons} from './../infoconstants.js'

//Note for pokemon groups/scope
//data structure: 
//pokemonScope: {
//   exclude: [(list of pokemon (names or dexnums, dont know yet) to exclude)], 
//   useBabyMon: {num[dexnumofrelevantadultmon]: boolean, ...othernums)}} OR boolean (if they want all or none),
//   useIncenseMon: {num[dexnumofrelevantincenseadult]: boolean, ...othernums} OR boolean (if they want all or none),
//   includeInterchangeableAltForms: {num[dexnumofrelevantpokemon]: boolean, ...othernums} OR boolean (if they want all or none),
//   includeNonBreedables: {num[dexnumofrelevantpokemon]: boolean, ...othernums} OR boolean (if they want all or none),
//   includeNonBreedableAltForms: {num[dexnumofrelevantpokemon]: boolean, ...othernums} OR boolean (if they want all or none) ---- this applies to sinistea and poltchageist
//   includeVivillonForms: [arr of vivillon patterns] OR boolean (if they want all or none)
//   includeAlcremieForms: [arr of alcremie forms] OR boolean (if they want all or none)
//   includeLegendaries: {num[dexnumofrelevantpokemon]: boolean, ...othernums} OR boolean (if they want all or none),
//   includeEvolvedRegionals: {num[dexnumofrelevantpokemon]: boolean, ...othernums} OR boolean (if they want all or none)
//}
// function setOwnedPokemonList(gen, includeBabyMon, includeIncenseMon, interchangeableAltForms) {
function setOwnedPokemonList(gen, pokemonScope, importing=false) {
    return (
        allPokemon.map((pokemon) => {
            const parsedGen = gen === 'swsh' || gen === 'bdsp' ? 8 : parseInt(gen) //gen comes as a string, since "swsh" and "bdsp" are used instead of 8. this parses it into a number
            const game = gen === 'swsh' || gen === 'bdsp' ? gen : "" //this retains what game it is (if there is one)
            const formattedGen = `gen${parsedGen}` //this formats gen to how its organized in the database
            const pokemonInGen = (parsedGen !== 8 && pokemon.specificGenInfo[formattedGen] !== undefined) || (parsedGen === 8 && pokemon.specificGenInfo[formattedGen] !== undefined && pokemon.specificGenInfo[formattedGen].balls[game] !== undefined) //have to break gen 8 check in 2 since they could have no gen 8 combos
            // console.log(`name: ${pokemon.name}, pokemonInGen: ${pokemonInGen}`)
            // console.log(pokemonInGen)
            if (importing && pokemonInGen) {
                // console.log(pokemon.name)
                const {childName, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen, pokename, pokeNatDexNum, pokeGen} = handleIncenseAndBabyMons(pokemon, {}, {}, true)
                const ballsPath = parsedGen === 8 ? pokemon.specificGenInfo[formattedGen].balls[game] : pokemon.specificGenInfo[formattedGen].balls
                const ownedBallList = setOwnedBallList(formattedGen, ballsPath, pokemon)
                const originalPokemon = pokename === undefined ? {
                    name: adultName,
                    natDexNum: adultNatDexNum,
                    gen: adultGen,
                    balls: ownedBallList
                } : {
                    name: pokename,
                    natDexNum: pokeNatDexNum,
                    gen: pokeGen,
                    balls: ownedBallList
                }
                //we need to make a new reference for each key in the child pokemon otherwise it'll end up updating both adult and child ball combo info
                const newOwnedBallListRef = JSON.parse(JSON.stringify(ownedBallList))
                const childPokemon = childName !== undefined ? {
                    name: childName, 
                    natDexNum: childNatDexNum,
                    gen: childGen,
                    balls: newOwnedBallListRef
                } : {}
                if (pokemon.info.alternateForm !== undefined || (importing && pokemon.info.specialAlternateForms !== undefined)) { //special alternate forms refers to sinistea/poltchageist
                    const isntSpecialAltForm = pokemon.info.alternateForm !== undefined
                    if ((isntSpecialAltForm && pokemon.info.alternateForm.originalIsForm) || interchangeableAltFormMons.includes(pokename)) { //there is an option to just have a one of an interchangeable alt form mon. this just gets singled out if they have all of them, though.
                        return [originalPokemon, handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, true)]
                    }
                    const multiplePokemon = handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, true) 
                    return multiplePokemon
                }
                if (pokemon.info.evolvedRegionalForm) {
                    originalPokemon.originalPokemon = pokemon.info.species
                    originalPokemon.displayName = ''
                }
                if (pokemon.info.regionalForm && game !== "bdsp") { 
                    const multiplePokemon = handleRegionalForms(pokemon, ownedBallList, pokename, parsedGen, childPokemon.name ? [originalPokemon, childPokemon] : [originalPokemon], true)
                    return multiplePokemon
                }
                return childPokemon.name ? [originalPokemon, childPokemon] : originalPokemon
            }
            if (pokemonInGen && pokemon.info.nonBreedable === undefined && pokemon.info.legendary === undefined && pokemon.info.evolvedRegionalForm === undefined) {
                const ballsPath = parsedGen === 8 ? pokemon.specificGenInfo[formattedGen].balls[game] : pokemon.specificGenInfo[formattedGen].balls
                const ownedBallList = setOwnedBallList(parsedGen, ballsPath, pokemon)
                // function checkIfBabyOrIncenseMon(pokemon, includeBabyMon, includeIncenseMon) {
                //     if (pokemon.info.special === undefined) {
                //         const pokename = pokemon.name === 'mr. mime' ? 
                //                         'Mr. Mime': 
                //                         pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
                //         const pokeNatDexNum = pokemon.info.natDexNum
                //         const pokeGen = pokemon.gen
                //         return { pokename, pokeNatDexNum, pokeGen }
                //     }
                //     if (pokemon.info.special.hasBabyMon === true && includeBabyMon === true) { //change if logic here if wanted to exclude certain pokemon
                //         const child = pokemon.info.special.child
                //         const pokename = child.name.charAt(0).toUpperCase() + child.name.slice(1)
                //         const pokeNatDexNum = pokemon.info.special.child.natDexNum
                //         const pokeGen = pokemon.info.special.child.gen
                //         return { pokename, pokeNatDexNum, pokeGen }
                //     } else if (pokemon.info.special.incenseMon === true && includeIncenseMon === true) { //change if logic here if wanted to exclude certain pokemon
                //         const child = pokemon.info.special.child
                //         const pokename = child.name === 'mime jr.' ? 
                //                             'Mime Jr.' : 
                //                             child.name.charAt(0).toUpperCase() + child.name.slice(1)
                //         const pokeNatDexNum = pokemon.info.special.child.natDexNum
                //         const pokeGen = pokemon.info.special.child.gen
                //         return { pokename, pokeNatDexNum, pokeGen }
                //     }
                // }

                // function checkLegality(ball, balls) {
                //     const apriballList = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
                //     if (ball === 'apriball' && balls.apriball.isLegal === true) {
                //         apriballList.map((b) => {
                //             ownedBallList[b] = setBallInfo(pokemon, formattedGen)
                //         })
                //     } else if (balls[ball].isLegal === true) {
                //         ownedBallList[ball] = setBallInfo(pokemon, formattedGen)
                //     }
                //     else {
                //         return
                //     }
                // }

                // function checkLegalityGen8(game, ball, balls) {
                //     const apriballList = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
                //     if (ball === 'apriball' && balls[game].apriball.isLegal === true) {
                //         apriballList.map((b) => {
                //             ownedBallList[b] = setBallInfo(pokemon, formattedGen)
                //         })
                //     } else if (balls[game][ball].isLegal === true) {
                //         ownedBallList[ball] = setBallInfo(pokemon, formattedGen)
                //     }
                //     else {
                //         return
                //     }
                // }

                // if (game === "") {
                //     checkLegality('apriball', balls)
                //     checkLegality('beast', balls)
                //     checkLegality('dream', balls)
                //     checkLegality('safari', balls)
                //     checkLegality('sport', balls)
                // } else {
                //     checkLegalityGen8(game, 'apriball', balls)
                //     checkLegalityGen8(game, 'beast', balls)
                //     checkLegalityGen8(game, 'dream', balls)
                //     checkLegalityGen8(game, 'safari', balls)
                //     checkLegalityGen8(game, 'sport', balls)
                // }

                

                const {pokename, pokeNatDexNum, pokeGen} = handleIncenseAndBabyMons(pokemon, pokemonScope.includeBabyMon, pokemonScope.includeIncenseMon)

                const originalPokemon = {
                    name: pokename,
                    natDexNum: pokeNatDexNum,
                    gen: pokeGen,
                    balls: ownedBallList
                }

                if (pokemon.info.alternateForm) {
                    if (interchangeableAltFormMons.includes(pokename) && (pokemonScope.includeInterchangeableAltForms === false || pokemonScope.includeInterchangeableAltForms[`num${pokeNatDexNum}`] === false)) {  
                        return originalPokemon
                    }
                    if (pokemon.info.alternateForm.originalIsForm) { //handleAltForms func returns diff alternate forms of pokemon but not the original. Currently this if only applies to Rockruff and his Dusk form
                        return [originalPokemon, handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen)]
                    }
                    return handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen) 
                }

                if (pokemon.info.regionalForm !== undefined && game !== "bdsp") { //BDSP doesn't allow regional variants to be transferred over from HOME
                    // const multiplePokemon = [originalPokemon]
                    const multiplePokemon = handleRegionalForms(pokemon, ownedBallList, pokename, parsedGen, [originalPokemon])
                    // if (pokemon.name === 'tauros' && parsedGen === 9) {
                    //     pokemon.info.regionalForm.forms.map((regionF) => {
                    //         multiplePokemon.push(
                    //             {
                    //                 name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                    //                 nickname: '',
                    //                 natDexNum: pokemon.info.natDexNum,
                    //                 gen: pokemon.gen,
                    //                 balls: ownedBallList
                    //             },
                    //             {
                    //                 name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + " " + `(${regionF.special[0]})`,
                    //                 nickname: '',
                    //                 natDexNum: pokemon.info.natDexNum,
                    //                 gen: pokemon.gen,
                    //                 balls: ownedBallList
                    //             },
                    //             {
                    //                 name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + " " + `(${regionF.special[1]})`,
                    //                 nickname: '',
                    //                 natDexNum: pokemon.info.natDexNum,
                    //                 gen: pokemon.gen,
                    //                 balls: ownedBallList
                    //             },
                    //         )
                    //     })
                    // } else {
                    //     pokemon.info.regionalForm.forms.map((regionF) => {
                    //         parsedGen >= regionF.gen ? 

                    //         multiplePokemon.push(
                    //         {
                    //             name: pokemon.name === 'mr. mime' ? 
                    //                     'Galarian Mr. Mime':  
                    //                     regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                    //             nickname: '',
                    //             natDexNum: pokemon.info.natDexNum,
                    //             gen: pokemon.gen,
                    //             balls: ownedBallList
                    //         })
                    //         : ""
                    //     })
                    // }
                    return multiplePokemon
                } else {
                    return originalPokemon
                }
            } else {
                return 
            }
        })
    )
}

class Collection {
    constructor (gen, includeBabyMon, includeIncenseMon, owner, interchangeableAltForms) {
        this.gen = gen
        this.owner = owner
        this.ownedPokemon = setOwnedPokemonList(gen, includeBabyMon, includeIncenseMon, interchangeableAltForms)
                                .filter(e => e !== undefined)
                                .flat()
                                .sort((a, b) => a.natDexNum > b.natDexNum ? 1 : -1)
                                .sort((a, b) => {
                                    const num1 = a.natDexNum
                                    const num2 = b.natDexNum
                                    if (num1 === num2) {
                                        if (a.name.includes(" ") && b.name.includes(" ")) {
                                            return a.name === "Mr. Mime" ? -1 : a.name.localeCompare(b.name)
                                        } else if (b.name.includes(" ")){
                                            return -1
                                        } else {
                                            return 1
                                        }
                                    } 
                                })
                            }
}

export default Collection

export {setOwnedPokemonList}

