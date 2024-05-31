//this file is used for all information related to importing aprimon collections

//used to filter out breaks in spreadsheets for collection import
const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'hisui', 'paldea']
const otherGapTextValues = ['generation', 'region']
const gapIdentifiers = [...regions, ...otherGapTextValues]

//this is the accepted formats for regional form/alternate form names when importing, whether its the regional form or the original form of the pokemon. 
const regionalFormNameIdentifiers = ['alola', 'alolan', '-a', 'a-', 'galar', 'galarian', '-g', 'g-', 'hisui', 'hisuian', '-h', 'h-', 'paldea', 'paldean', '-p', 'p-']
const originalRegionalFormNameIdentifiers = ['kanto', 'kantonian', '-k', 'k-', 'johto', 'johtonian', '-j', 'j-', 'hoenn', 'hoennian', '-h', 'h-', 'unova', 'unovan', '-u', 'u-']

//these are additional original region identifiers which may be allowed for specific pokemon. our aprimon collection creator technically doesnt allow alolan decidueye
//to be collected, but this will be useful for other types of collections like living dex and is overall the way going forward for pokemon of regions that have 
//regional forms (alola+) that get a regional form in a later gen, since we cant include it in the originalRegionalFormNameIdentifiers arr else it messes things up
//for other pokemon
//object key is in the name format as appears in our collection creation.
const additionalOriginRegionalFormNameIdentifiers = {
    'Decidueye': ['alolan', '-a', 'a-']
}

//below is dexnums that are allowed to be duplicate. used for importing collections to check if theres unauthorized overlaps to give the user a warning.
const allowedAprimonMultipleDexNums = [19, 27, 37, 50, 52, 58, 74, 77, 79, 83, 88, 100, 122, 128, 144, 145, 146, 194, 211, 215, 222, 263, 554, 562, 570, 618, 412, 422, 550, 585, 666, 669, 710, 741, 744, 774, 854, 869, 876, 931, 978, 1012]
//this one relates to the first one as the number of allowed duplicates.
const allowedAprimonDuplicateNum = [2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 4, 19, 5, 4, 4, 2, 7, 2, 63, 2, 4, 3, 2]

//these are alt form pokemon with first letter allowed (no overlap). If a new form is introduced to any of these mons and screws it up this needs to be updated
const firstLetterAllowedAltForms = ['Nidoran♂', 'Nidoran♀', 'Burmy', 'Shellos', 'Basculin', 'Flabébé', 'Minior', 'Sinistea', 'Indeedee', 'Squawkabilly', 'Tatsugiri', 'Poltchageist']

// below block is used for front end display to show certain info, as well as form template

