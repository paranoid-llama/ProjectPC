import allPokemon from './aprimonAPI/allpokemoninfo.js'
import {handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setBallInfo, setOwnedBallList, removeBallsOutsideScope, getBallPath} from './CreateCollection/functions.js'
import { interchangeableAltFormMons } from '../common/infoconstants/pokemonconstants.mjs'
import { customSortCollectionListLogic } from '../common/sortingfunctions/customsorting.mjs'
import { getGenNum } from '../common/infoconstants/miscconstants.mjs'
import { getImgLink, getPossibleGender } from './schemavirtuals/collectionvirtuals.js'

//Note for pokemon groups/scope
//data structure:
// pokemon info comes as obj like this: {name: natDexNum: id(imgLink): }
//pokemonScope: {
//   breedables: [arr of poke info] (no regional forms gens) OR {regular: [arr], regionalForms: [arr]}
//   alternateForms: {interchangeable: [arr], breedable: [arr], nonBreedable: [arr] ---> this applies only to sinistea and poltchageist, vivillon: [arr], alcremie: [arr]}
//   babyAdultMons: {regularBabies: [arr], incenseBabies: [arr], regularAdults: [arr], incenseAdults: [arr]}
//   nonBreedables: {regular: [arr], ultraBeasts: [arr], paradox: [arr]} OR [arr of poke info] (no ultra beasts or paradoxes)
//   legendaries: [arr]
//   evolvedRegionals: [arr]
//}
//ballScope: [arr of balls]
//excludedCombos: {'pokemon name': {natDexNum, id, excludedBalls: [arr of excludedBalls]}}
function setOwnedPokemonList(gen, pokemonScope, ballScope, excludedCombos, importing=false, importedCollection=[]) {
    const userImportedCollection = importedCollection !== false
    const parsedGen = getGenNum(gen) //gen comes as a string, since "swsh" and "bdsp" are used instead of 8. this parses it into a number
    const game = isNaN(parseInt(gen)) ? gen : "" //this retains what game it is (if there is one)
    const isHomeCollection = gen === 'home'
    const formattedGen = isHomeCollection ? 'home' : `gen${parsedGen}` //this formats gen to how its organized in the database
    return (
        allPokemon.map((pokemon) => {
            const pokemonInGen = gen === 'home' || (parsedGen !== 8 && pokemon.specificGenInfo[formattedGen] !== undefined) || (parsedGen === 8 && pokemon.specificGenInfo[formattedGen] !== undefined && pokemon.specificGenInfo[formattedGen].balls[game] !== undefined) //have to break gen 8 check in 2 since they could have no gen 8 combos
            if (pokemonInGen) {
                // console.log(pokemon.name)
                const ballsPath = getBallPath(pokemon, gen, formattedGen, game)
                const ownedBallList = setOwnedBallList(formattedGen, ballsPath, pokemon, false, isHomeCollection)
                const {childName, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen, pokename, pokeNatDexNum, pokeGen} = handleIncenseAndBabyMons(pokemon)
                
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
                if (pokemon.info.alternateForm !== undefined && (pokemon.info.alternateForm.nonBreedable === undefined || importing)) { //non breedable alternate forms refers to sinistea/poltchageist
                    const breedableAltForm = pokemon.info.alternateForm.nonBreedable === undefined
                    if (breedableAltForm && pokemon.info.alternateForm.originalIsForm) { //currently only applies to Rockruff as of May 2024
                        const originalPokemonScope = !importing && (pokemonScope.breedables.regular ? pokemonScope.breedables.regular : pokemonScope.breedables)
                        const includeOriginalPokemon = importing ? true : originalPokemonScope.filter(mon => mon.name === originalPokemon.name).length !== 0
                        const multiplePokemon = [includeOriginalPokemon ? originalPokemon : undefined, handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing, false, !importing && pokemonScope.alternateForms)].flat().filter(mon => mon !== undefined)
                        const filteredByBallScope = importing ? multiplePokemon : removeBallsOutsideScope(multiplePokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => multiplePokemon.filter(mon => mon.name === impMon.name).length !== 0) : undefined)
                        return filteredByBallScope
                    }
                    if (pokemon.info.alternateForm.interchangeable !== undefined) {//there is an option to just have a one of an interchangeable alt form mon. this just gets singled out if they have all of them, though.
                        const includeOriginalPokemon = importing ? true : pokemonScope.alternateForms.interchangeable.filter(mon => mon.name === originalPokemon.name).length !== 0
                        const originalNameAdjustment = includeOriginalPokemon ? {...originalPokemon, name: `${originalPokemon.name} (Any)`} : null
                        const multiplePokemon = [includeOriginalPokemon ? originalNameAdjustment : undefined, handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing, false, !importing && pokemonScope.alternateForms)].flat().filter(mon => mon !== undefined)
                        const filteredByBallScope = importing ? multiplePokemon : removeBallsOutsideScope(multiplePokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => multiplePokemon.filter(mon => mon.name === impMon.name).length !== 0) : undefined)
                        return filteredByBallScope 
                    }
                    const multiplePokemon = handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen, importing, false, !importing && pokemonScope.alternateForms, (!breedableAltForm && !importing) ? pokemonScope.breedables.regular : []) 
                    const filteredByBallScope = importing ? multiplePokemon : removeBallsOutsideScope(multiplePokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => multiplePokemon.filter(mon => mon.name === impMon.name).length !== 0) : undefined)
                    return filteredByBallScope
                }
                if (pokemon.info.evolvedRegionalForm) {
                    if (importing) {
                        originalPokemon.originalPokemon = pokemon.info.species
                        originalPokemon.displayName = ''
                    } else {
                        const filteredByPokemonScope = pokemonScope.evolvedRegionals.filter(mon => mon.name === originalPokemon.name).length !== 0 ? originalPokemon : undefined
                        const filteredByBallScope = filteredByPokemonScope === undefined ? undefined : removeBallsOutsideScope(filteredByPokemonScope, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => filteredByPokemonScope.name === impMon.name)[0] : undefined)
                        return filteredByBallScope
                    }
                }
                if (pokemon.info.regionalForm && game !== "bdsp" && parsedGen !== 6) {
                    //do note that mr. mime also belongs in the baby/adult if section, but the below boolean specifically handles mr. mime's situation.
                    //mr. mime is the only regional form pokemon who has a baby form, which means they are not in the breedables section of the scope.
                    //if there is ever more overlap, then we might need to change how this is organized.
                    const isLegendaryRegional = pokemon.info.legendary !== undefined //currently only applies to Articuno, Zapdos, and Moltres
                    const originalFormScope = !importing && (isLegendaryRegional ? pokemonScope.legendaries : pokemonScope.breedables.regular ? pokemonScope.breedables.regular : pokemonScope.breedables)
                    const arrOfPokemon = childPokemon.name ? [originalPokemon, childPokemon] : [originalPokemon] //theres only ever a child for mr. mime
                    const filteredArrOfPokemon = importing ? arrOfPokemon : childPokemon.name ?
                        arrOfPokemon.filter((mon, idx) => idx === 0 && pokemonScope.babyAdultMons.incenseAdults.filter(aMon => aMon.name === mon.name).length !== 0 || idx === 1 && pokemonScope.babyAdultMons.incenseBabies.filter(bMon => bMon.name === mon.name).length !== 0) :
                        arrOfPokemon.filter(mon => originalFormScope.filter(sMon => sMon.name === mon.name).length !== 0)
                    const multiplePokemon = handleRegionalForms(pokemon, ownedBallList, pokename === undefined ? adultName : pokename, parsedGen, filteredArrOfPokemon, importing, false, !importing ? isLegendaryRegional ? pokemonScope.legendaries : pokemonScope.breedables.regionalForms : [])
                    const filteredByBallScope = importing ? multiplePokemon : removeBallsOutsideScope(multiplePokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => multiplePokemon.filter(mon => mon.name === impMon.name).length !== 0) : undefined)
                    return filteredByBallScope
                }
                if (pokemon.info.nonBreedable) {
                    const subGroup = !importing && (pokemon.info.ultraBeast ? 'ultraBeasts' : pokemon.info.paradoxPokemon ? 'paradoxPokemon' : pokemonScope.nonBreedables.regular ? 'regular' : 'none')
                    const groupScope = !importing && (subGroup === 'none' ? pokemonScope.nonBreedables : pokemonScope.nonBreedables[subGroup])
                    const includePokemon = importing ? true : groupScope.filter(mon => mon.name === originalPokemon.name).length !== 0
                    const finalPokemon = importing ? originalPokemon : includePokemon ? removeBallsOutsideScope(originalPokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => originalPokemon.name === impMon.name)[0] : undefined) : undefined
                    return finalPokemon
                }
                if (pokemon.info.legendary) {
                    const includePokemon = importing ? true : pokemonScope.legendaries.filter(mon => mon.name === originalPokemon.name).length !== 0
                    const finalPokemon = importing ? originalPokemon : includePokemon ? removeBallsOutsideScope(originalPokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => originalPokemon.name === impMon.name)[0] : undefined) : undefined
                    return finalPokemon
                }
                if (pokemon.info.special) {
                    const babyType = pokemon.info.special.hasBabyMon ? 'regular' : 'incense'
                    const includedMons = importing ? [originalPokemon, childPokemon] : [originalPokemon, childPokemon].filter((mon, idx) => (
                        idx === 0 && pokemonScope.babyAdultMons[`${babyType}Adults`].filter(aMon => aMon.name === mon.name).length !== 0 ||
                        idx === 1 && pokemonScope.babyAdultMons[`${babyType}Babies`].filter(bMon => bMon.name === mon.name).length !== 0 
                    ))
                    const filteredByBallScope = importing ? includedMons : removeBallsOutsideScope(includedMons, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => includedMons.filter(mon => mon.name === impMon.name).length !== 0) : undefined)
                    return filteredByBallScope
                }
                const breedablesScope = !importing && (pokemonScope.breedables.regular ? pokemonScope.breedables.regular : pokemonScope.breedables)
                const includeMon = importing ? true : breedablesScope.filter(mon => mon.name === originalPokemon.name).length !== 0
                const finalPokemon = importing ? originalPokemon : includeMon ? removeBallsOutsideScope(originalPokemon, ballScope, excludedCombos, userImportedCollection ? importedCollection.filter(impMon => originalPokemon.name === impMon.name)[0] : undefined) : undefined
                return finalPokemon
            }
        })
    )
}

