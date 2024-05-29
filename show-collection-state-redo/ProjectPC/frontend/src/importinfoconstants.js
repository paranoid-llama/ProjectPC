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

export {aprimonGeneralIdentifiers, aprimonSpecificIdentifiers, aprimonAsideInfo, aprimonImportFormTemplate}