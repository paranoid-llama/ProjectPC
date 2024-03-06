const gen1Info = require('./../routes/aprimonAPI/gen1/gen1info')
const gen2Info = require('./../routes/aprimonAPI/gen2/gen2info')
const gen3Info = require('./../routes/aprimonAPI/gen3/gen3info')
const gen4Info = require('./../routes/aprimonAPI/gen4/gen4info')
const gen5Info = require('./../routes/aprimonAPI/gen5/gen5info')
const gen6Info = require('./../routes/aprimonAPI/gen6/gen6info')
const gen7Info = require('./../routes/aprimonAPI/gen7/gen7info')
const gen8Info = require('./../routes/aprimonAPI/gen8/gen8info')
const gen9Info = require('./../routes/aprimonAPI/gen9/gen9info')
const {handleAlternateForms, setBallInfo} = require('./CreateCollection/functions.js')


function setOwnedPokemonList(gen, includeBabyMon, includeIncenseMon, interchangeableAltForms) {
    return (
        allPokemon.map((pokemon) => {
            const parsedGen = gen === 'swsh' || gen === 'bdsp' ? 8 : parseInt(gen)
            const game = gen === 'swsh' || gen === 'bdsp' ? gen : ""
            const formattedGen = `gen${parsedGen}`
            if (pokemon.specificGenInfo[formattedGen] && pokemon.info.nonBreedable === undefined) {
                if (game !== '' && pokemon.specificGenInfo[formattedGen].balls[game] === undefined) {
                    return
                }
                const balls = pokemon.specificGenInfo[formattedGen].balls
                const ownedBallList = {}

                function checkIfBabyOrIncenseMon(pokemon, includeBabyMon, includeIncenseMon) {
                    if (pokemon.info.special === undefined) {
                        const pokename = pokemon.name === 'mr. mime' ? 
                                        'Mr. Mime': 
                                        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
                        const pokeNatDexNum = pokemon.info.natDexNum
                        const pokeGen = pokemon.gen
                        return { pokename, pokeNatDexNum, pokeGen }
                    }
                    if (pokemon.info.special.hasBabyMon === true && includeBabyMon === true) { //change if logic here if wanted to exclude certain pokemon
                        const child = pokemon.info.special.child
                        const pokename = child.name.charAt(0).toUpperCase() + child.name.slice(1)
                        const pokeNatDexNum = pokemon.info.special.child.natDexNum
                        const pokeGen = pokemon.info.special.child.gen
                        return { pokename, pokeNatDexNum, pokeGen }
                    } else if (pokemon.info.special.incenseMon === true && includeIncenseMon === true) { //change if logic here if wanted to exclude certain pokemon
                        const child = pokemon.info.special.child
                        const pokename = child.name === 'mime jr.' ? 
                                            'Mime Jr.' : 
                                            child.name.charAt(0).toUpperCase() + child.name.slice(1)
                        const pokeNatDexNum = pokemon.info.special.child.natDexNum
                        const pokeGen = pokemon.info.special.child.gen
                        return { pokename, pokeNatDexNum, pokeGen }
                    }
                }

                function checkLegality(ball, balls) {
                    const apriballList = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
                    if (ball === 'apriball' && balls.apriball.isLegal === true) {
                        apriballList.map((b) => {
                            ownedBallList[b] = setBallInfo(pokemon, formattedGen)
                        })
                    } else if (balls[ball].isLegal === true) {
                        ownedBallList[ball] = setBallInfo(pokemon, formattedGen)
                    }
                    else {
                        return
                    }
                }

                function checkLegalityGen8(game, ball, balls) {
                    const apriballList = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
                    if (ball === 'apriball' && balls[game].apriball.isLegal === true) {
                        apriballList.map((b) => {
                            ownedBallList[b] = setBallInfo(pokemon, formattedGen)
                        })
                    } else if (balls[game][ball].isLegal === true) {
                        ownedBallList[ball] = setBallInfo(pokemon, formattedGen)
                    }
                    else {
                        return
                    }
                }

                if (game === "") {
                    checkLegality('apriball', balls)
                    checkLegality('beast', balls)
                    checkLegality('dream', balls)
                    checkLegality('safari', balls)
                    checkLegality('sport', balls)
                } else {
                    checkLegalityGen8(game, 'apriball', balls)
                    checkLegalityGen8(game, 'beast', balls)
                    checkLegalityGen8(game, 'dream', balls)
                    checkLegalityGen8(game, 'safari', balls)
                    checkLegalityGen8(game, 'sport', balls)
                }

                const {pokename, pokeNatDexNum, pokeGen} = checkIfBabyOrIncenseMon(pokemon, includeBabyMon, includeIncenseMon)

                const originalPokemon = {
                    name: pokename ,
                    nickname: '',
                    natDexNum: pokeNatDexNum,
                    gen: pokeGen,
                    balls: ownedBallList
                }

                if (pokemon.info.alternateForm) {
                    if (pokename === ('Deerling' || 'Oricorio') && interchangeableAltForms === false) { //Yes, you can change deerling forms in scarlet/violet 
                        return originalPokemon
                    }
                    if (pokename === 'Rockruff') { //handleAltForms func returns diff alternate forms of pokemon but not the original. 
                        return [originalPokemon, handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen)]
                    }
                    return handleAlternateForms(pokemon, ownedBallList, pokename, parsedGen) 
                }

                if (pokemon.info.regionalForm !== undefined && game !== "bdsp") { //BDSP doesn't allow regional variants to be transferred over from HOME
                    const multiplePokemon = [originalPokemon]
                    if (pokemon.name === 'tauros' && parsedGen === 9) {
                        pokemon.info.regionalForm.forms.map((regionF) => {
                            multiplePokemon.push(
                                {
                                    name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                                    nickname: '',
                                    natDexNum: pokemon.info.natDexNum,
                                    gen: pokemon.gen,
                                    balls: ownedBallList
                                },
                                {
                                    name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + " " + `(${regionF.special[0]})`,
                                    nickname: '',
                                    natDexNum: pokemon.info.natDexNum,
                                    gen: pokemon.gen,
                                    balls: ownedBallList
                                },
                                {
                                    name: regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1) + " " + `(${regionF.special[1]})`,
                                    nickname: '',
                                    natDexNum: pokemon.info.natDexNum,
                                    gen: pokemon.gen,
                                    balls: ownedBallList
                                },
                            )
                        })
                    } else {
                        pokemon.info.regionalForm.forms.map((regionF) => {
                            parsedGen >= regionF.gen ? 

                            multiplePokemon.push(
                            {
                                name: pokemon.name === 'mr. mime' ? 
                                        'Galarian Mr. Mime':  
                                        regionF.name + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
                                nickname: '',
                                natDexNum: pokemon.info.natDexNum,
                                gen: pokemon.gen,
                                balls: ownedBallList
                            })
                            : ""
                        })
                    }
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

const allPokemon = gen1Info.concat(
    gen2Info,
    gen3Info,
    gen4Info,
    gen5Info,
    gen6Info,
    gen7Info,
    gen8Info,
    gen9Info
) 

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

module.exports = Collection

