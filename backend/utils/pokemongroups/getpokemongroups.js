import allPokemon from "../aprimonAPI/allpokemoninfo.js"
import { capitalizeFirstLetter } from "../../../frontend/utils/functions/misc.js"
import { getImgLink } from "../schemavirtuals/collectionvirtuals.js"
import { handleAlternateForms, handleRegionalForms, handleIncenseAndBabyMons, setOwnedBallList } from "../CreateCollection/functions.js"
import { getGenNum } from "../infogathering/gens.js"

function getPokemonTypes (gen) {
    const genNum = getGenNum(gen)
    const hasGame = genNum === 8
    const parsedGen = `gen${genNum}`
    const pokemonTypes = allPokemon.map((p) => {
        const isInGen = hasGame ? (p.specificGenInfo.gen8 !== undefined && p.specificGenInfo.gen8.balls[gen] !== undefined) : p.specificGenInfo[parsedGen] !== undefined
        if (isInGen) {
            const {childName, adultChildType, childNatDexNum, childGen, adultName, adultNatDexNum, adultGen, pokename, pokeNatDexNum, pokeGen} = handleIncenseAndBabyMons(p)
            const originalPokemon = pokename === undefined ? {
                name: adultName,
                natDexNum: adultNatDexNum,
                gen: adultGen,
                type: 'babyAdultMons',
                nestedType: `${adultChildType}Adults`
            } : {
                name: pokename,
                natDexNum: pokeNatDexNum,
                gen: pokeGen,
            }
            const childPokemon = childName !== undefined ? {
                name: childName, 
                natDexNum: childNatDexNum,
                gen: childGen,
                type: 'babyAdultMons',
                nestedType: `${adultChildType}Babies`
            } : {}
            const ballLegality = hasGame ? p.specificGenInfo[parsedGen].balls[gen] : p.specificGenInfo[parsedGen].balls
            if (p.info.alternateForm !== undefined) { 
                const breedableAltForm = p.info.alternateForm.nonBreedable === undefined
                if ((breedableAltForm && p.info.alternateForm.originalIsForm) || p.info.alternateForm.interchangeable !== undefined) { 
                    if (p.info.alternateForm.interchangeable !== undefined) {
                        originalPokemon.type = 'alternateForms'
                        originalPokemon.nestedType = 'interchangeable'
                    } else {
                        originalPokemon.type = 'breedables'
                        originalPokemon.nestedType = 'regular'
                    }
                    return [{...originalPokemon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}, handleAlternateForms(p, {}, pokename, genNum, true, true).map(mon => {return {...mon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}})]
                }
                const multiplePokemon = handleAlternateForms(p, {}, pokename, genNum, true, true)
                return multiplePokemon.map((mon) => {return {...mon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}})
            }
            if (p.info.regionalForm !== undefined && gen !== "bdsp") {
                if (childPokemon.name === undefined){
                    originalPokemon.type = 'breedables'
                    originalPokemon.nestedType = 'regular'
                }
                const multiplePokemon = handleRegionalForms(p, {}, pokename === undefined ? adultName : pokename, genNum, childPokemon.name ? [originalPokemon, childPokemon] : [originalPokemon], true, true)
                if (p.info.legendary === true) {
                    multiplePokemon.forEach(p => {
                        p.type = 'legendaries'
                        if (p.nestedType !== undefined) {
                            delete p.nestedType
                        }
                    })
                }
                return multiplePokemon.map((mon) => {return {...mon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}})
            }
            if (p.info.nonBreedable === true) {
                originalPokemon.type = 'nonBreedables'
                if (p.info.ultraBeast !== undefined) {
                    originalPokemon.nestedType = 'ultraBeasts'
                } else if (p.info.paradoxPokemon !== undefined) {
                    originalPokemon.nestedType = 'paradoxPokemon'
                } else {
                    originalPokemon.nestedType = 'regular'
                }
            } else if (p.info.evolvedRegionalForm) {
                originalPokemon.type = 'evolvedRegionals'
            } else if (p.info.legendary) {
                originalPokemon.type = 'legendaries'
            } else if (childPokemon.name === undefined) {
                originalPokemon.type = 'breedables'
                originalPokemon.nestedType = 'regular'
            }

            return childPokemon.name ? 
                [
                    {...originalPokemon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}, 
                    {...childPokemon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}
                ] : 
                {...originalPokemon, legalBalls: setOwnedBallList(parsedGen, ballLegality, p, true)}
        } else {
            return undefined
        }
    }).filter(p => p !== undefined).flat().flat().flat()
    return pokemonTypes
}

