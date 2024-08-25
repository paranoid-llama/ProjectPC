import { regionalFormRegions, regionalFormMons, altFormNames, threeLetterShorten, genderAltFormMons } from "../../../common/infoconstants/pokemonconstants.mjs"
import { findRegionByDexNum } from "../../../common/infoconstants/miscconstants.mjs"

const specificNameCases = ['Nidoran♀', 'Nidoran♂', 'Shellos (East)', 'Shellos (West)', 'Indeedee (Male)', 'Indeedee (Female)', 'Rockruff (Dusk)']


export default function getNameDisplay(nameDisplaySettings, pokemonName, dexNum) {
    if (nameDisplaySettings === undefined) {
        return pokemonName
    }
    const isRegionalFormPokemon = regionalFormMons.map(mon => pokemonName.includes(mon)).includes(true)
    const isAlternateFormPokemon = (pokemonName.includes('(') && !pokemonName.includes('Any')) || pokemonName.includes('♀') || pokemonName.includes('♂')
    if (!isRegionalFormPokemon && !isAlternateFormPokemon) {
        return pokemonName
    } else {
        const isAlcremie = pokemonName.includes('Alcremie')
        const isVivillon = pokemonName.includes('Vivillon')
        const checkSpecificNameDisplay = pokemonName === 'Paldean Tauros' ? 'Paldean Tauros (Combat)' : 
            pokemonName.includes('Paldean Tauros') ? 'Paldean Tauros (Aqua/Blaze)' : 
            pokemonName.includes('Nidoran') ? 'Nidoran' : 
            pokemonName === 'Rockruff (Dusk)' ? 'Rockruff (Dusk)' :  
            isAlternateFormPokemon ? pokemonName.slice(0, pokemonName.indexOf(' ')) : pokemonName
        const specificSetting = nameDisplaySettings.specific[checkSpecificNameDisplay] 
        // if (nameDisplaySettings.specific[checkSpecificNameDisplay] !== undefined) {return nameDisplaySettings.specific[checkSpecificNameDisplay]}
        if (specificNameCases.includes(pokemonName)) {
            if (genderAltFormMons.map(mon => pokemonName.includes(mon)).includes(true)) {
                const useFormat = specificSetting === undefined ? (nameDisplaySettings.general.alternateForms === 'brackets-full-formname-out' ? 'brackets-full-out' : nameDisplaySettings.general.alternateForms) : specificSetting
                const species = genderAltFormMons.filter(mon => pokemonName.includes(mon))[0]
                const gender = (pokemonName.includes('♀') || pokemonName.includes('Female')) ? 'Female' : 'Male'
                if (useFormat.includes('symbol')) {
                    return getGenderedFormat(useFormat, species, gender)
                }
                return getAlternateNameFormatAfterRegional(nameDisplaySettings.general.alternateForms, species, gender, '', false)
            }
            if (pokemonName === 'Rockruff (Dusk)') {
                const formName = specificSetting === 'ability' ? 'Own Tempo' : 'Dusk'
                return getAlternateNameFormatAfterRegional(nameDisplaySettings.general.alternateForms, 'Rockruff', formName, 'Form', false, specificSetting === 'ability' ? 'OT' : undefined)
            }
            if (pokemonName.includes('Shellos')) {
                const formName = specificSetting === 'sub' ? (pokemonName.includes('East') ? 'Blue' : 'Pink') : pokemonName.slice(9, 13)
                return getAlternateNameFormatAfterRegional(nameDisplaySettings.general.alternateForms, 'Shellos', formName, 'Sea', false)
            }
        }
        if ((isRegionalFormPokemon && isAlternateFormPokemon) || pokemonName === 'Paldean Tauros') {
            //currently only applies to Paldean Tauros. I'm handling regular Combat Paldean Tauros here in case theres specific setting for Paldean Tauros to include 'Combat'
            const isThreeLetterShorten = threeLetterShorten.map(mon => pokemonName.includes(mon)).includes(true)
            const regionalFormRegion = regionalFormRegions.filter(region => pokemonName.includes(region))[0]
            const pokemonSpecies = pokemonName === 'Paldean Tauros' ? 'Tauros' : pokemonName.slice(0, pokemonName.indexOf('(')-1)
            const pokemonFormIdentifier = pokemonName === 'Paldean Tauros' ? 'Combat' : (specificSetting !== undefined && specificSetting.includes('sub')) ? (pokemonName.includes('Blaze') ? 'Fire' : 'Water') : pokemonName.slice(pokemonName.indexOf('(')+1, pokemonName.indexOf(')'))
            const pokemonFormName = pokemonName === 'Paldean Tauros' ? 'Breed' : altFormNames[pokemonSpecies]
            const trueRegionalFormat = nameDisplaySettings.general.regionalForms //used other logic here but changed

            //other breeds of tauros just have 'sub' for specific setting to indicate using fire/water, but combat breed has full format name in specific setting to indicate how to format 'Combat'.
            const trueAltFormat = (specificSetting === undefined || specificSetting === 'sub') ? nameDisplaySettings.general.alternateForms : specificSetting 

            const regionalFormat = nameDisplaySettings.general.regionalForms === 'default' ? (pokemonName === 'Paldean Tauros' ? 'Paldean Tauros' : `${pokemonSpecies}`) : getRegionalNameFormat(trueRegionalFormat, pokemonName === 'Paldean Tauros' ? 'Paldean Tauros' : pokemonSpecies)
            if ((pokemonName === 'Paldean Tauros' && (specificSetting === undefined))) {return regionalFormat}
            return getAlternateNameFormatAfterRegional(trueAltFormat, regionalFormat, pokemonFormIdentifier, pokemonFormName, isThreeLetterShorten)
        }
        if (isRegionalFormPokemon) {
            const isOriginRegionalPokemon = regionalFormMons.includes(pokemonName)
            if (isOriginRegionalPokemon) {
                const trueOriginFormat = specificSetting === undefined ? nameDisplaySettings.general.originRegionalForms : specificSetting
                if (trueOriginFormat === 'default') {return pokemonName}
                return getOriginRegionalNameFormat(trueOriginFormat, pokemonName, dexNum)
            }
            const trueRegionalFormat = specificSetting === undefined ? nameDisplaySettings.general.regionalForms : specificSetting
            if (trueRegionalFormat === 'default') {return pokemonName}
            return getRegionalNameFormat(trueRegionalFormat, pokemonName)
        }
        if (isAlternateFormPokemon) {
            const pokemonSpecies = pokemonName.slice(0, pokemonName.indexOf(' '))
            const trueAltFormat = specificSetting === undefined ? nameDisplaySettings.general.alternateForms : specificSetting
            if (trueAltFormat === 'default') {return pokemonName}
            if (isAlcremie) {return getAlcremieNameFormat(trueAltFormat, pokemonName)}
            return getAlternateNameFormat(trueAltFormat, pokemonName)
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
    // below is unused line
    // const trueFormat = format.includes('no-form') ? format.slice(0, format.indexOf('no-form')-1) : format //used for combat breed p-tauros specific setting to opt out of showing the 'combat'
    const trueFormat = format
    const regionalFormRegion = regionalFormRegions.filter(region => pokemonName.includes(region))[0]
    const pokemonSpecies = pokemonName.slice(pokemonName.indexOf(' ')+1, pokemonName.length)
    if (trueFormat === 'brackets-full-out' || trueFormat === 'brackets-full-formname-out') {return `${pokemonSpecies} (${regionalFormRegion})`}
    if (trueFormat === 'brackets-full-in') {return `(${regionalFormRegion}) ${pokemonSpecies}`}
    if (trueFormat === 'dash-full-out') {return `${pokemonSpecies}-${regionalFormRegion}`}
    if (trueFormat === 'dash-full-in') {return `${regionalFormRegion}-${pokemonSpecies}`}
    if (trueFormat === 'dash-short-out') {return `${pokemonSpecies}-${regionalFormRegion[0]}`}
    if (trueFormat === 'dash-short-in') {return `${regionalFormRegion[0]}-${pokemonSpecies}`}
}

const getAlternateNameFormat = (format, pokemonName, customShorten=undefined) => {
    const isThreeLetterShorten = threeLetterShorten.map(mon => pokemonName.includes(mon)).includes(true)
    const pokemonSpecies = pokemonName.slice(0, pokemonName.indexOf(' '))
    const pokemonFormIdentifier = pokemonName.slice(pokemonName.indexOf('(')+1, pokemonName.indexOf(')'))
    const pokemonFormName = altFormNames[pokemonSpecies]
    if (format === 'brackets-full-formname-out') {return `${pokemonSpecies} (${pokemonFormIdentifier} ${pokemonFormName})`}
    if (format === 'brackets-full-in') {return `(${pokemonFormIdentifier}) ${pokemonSpecies}`}
    if (format === 'dash-full-out') {return `${pokemonSpecies}-${pokemonFormIdentifier}`}
    if (format === 'dash-full-in') {return `${pokemonFormIdentifier}-${pokemonSpecies}`}
    if (format === 'dash-short-out') {return `${pokemonSpecies}-${customShorten ? customShorten : isThreeLetterShorten ? (pokemonFormIdentifier === "Pa'u" ? 'Pau' : `${pokemonFormIdentifier [0]}${pokemonFormIdentifier .slice(1, 3).toLowerCase()}`)  : pokemonFormIdentifier[0]}`}
    if (format === 'dash-short-in') {return `${customShorten ? customShorten : isThreeLetterShorten ? (pokemonFormIdentifier === "Pa'u" ? 'Pau' : `${pokemonFormIdentifier [0]}${pokemonFormIdentifier .slice(1, 3).toLowerCase()}`) : pokemonFormIdentifier[0]}-${pokemonSpecies}`}
}

const getAlternateNameFormatAfterRegional = (format, pokemonName, formIdentifier, formName, isThreeLetterShorten, customShorten=undefined) => {
    if (format === 'default') {return `${pokemonName} (${formIdentifier})`}
    if (format === 'brackets-full-formname-out') {return `${pokemonName} (${formIdentifier} ${formName})`}
    if (format === 'brackets-full-in') {return `(${formIdentifier}) ${pokemonName}`}
    if (format === 'dash-full-out') {return `${pokemonName}-${formIdentifier}`}
    if (format === 'dash-full-in') {return `${formIdentifier}-${pokemonName}`}
    if (format === 'dash-short-out') {return `${pokemonName}-${customShorten ? customShorten : isThreeLetterShorten ? `${formIdentifier[0]}${formIdentifier.slice(1, 3).toLowerCase()}` : formIdentifier[0]}`}
    if (format === 'dash-short-in') {return `${customShorten ? customShorten : isThreeLetterShorten ? `${formIdentifier[0].toUpperCase()}${formIdentifier.slice(1, 3).toLowerCase()}` : formIdentifier[0]}-${pokemonName}`}
}

const getAlcremieNameFormat = (format, pokemonName) => {
    const hasSpecificSettings = typeof format !== 'string'
    if (hasSpecificSettings) {
        // was going to do a whole algorithm for this but i couldnt be arsed ngl. no specific settings for alcremie.
    }
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
    if (format === 'dash-short-out') {return `Alcremie-${sweetName.slice(0, 3)}-${creamName.slice(0, 3)}-${creamSwirlId.slice(0, 2)}`}
    if (format === 'dash-short-in') {return `${sweetName.slice(0, 3)}-${creamName.slice(0, 3)}-${creamSwirlId.slice(0, 2)}-Alcremie`}
}

const getGenderedFormat = (format, species, gender) => {
    const Male = '♂'
    const Female = '♀'
    const symbolVar = gender === 'Male' ? Male : Female
    if (format === 'dash-symbol-out') {return `${species}-${symbolVar}`}
    if (format === 'dash-symbol-in') {return `${symbolVar}-${species}`}
    if (format === 'brackets-symbol-out') {return `${species} (${symbolVar})`}
    if (format === 'brackets-symbol-in') {return `(${symbolVar}) ${species}`}
    if (format === 'default-symbol') {return `${species}${symbolVar}`}
}