const aprimonGeneralIdentifiers = [
    // {category: 'Original Form of Regional Form Pokemon', id: 'None (Cannot have an identifier with their original region)', canFirstLetter: false},
    {category: 'Regional Forms', id: 'Region Name (or with -an suffix)', canFirstLetter: true},
    {category: 'Alternate Forms', id: 'Form Identifier', canFirstLetter: true},
    // {category: 'Paldean Tauros', imgLink: '128-p', id: 'Breed Name', canFirstLetter: false},
]
const aprimonSpecificIdentifiers = [
    // {category: 'Regional Forms', id: 'Region Name (or with -an suffix)', canFirstLetter: true},
    {category: 'Nidoran', imgLink: ['029', '032'], id: 'Gender', canFirstLetter: true},
    {category: 'Paldean Tauros', imgLink: ['128-p', '128-p-a', '128-p-b'], id: 'Breed Name', canFirstLetter: false},
    {category: 'Burmy', imgLink: ['412-p', '412-s', '412-t'], id: 'Cloak Name', canFirstLetter: true},
    {category: 'Shellos', imgLink: ['422-e', '422-w'], id: 'Sea Name', canFirstLetter: true},
    {category: 'Basculin', imgLink: ['550-r', '550-b', '550-w'], id: 'Stripe Color', canFirstLetter: true},
    {category: 'Deerling', imgLink: ['585-win', '585-aut', '585-spr', '585-sum'], id: 'Season Name', canFirstLetter: false},
    {category: 'Vivillon', imgLink: ['666'], id: 'Pattern Name', canFirstLetter: false},
    {category: 'Flabébé', imgLink: ['669-w', '669-y', '669-r', '669-b', '669-o'], id: 'Flower Color', canFirstLetter: true},
    {category: 'Pumpkaboo', imgLink: ['710'], id: 'Size', canFirstLetter: false},
    {category: 'Rockruff', imgLink: ['744'], id: "'Dusk' or 'Own Tempo'", canFirstLetter: false}, 
    {category: 'Oricorio', imgLink: ['741-p', '741-b', '741-s', '741-pau'], id: 'Style Name', canFirstLetter: false},
    {category: 'Minior', imgLink: ['774-r', '774-o', '774-y', '774-g', '774-b', '774-i', '774-v'], id: 'Core Color', canFirstLetter: true},
    {category: 'Sinistea', imgLink: ['854'], id: 'Authenticity (Phony / Antique)', canFirstLetter: true},
    {category: 'Alcremie', imgLink: ['869'], id: 'Sweet and Cream/Swirl Names', canFirstLetter: false},
    {category: 'Indeedee', imgLink: ['876-f', '876-m'], id: 'Gender', canFirstLetter: true},
    {category: 'Squawkabilly', imgLink: ['931-w', '931-y', '931-g', '931-b'], id: 'Plumage Color', canFirstLetter: true},
    {category: 'Tatsugiri', imgLink: ['978-s', '978-d', '978-c'], id: 'Form Name', canFirstLetter: true},
    {category: 'Poltchageist', imgLink: ['1012'], id: 'Authenticity (Counterfeit / Artisan)', canFirstLetter: true}
]
//other info to include with the associated field
const aprimonAsideInfo = {
    ['Alternate Forms']: {id: "The part of the alternate form name that differentiates it from its other alternate forms. E.g. Minior's Core Color", canFirstLetter: 'Deerling, Pumpkaboo/Gourgeist, Rockruff-Dusk, and Oricorio. See detailed list for more info'},
    ['Nidoran']: {id: 'Can do gender symbol instead'},
    ['Paldean Tauros']: {id: 'You do not need an identifier for Combat Breed. Also, you can name the breeds "Fire" and "Water" if wanted.'},
    ['Deerling']: {canFirstLetter: 'Multiple form names have the same first letter'},
    ['Vivillon']: {canFirstLetter: 'Too many forms'},
    ['Pumpkaboo']: {canFirstLetter: 'Multiple form names have the same first letter'},
    ['Rockruff']: {id: 'Do not have an identifier for the original form!', canFirstLetter: 'Two different naming conventions'},
    ['Oricorio']: {canFirstLetter: 'Multiple form names have the same first letter'},
    ['Alcremie']: {id: 'Must include "Cream" and "Swirl" in the names', canFirstLetter: 'Too many forms'},
    ['Sinistea']: {id: 'You do not need an identifier for the Phony form'},
    ['Indeedee']: {id: 'Can do gender symbol instead'},
    ['Poltchageist']: {id: 'You do not need an identifier for the Counterfeit form'}
}
const generalImportFormTemplate = {
    spreadsheetId: '',
    sheetName: '',
    rowSpan: {from: '', to: ''}
}
const aprimonImportFormTemplate = {
    ...generalImportFormTemplate,
    dexNumCol: '',
    nameCol: '',
    ballColSpan: {from: '', to: '', order: []},
    haImport: {import: false, assumeAll: true},
    emImport: {import: false}
}

export {
    regions, gapIdentifiers, regionalFormNameIdentifiers, originalRegionalFormNameIdentifiers, 
    additionalOriginRegionalFormNameIdentifiers, allowedAprimonMultipleDexNums, allowedAprimonDuplicateNum, firstLetterAllowedAltForms,
    aprimonGeneralIdentifiers, aprimonSpecificIdentifiers, aprimonAsideInfo,
    aprimonImportFormTemplate
}