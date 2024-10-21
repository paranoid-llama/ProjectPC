import { collectionSubTypes, apriballs, tradePreferenceDisplay, items as totalItems, apriballLiterals } from "../../common/infoconstants/miscconstants.mjs";
import allPokemon from "../../utils/aprimonAPI/allpokemoninfo.js";
import mongoose from "mongoose";
import User from '../../models/users.js'
import frontendToApiNameFormat from "../../utils/misc/frontendtoapiname.js";

const allPokemonNames = allPokemon.map(p => p.info.special !== undefined ? [p.name.toLowerCase(), p.info.special.child.name.toLowerCase()] : p.name.toLowerCase()).flat()
const allPokemonDexNums = allPokemon.map(p => p.info.special !== undefined ? [p.info.natDexNum, p.info.special.child.natDexNum] : p.info.natDexNum).flat()

export function validateNewOnHand(req, res, next) {
    const {newOnHand, editType} = req.body

    if (editType === 'addOnHand') {
        if (Array.isArray(newOnHand)) {
            const validatedOh = []
            newOnHand.forEach(p => {
                const pokemonIdx = allPokemonNames.map(pName => p.name.toLowerCase().includes(pName)).indexOf(true)
                const validatedPokemon = pokemonIdx !== -1
                const validQty = p.qty > 0 && p.qty <= 999
                const rightNatDexNum = pokemonIdx !== -1 && allPokemonDexNums[pokemonIdx] === p.natDexNum
                const validApriball = apriballs.includes(p.ball)
                const validPoke = validatedPokemon && validQty && rightNatDexNum && validApriball
                validatedOh.push(validPoke ? true : false)
            })
            if (validatedOh.includes(false)) {
                const exception = new Error()
                exception.name = 'Bad Request'
                exception.message = "One of the on-hand pokemon information is invalid."
                exception.status = 400
                return res.status(400).send(exception)
            } 
        } else {
            const pokemonSpeciesName = frontendToApiNameFormat(newOnHand.name).toLowerCase()
            const pokemonIdx = allPokemonNames.map(pName => pokemonSpeciesName === pName.toLowerCase()).indexOf(true)
            const validatedPokemon = pokemonIdx !== -1
            const validQty = newOnHand.qty > 0 && newOnHand.qty <= 999
            const rightNatDexNum = pokemonIdx !== -1 && allPokemonDexNums[pokemonIdx] === newOnHand.natDexNum
            const validApriball = apriballs.includes(newOnHand.ball)
            const validPoke = validatedPokemon && validQty && rightNatDexNum && validApriball
        
            if (!validPoke) {
                const exception = new Error()
                exception.name = 'Bad Request'
                exception.message = "The on-hand pokemon information is invalid."
                exception.status = 400
                return res.status(400).send(exception)
            } 
        } 
    } 
    
    next()
}

export default async function validateNewCollectionData(req, res, next) {
    const {ownedPokemonList, remakeList, gen, pokemonScope, ballScope, excludedCombos, options, customSort, collectionName, owner} = req.body.newCollectionInfo
    const isValidOwnerId = mongoose.Types.ObjectId.isValid(owner)
    const collectionOwner = !isValidOwnerId ? null : await User.findById(owner)

    const validatedOwnedPokemonList = ownedPokemonList === undefined || (Array.isArray(ownedPokemonList) && ownedPokemonList.length >= 1)
    const validatedRemakeList = typeof remakeList === 'boolean'
    const validatedGen = collectionSubTypes.aprimon.value.includes(gen)

    const validatedScopes = validateScopes(pokemonScope, ballScope, excludedCombos)
    const validatedOptions = validateOptions(options, ballScope, gen === 'home')
    const validatedCustomSort = Array.isArray(customSort)
    const validatedCollectionName = typeof collectionName === 'string' && collectionName.length <= 60
    const validatedOwnerId = collectionOwner !== null

    // console.log(validatedGen)
    // console.log(validatedScopes)
    // console.log(validatedOptions)
    // console.log(validatedCustomSort)
    // console.log(validatedCollectionName)
    // console.log(validatedOwnerId)
    const allValidated = validatedOwnedPokemonList && validatedRemakeList && validatedGen && validatedScopes && validatedOptions && validatedCustomSort && validatedCollectionName && validatedOwnerId
    if (!allValidated) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = "One or multiple input fields were invalid."
        exception.status = 400
        return res.status(400).send(exception)
    }
    next()
}

