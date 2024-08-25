import { threeLetterShorten } from "../../../../../common/infoconstants/pokemonconstants.mjs";
import { regionalNameDisplayOpts, originRegionalNameDisplayOpts, altFormNameDisplayOpts, genderAltFormMons } from "../../../../../common/infoconstants/pokemonconstants.mjs";
import { altFormNames } from "../../../../../common/infoconstants/pokemonconstants.mjs";
import getNameDisplay from "../../../../../utils/functions/display/getnamedisplay";

function getButtonOptDisplay(group, formats, pokemonName) {
    const formName = group === 'alternate' ? altFormNames[pokemonName] : false
    const placeholderId = group === 'alternate' ? (formName === undefined ? (genderAltFormMons.includes(pokemonName) ? '< Gender >' : '< Form >') : `< ${formName} >`) : `< region >`
    const shortForm = group === 'alternate' ? `<f>` : '<r>'
    const nameOpts = []
    for (let format of formats) {
        if (format === 'default-regional') {nameOpts.push(`${placeholderId} ${pokemonName}`)}
        if (format === 'brackets-full-formname-out' && !(formName === undefined)) {nameOpts.push(`${pokemonName} (${placeholderId} ${formName})`)}
        if (format === 'brackets-full-out') {nameOpts.push(`${pokemonName} (${placeholderId})`)}
        if (format === 'brackets-full-in') {nameOpts.push(`(${placeholderId}) ${pokemonName}`)}
        if (format === 'dash-full-out') {nameOpts.push(`${pokemonName}-${placeholderId}`)}
        if (format === 'dash-full-in') {nameOpts.push(`${placeholderId}-${pokemonName}`)}
        if (format === 'dash-short-out') {nameOpts.push(`${pokemonName}-${shortForm}`)}
        if (format === 'dash-short-in') {nameOpts.push(`${shortForm}-${pokemonName}`)}
    }
    return nameOpts
}

export function getNameOptions(group, pokemonName, currentNameSettings) {
    const nameDisplayOpts = group === 'origin-regional' ? originRegionalNameDisplayOpts.map(opt => opt.value) : 
        group === 'regional' ? regionalNameDisplayOpts.map(opt => opt.value) : 
        group === 'alternate' && altFormNameDisplayOpts.map(opt => opt.value)
    const extraOpts = (pokemonName === 'Paldean Tauros') ? (group === 'regional' ? ['Paldean Tauros (Combat)', 'Tauros (Paldea) (Combat)', '(Combat) (Paldea) Tauros', 'Tauros-Paldea-Combat', 'Combat-Paldea-Tauros', 'Tauros-p-c', 'p-c-Tauros'] : 
                        group === 'alternate' && [`${getNameDisplay(currentNameSettings, 'Paldean Tauros')} (Fire/Water)`, `(Fire/Water) ${getNameDisplay(currentNameSettings, 'Paldean Tauros')}`, `${getNameDisplay(currentNameSettings, 'Paldean Tauros')}-<fire/water>`, `<fire/water>-${getNameDisplay(currentNameSettings, 'Paldean Tauros')}`, `${getNameDisplay(currentNameSettings, 'Paldean Tauros')}-<f/w>`, `<f/w>-${getNameDisplay(currentNameSettings, 'Paldean Tauros')}`]) : 
                        genderAltFormMons.includes(pokemonName) ? [`${pokemonName}-♂`] : []
    return [...getButtonOptDisplay(group, nameDisplayOpts, pokemonName), ...extraOpts]
}

// export function 