function getIndividualPokemonInfo(gen, newPokemon, ballScope) {
    const parsedGen = getGenNum(gen) //gen comes as a string, since "swsh" and "bdsp" are used instead of 8. this parses it into a number
    const game = isNaN(parseInt(gen)) ? gen : "" //this retains what game it is (if there is one)
    const formattedGen = `gen${parsedGen}` //this formats gen to how its organized in the database
    return (
        allPokemon.map(pokemon => {
            const pokemonInNewPokemonArr = pokemon.info.special !== undefined ? (newPokemon.filter(nPoke => nPoke.natDexNum === pokemon.info.natDexNum || nPoke.natDexNum === pokemon.info.special.child.natDexNum)[0]) : newPokemon.filter(nPoke => nPoke.natDexNum === pokemon.info.natDexNum)[0]
            const getPokemonInfo = pokemonInNewPokemonArr !== undefined
            if (getPokemonInfo) {
                // const ballsPath = parsedGen === 8 ? pokemon.specificGenInfo[formattedGen].balls[game] : pokemon.specificGenInfo[formattedGen].balls
                const ballsPath = getBallPath(pokemon, gen, formattedGen, game)
                const isBabyPokemon = pokemon.info.special !== undefined && pokemon.info.special.child.natDexNum === pokemonInNewPokemonArr.natDexNum
                const ownedBallList = setOwnedBallList(formattedGen, ballsPath, pokemon, false, gen === 'home')
                const pokemonInfo = {
                    //below condition true means it's interchangeable any
                    name: interchangeableAltFormMons.includes(pokemonInNewPokemonArr.name) ? `${pokemonInNewPokemonArr.name} (Any)` : pokemonInNewPokemonArr.name, 
                    natDexNum: pokemonInNewPokemonArr.natDexNum,
                    gen: isBabyPokemon ? pokemon.info.special.child.gen : pokemon.gen,
                    balls: ownedBallList
                }
                // pokemonInfo.imgLink = getImgLink(pokemonInfo)
                // pokemonInfo.possibleGender = getPossibleGender(pokemonInfo)
                return removeBallsOutsideScope(pokemonInfo, ballScope, {}, undefined)
            } else {
                return undefined
            }
        }).filter(mon => mon !== undefined)
    )
}