function validateScopes(pokeScope, ballScope, excludedCombos) {
    let totalScopeNum = 0
    const pokeScopeIsObj = typeof pokeScope === 'object' && !Array.isArray(pokeScope)
    const valuesAreObjsOfArrsOrArrs = pokeScopeIsObj && 
        !Object.keys(pokeScope).map(key => {
            const isValid = Array.isArray(pokeScope[key]) 
            const isObj = typeof pokeScope[key] === 'object' && !Array.isArray(pokeScope[key])
            if (isObj) {
                const isValidSubKeys = !Object.keys(pokeScope[key]).map(subKey => Array.isArray(pokeScope[key][subKey])).includes(false)
                return isValidSubKeys
            }
            return isValid
        }).includes(false)
    if (pokeScopeIsObj && valuesAreObjsOfArrsOrArrs) {
       Object.keys(pokeScope).forEach(group => {
            const hasSubGroup = typeof pokeScope[group] === 'object' && !Array.isArray(pokeScope[group])
            if (hasSubGroup) {
                Object.keys(pokeScope[group]).forEach(subGroup => {
                    totalScopeNum += pokeScope[group][subGroup].length
                })
            } else {
                totalScopeNum += pokeScope[group].length
            }
        }) 
    }
    
    //this validation does NOT check if the pokemon in the pokeScope are actually valid pokemon, 
    //but it doesnt really matter since if there's no match for a pokemon scope it wont include the pokemon anyway (no error)
    const validatedPokeScope = pokeScopeIsObj && valuesAreObjsOfArrsOrArrs && totalScopeNum >= 1
    const validatedBallScope = ballScope.length <= 11 && !ballScope.map(ball => apriballs.includes(ball)).includes(false)
    const validatedExcludedCombos = typeof excludedCombos === 'object' && !Array.isArray(excludedCombos)

    return validatedPokeScope && validatedBallScope && validatedExcludedCombos
}

function validateOptions(options, ballScope, homeCol) {
    const {collectingBalls, globalDefaults, sorting, tradePreferences} = options
    const validatedCollectingBalls = !collectingBalls.map(ball => ballScope.includes(ball)).includes(false) && collectingBalls.length === ballScope.length
    const validatedGlobalDefaults = Object.keys(globalDefaults).includes('isHA') && typeof globalDefaults.isHA === 'boolean' && (globalDefaults.emCount === undefined ? true : typeof globalDefaults.emCount === 'number')
    const validatedTradePreferences = validateTradePreferences(tradePreferences, homeCol)
    const validatedSortingOpts = validateSortingOpts(sorting)
    // console.log(validatedCollectingBalls)
    // console.log(validatedGlobalDefaults)
    // console.log(validatedTradePreferences)
    // console.log(validatedSortingOpts)
    return validatedCollectingBalls && validatedTradePreferences && validatedGlobalDefaults && validatedSortingOpts
}

const sortingKeys = ['NatDexNumL2H', 'NatDexNumH2L', 'A2Z', 'Z2A']

function validateSortingOpts(sortingOpts) {
    const {collection, onhand} = sortingOpts
    const rightTypes = typeof collection === 'object' && typeof onhand === 'object' && !Array.isArray(collection) && !Array.isArray(onhand)
    if (!rightTypes) {
        return false
    }
    const validatedCollectionSorting = (collection.default !== undefined && sortingKeys.includes(collection.default)) && (collection.reorder !== undefined && typeof collection.reorder === 'boolean')
    const validatedOnhandSorting = (onhand.default !== undefined && sortingKeys.includes(onhand.default)) && (onhand.reorder !== undefined && typeof onhand.reorder === 'boolean') &&
        (onhand.ballOrder !== undefined && Array.isArray(onhand.ballOrder) && !onhand.ballOrder.map(ball => apriballs.includes(ball)).includes(false)) &&
        (onhand.sortFirstBy === 'pokemon' || onhand.sortFirstBy === 'ball')
    return validatedCollectionSorting && validatedOnhandSorting
}

