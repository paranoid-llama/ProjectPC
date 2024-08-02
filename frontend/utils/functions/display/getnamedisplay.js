import { regionalFormRegions, regionalFormMons, altFormNames, threeLetterShorten } from "../../../../common/infoconstants/pokemonconstants.mjs"
import { findRegionByDexNum } from "../../../../common/infoconstants/miscconstants.mjs"

export default function getNameDisplay(nameDisplaySettings, pokemonName, dexNum) {
    if (nameDisplaySettings === undefined) {
        return pokemonName
    }
    const isRegionalFormPokemon = regionalFormMons.map(mon => pokemonName.includes(mon)).includes(true)
    const isAlternateFormPokemon = pokemonName.includes('(') || pokemonName.includes('♀') || pokemonName.includes('♂')
    if (!isRegionalFormPokemon && !isAlternateFormPokemon) {
        return pokemonName
    } else {
        const isAlcremie = pokemonName.includes('Alcremie')
        const isVivillon = pokemonName.includes('Vivillon')
        if (nameDisplaySettings.specific[pokemonName] !== undefined) {return nameDisplaySettings.specific[pokemonName]}
        if (isRegionalFormPokemon) {
            const isOriginRegionalPokemon = regionalFormMons.includes(pokemonName)
            if (isOriginRegionalPokemon) {
                if (nameDisplaySettings.general.originRegionalForms === 'default') {return pokemonName}
                return getOriginRegionalNameFormat(nameDisplaySettings.general.originRegionalForms, pokemonName, dexNum)
            }
            if (nameDisplaySettings.general.regionalForms === 'default') {return pokemonName}
            return getRegionalNameFormat(nameDisplaySettings.general.regionalForms, pokemonName)
        }
        if (isAlternateFormPokemon) {
            if (nameDisplaySettings.general.alternateForms === 'default') {return pokemonName}
            if (isAlcremie) {return getAlcremieNameFormat(nameDisplaySettings.general.alternateForms, pokemonName)}
            return getAlternateNameFormat(nameDisplaySettings.general.alternateForms, pokemonName)
        }
    }
}

const getOriginRegionalNameFormat = (format, pokemonName, dexNum) => {
    const originRegion = findRegionByDexNum(dexNum)
    const originRegionSuffixVer = findRegionByDexNum(dexNum, true)
    if (format === 'default-regional') {return `${originRegionSuffixVer} ${pokemonName}`}
    if (format === 'brackets-full-out') {return `${pokemonName} (${originRegion})`}
    if (format === 'brackets-full-in') {return `(${originRegion}) ${pokemonName}`}
    if (format === 'dash-full-out') {return `${pokemonName}-${originRegion}`}
    if (format === 'dash-full-in') {return `${originRegion}-${pokemonName}`}
    if (format === 'dash-short-out') {return `${pokemonName}-${originRegion[0]}`}
    if (format === 'dash-short-in') {return `${originRegion[0]}-${pokemonName}`}
}

const getRegionalNameFormat = (format, pokemonName) => {
    const regionalFormRegion = regionalFormRegions.filter(region => pokemonName.includes(region))[0]
    const pokemonSpecies = pokemonName.slice(pokemonName.indexOf(' ')+1, pokemonName.length)
    if (format === 'brackets-full-out') {return `${pokemonSpecies} (${regionalFormRegion})`}
    if (format === 'brackets-full-in') {return `(${regionalFormRegion}) ${pokemonSpecies}`}
    if (format === 'dash-full-out') {return `${pokemonSpecies}-${regionalFormRegion}`}
    if (format === 'dash-full-in') {return `${regionalFormRegion}-${pokemonSpecies}`}
    if (format === 'dash-short-out') {return `${pokemonSpecies}-${regionalFormRegion[0]}`}
    if (format === 'dash-short-in') {return `${regionalFormRegion[0]}-${pokemonSpecies}`}
}

const getAlternateNameFormat = (format, pokemonName) => {
    const isThreeLetterShorten = threeLetterShorten.map(mon => pokemonName.includes(mon)).includes(true)
    const pokemonSpecies = pokemonName.slice(0, pokemonName.indexOf(' '))
    const pokemonFormIdentifier = pokemonName.slice(pokemonName.indexOf('(')+1, pokemonName.indexOf(')'))
    const pokemonFormName = altFormNames[pokemonSpecies]
    if (format === 'brackets-full-formname-out') {return `${pokemonSpecies} (${pokemonFormIdentifier} ${pokemonFormName})`}
    if (format === 'brackets-full-in') {return `(${pokemonFormIdentifier}) ${pokemonSpecies}`}
    if (format === 'dash-full-out') {return `${pokemonSpecies}-${pokemonFormIdentifier}`}
    if (format === 'dash-full-in') {return `${pokemonFormIdentifier}-${pokemonSpecies}`}
    if (format === 'dash-short-out') {return `${pokemonSpecies}-${isThreeLetterShorten ? pokemonFormIdentifier.slice(0, 3).toLowerCase() : pokemonFormIdentifier[0]}`}
    if (format === 'dash-short-in') {return `${isThreeLetterShorten ? pokemonFormIdentifier.slice(0, 3).toLowerCase() : pokemonFormIdentifier[0]}-${pokemonSpecies}`}
}

const getAlcremieNameFormat = (format, pokemonName) => {
    if (format === 'brackets-full-formname-out') {return pokemonName}
    //Alcremie (Strawberry Matcha Cream)
    //         ^          ^      ^
    //      startindex   2ndspac 3rdspace
    const startIndex = pokemonName.indexOf('(') + 1
    const indexOfSecondSpace = pokemonName.indexOf(' ', startIndex)
    
    const indexOfThirdSpace = pokemonName.indexOf(' ', indexOfSecondSpace+1)
    const sweetName = pokemonName.slice(startIndex, indexOfSecondSpace)
    const creamName = pokemonName.slice(indexOfSecondSpace+1, indexOfThirdSpace)
    const creamSwirlId = pokemonName.slice(indexOfThirdSpace+1, pokemonName.indexOf(')'))

    if (format === 'brackets-full-in') {return `(${sweetName} ${creamName} ${creamSwirlId}) Alcremie`}
    if (format === 'dash-full-out') {return `Alcremie-${sweetName}-${creamName}-${creamSwirlId}`}
    if (format === 'dash-full-in') {return `${sweetName}-${creamName}-${creamSwirlId}-Alcremie`}
    if (format === 'dash-short-out') {return `Alcremie-${sweetName.slice(0, 3).toLowerCase()}-${creamName.slice(0, 3).toLowerCase()}-${creamSwirlId.slice(0, 2).toLowerCase()}`}
    if (format === 'dash-short-in') {return `${sweetName.slice(0, 3).toLowerCase()}-${creamName.slice(0, 3).toLowerCase()}-${creamSwirlId.slice(0, 2).toLowerCase()}-Alcremie`}
}