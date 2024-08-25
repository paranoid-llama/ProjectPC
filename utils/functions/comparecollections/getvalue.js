import { valueDefaults } from "../../../common/infoconstants/miscconstants.mjs";

//this function takes the rates and finds the tradee's proposed value of different items in units of HA Aprimon.
//if the tradee doesn't have a specified value, it takes the trader's rate. if they dont have one, it takes the default.
export function getValue(ownerRates) {
    const proposedValues = {current: {}}
    //we loop twice as we equalize values based on if they were defined before. loop ensures all values are captured.
    //loop through ownerrates first, then user rates.
    for (let i = 0; i < 2; i++) {
        const intermediateProposedValues = findProposedValues(ownerRates, proposedValues.current)
        proposedValues.current = intermediateProposedValues
    }  
    const finalValues = proposedValues.current
    return finalValues
}

const findProposedValues = (rates, currProposedValues, skip, skip2) => {
    const intermediateProposedValues = {...currProposedValues}
    rates.pokemonOffers.forEach(rateData => {
        //canDefineRate not only checks for HA Aprimon but also if there was another defined rate for the item. to ensure no rates are left behind,
        //we loop the forEach to happen twice.
        const duplicateItems = rateData.items[0] === rateData.items[1]
        const bothItemsDefinedAlready = rateData.items.filter(i => intermediateProposedValues[i] === undefined).length === 0
        const oneItemIsHAAp = rateData.items.includes('HA Aprimon')
        const canDefineRate = (!duplicateItems && !bothItemsDefinedAlready) && (oneItemIsHAAp || (rateData.items.map((i, idx) => intermediateProposedValues[i] === undefined).includes(true)))
        if (canDefineRate) {
            const undefinedItemValue = rateData.items.filter(i => (intermediateProposedValues[i] === undefined && i !== 'HA Aprimon'))[0]
            if (undefinedItemValue === undefined) {return}
            const isSkipRate = undefinedItemValue === skip || undefinedItemValue === skip2 //skip wishlist, onhand ha, and onhand non-ha if it's the user's rates.
            const definedItemValue = oneItemIsHAAp ? 'HA Aprimon' : rateData.items.filter(i => i !== undefinedItemValue)[0]
            const definedItemValueInHAAp = oneItemIsHAAp ? rateData.rate[rateData.items.indexOf(definedItemValue)] :
                rateData.rate[rateData.items.indexOf(definedItemValue)]*intermediateProposedValues[definedItemValue]
            const finalConvertedValue = definedItemValueInHAAp/rateData.rate[rateData.items.indexOf(undefinedItemValue)] 
            intermediateProposedValues[undefinedItemValue] = finalConvertedValue
        }
    })
    if (rates.itemOffers === undefined) {
        return intermediateProposedValues
    }
    rates.itemOffers.forEach(rateData => {
        const duplicateItems = rateData.items[0] === rateData.items[1]
        const bothItemsDefinedAlready = rateData.items.filter(i => intermediateProposedValues[i] === undefined).length === 0
        const oneItemIsHAAp = rateData.items.includes('HA Aprimon')
        const canDefineRate = (!duplicateItems && !bothItemsDefinedAlready) && (oneItemIsHAAp || (rateData.items.map((i, idx) => intermediateProposedValues[i] !== undefined).includes(true)))
        if (canDefineRate) {
            const undefinedItemValue = rateData.items.filter(i => intermediateProposedValues[i] === undefined)[0]
            const definedItemValue = oneItemIsHAAp ? 'HA Aprimon' : rateData.items.filter(i => i !== undefinedItemValue)[0]
            const definedItemValueInHAAp = oneItemIsHAAp ? rateData.rate[rateData.items.indexOf(definedItemValue)] :
                rateData.rate[rateData.items.indexOf(definedItemValue)]*intermediateProposedValues[definedItemValue]
            const finalConvertedValue = definedItemValueInHAAp/rateData.rate[rateData.items.indexOf(undefinedItemValue)] 
            intermediateProposedValues[undefinedItemValue] = finalConvertedValue
        }
    })
    return intermediateProposedValues
}

export const getValueOfSingleItem = (category, pValues) => {
    const value = category === '' ? 1 : pValues[category] === undefined ? valueDefaults[category] : pValues[category]
    return value
}