function getPokemonGroups (gen) {
    const genNum = getGenNum(gen)
    const parsedGen = `gen${genNum}`
    const pokemonTypes = getPokemonTypes(gen)
    const isBDSP = genNum === 8 && gen === 'bdsp'
    const isSWSH = genNum === 8 && gen === 'swsh'
    const isRegularGen7UpGame = genNum >= 7 && gen !== 'bdsp'
    const noRegionalForms = genNum === 6 || gen === 'bdsp'

    //nonbreedables groups includes regular, ultrabeasts, and paradox. this filters in case nonBreedables have no groups
    const noOtherNonBreedableSubs = genNum === 6 || gen === 'bdsp'
    
    // const pokemonGroups = {
    //     breedables: isRegularGen7UpGame ? {regular: [], regionalForms: []} : {regular: []},
    //     nonBreedables: (pokemonGen === 7 || isSWSH) ? {regular: [], ultraBeasts: []} : pokemonGen === 9 ? {regular: [], paradox: []} : {regular: []}

    // }
    const pokemonGroups = {
        // breedables: {regular: [], regionalForms: []},
        // nonBreedables: {regular: [], ultraBeasts: [], paradoxPokemon: []},
        // alternateForms: {breedable: [], nonBreedable: [], interchangeable: [], vivillon: [], alcremie: []},
        // babyAdultMons: {regularAdults: [], regularBabies: [], incenseAdults: [], incenseBabies: []},
        // legendaries: [],
        // evolvedRegionals: []
        //left empty so we can fill the fields in the function below
    }
    pokemonTypes.forEach((pokemon) => {
        const noSubGroupsInBreedables = noRegionalForms ? pokemon.type !== 'breedables' : true
        const noSubGroupsInNonBreedables = noOtherNonBreedableSubs ? pokemon.type !== 'nonBreedables' : true
        if (pokemonGroups[pokemon.type] === undefined) {
            if (pokemon.type === 'legendaries' || pokemon.type === 'evolvedRegionals' || (noRegionalForms && pokemon.type === 'breedables') || (noOtherNonBreedableSubs && pokemon.type === 'nonBreedables')) {
                pokemonGroups[pokemon.type] = []
            } else {
                pokemonGroups[pokemon.type] = {}
            }
        }
        if (pokemon.nestedType !== undefined && pokemonGroups[pokemon.type][pokemon.nestedType] === undefined && noSubGroupsInBreedables && noSubGroupsInNonBreedables) {
            pokemonGroups[pokemon.type][pokemon.nestedType] = []
        }
        if (pokemon.nestedType !== undefined && noSubGroupsInBreedables && noSubGroupsInNonBreedables) {
            pokemonGroups[pokemon.type][pokemon.nestedType].push({name: pokemon.name, natDexNum: pokemon.natDexNum, gen: pokemon.gen, imgLink: getImgLink(pokemon), legalBalls: pokemon.legalBalls})
        } else {
            pokemonGroups[pokemon.type].push({name: pokemon.name, natDexNum: pokemon.natDexNum, gen: pokemon.gen, imgLink: getImgLink(pokemon), legalBalls: pokemon.legalBalls})
        }
    })
    return pokemonGroups
}

export {getPokemonGroups}