function validateTradePreferences(tradePreferences, homeCol) {
    const {status, rates, size, onhandOnly, items, lfItems, ftItems} = tradePreferences

    const validatedStatus = status === undefined ? false : Object.keys(tradePreferenceDisplay.status).includes(status)
    const validatedRates = rates === undefined ? false : validateRates(rates)
    const validatedSize = size === undefined ? false : Object.keys(tradePreferenceDisplay.size).includes(size)
    const validatedOnHandOnly = onhandOnly === 'yes' || onhandOnly === 'no' || onhandOnly === 'preferred'
    const validatedItems = (homeCol && items === undefined) ? false : (Object.keys(tradePreferenceDisplay.items).includes(items) || items === 'none')
    const validatedLfItems = (homeCol && lfItems === undefined) ? true : (Array.isArray(lfItems) && !lfItems.map(item => totalItems.filter(i => i.value === item).length !== 0).includes(false))
    const validatedFtItems = (homeCol && ftItems === undefined) ? true : (typeof ftItems === 'object' && !Array.isArray(ftItems) &&
        !Object.keys(ftItems).map(item => totalItems.filter(i => i.value === item).length !== 0).includes(false) &&
        !Object.values(ftItems).map(qty => qty >= 0 && qty <= 999).includes(false))
    return validatedStatus && validatedRates && validatedSize && validatedOnHandOnly && validatedItems && validatedLfItems && validatedFtItems
}

const ratePokeItems = ['On-Hand HA Aprimon', 'HA Aprimon', 'On-Hand Non-HA Aprimon', 'Non-HA Aprimon', 'Wishlist Aprimon']
const rateTotalItemsStep = totalItems.map(item => apriballLiterals.includes(item.value) ? 'Apriballs' : item.display)
const rateTotalItems = rateTotalItemsStep.filter((item, idx) => rateTotalItemsStep.indexOf(item) === idx)

function validateRates(rates) {
    const {pokemonOffers, itemOffers} = rates

    const validatedPokemonOffers = Array.isArray(pokemonOffers) && !pokemonOffers.map(indRate => {
        const isRightType = typeof indRate === 'object' && !Array.isArray(indRate)
        const hasRightKeys = isRightType && Object.keys(indRate).length === 2 && indRate.items !== undefined && indRate.rate !== undefined
        const childrenAreRightType = hasRightKeys && Array.isArray(indRate.items) && Array.isArray(indRate.rate)
        if (childrenAreRightType) {
            const validatedRateItems = !indRate.items.map(rItem => ratePokeItems.includes(rItem)).includes(false)
            const validatedRateQty = !indRate.rate.map(rQty => typeof rQty === 'number' && rQty >= 1 && rQty <= 15).includes(false)
            return validatedRateItems && validatedRateQty
        } else {
            return false
        }
    }).includes(false)
    const validatedItemOffers = itemOffers === undefined ? true : (Array.isArray(itemOffers) && !itemOffers.map(indRate => {
        const isRightType = typeof indRate === 'object' && !Array.isArray(indRate)
        const hasRightKeys = isRightType && Object.keys(indRate).length === 2 && indRate.items !== undefined && indRate.rate !== undefined
        const childrenAreRightType = hasRightKeys && Array.isArray(indRate.items) && Array.isArray(indRate.rate)
        if (childrenAreRightType) {
            const validatedRateItems = !indRate.items.map(rItem => ratePokeItems.includes(rItem) || rateTotalItems.includes(rItem)).includes(false)
            const validatedRateQty = !indRate.rate.map(rQty => typeof rQty === 'number' && rQty >= 1 && rQty <= 15).includes(false)
            return validatedRateItems && validatedRateQty
        } else {
            return false
        }
    }).includes(false))

    return validatedPokemonOffers && validatedItemOffers
}