class Collection {
    constructor (collectionInfo, newCollectionInfo) {
        //collectionInfo is pretty much 1:1 obj of database info. this is if im retrieving an instance from the database and want to do class operations
        //on it (which requires re-initiating a new instance of the collection class)
        const {ownedPokemonList, remakeList, gen, pokemonScope, ballScope, excludedCombos, options, customSort, collectionName, owner} = newCollectionInfo
        this.owner = owner
        this.type = 'aprimon'
        this.name = collectionName
        this.gen = gen
        this.options = options
        this.trades = []
        this.ownedPokemon = ((ownedPokemonList !== undefined && remakeList) || (ownedPokemonList === undefined)) ? setOwnedPokemonList(gen, pokemonScope, ballScope, excludedCombos, false, ownedPokemonList !== undefined ? ownedPokemonList : false)
                                .flat()
                                .filter(e => e !== undefined)
                                .sort((a, b) => customSortCollectionListLogic(a, b, customSort, true)) 
                                : ownedPokemonList.map((mon) => {return {name: mon.name, natDexNum: mon.natDexNum, gen: mon.gen, balls: mon.balls}})
                                // .sort((a, b) => a.natDexNum > b.natDexNum ? 1 : -1)
                                // .sort((a, b) => {
                                //     const num1 = a.natDexNum
                                //     const num2 = b.natDexNum
                                //     if (num1 === num2) {
                                //         if (a.name.includes(" ") && b.name.includes(" ")) {
                                //             return a.name === "Mr. Mime" ? -1 : a.name.localeCompare(b.name)
                                //         } else if (b.name.includes(" ")){
                                //             return -1
                                //         } else {
                                //             return 1
                                //         }
                                //     } 
                                // })
        this.onHand = []
    }
}

export default Collection

export {setOwnedPokemonList, getIndividualPokemonInfo}

