//this file stores all pokemon constant data

//regional info
const regionalFormRegions = ['Alola', 'Galar', 'Hisui', 'Paldea']
const alolanFormMons = ['Rattata', 'Raichu', 'Sandshrew', 'Vulpix', 'Diglett', 'Meowth', 'Geodude', 'Grimer', 'Exeggutor', 'Marowak']
const galarianFormMons = ['Meowth', 'Ponyta', 'Slowpoke', "Farfetch'd", 'Weezing', 'Mr. Mime', 'Corsola', 'Zigzagoon', 'Darumaka', 'Yamask', 'Stunfisk', 'Articuno', 'Zapdos', 'Moltres']
const hisuianFormMons = ['Growlithe', 'Voltorb', 'Typhlosion', 'Qwilfish', 'Sneasel', 'Samurott', 'Lilligant', 'Zorua', 'Braviary', 'Sliggoo', 'Goodra', 'Avalugg', 'Decidueye']
const paldeanFormMons = ['Tauros', 'Wooper']
//above specific regional forms above are only used to concat the large array below, which is being used. can import smaller lists if needed. 
const regionalFormMons = alolanFormMons.concat(galarianFormMons, hisuianFormMons, paldeanFormMons)
const multipleRegionalFormMons = ['Meowth']
const allAltFormMons = ['Nidoran', 'Paldean Tauros', 'Burmy', 'Shellos', 'Basculin', 'Deerling', 'Flabébé', 'Pumpkaboo', 'Rockruff', 'Oricorio', 'Minior', 'Indeedee', 'Squawkabilly', 'Tatsugiri'] //vivillon and alcremie are excluded due to being particular cases (so many forms)
const genderAltFormMons = ['Nidoran', 'Indeedee']
const interchangeableAltFormMons = ['Burmy', 'Deerling', 'Oricorio']
const interchangeableAltFormForms = {
    'Burmy': ['Plant', 'Sandy', 'Trash'],
    'Deerling': ['Spring', 'Summer', 'Autumn', 'Winter'],
    'Oricorio': ['Baile', 'Pom-Pom', "Pa'u", 'Sensu']
}
const nonBreedableAltFormMons = ['Sinistea', 'Poltchageist']
//below is needed as normally the collection is generated without these identifiers, so theres no place where its shown in the collection list 
const nonBreedableAltRegIdentifiers = {'Sinistea': 'phony', 'Poltchageist': 'counterfeit'}


//this is used for virtuals and other backend getter functions
const incenseBabiesWithExclusiveEMs = ['Azurill', 'Mantyke', 'Budew', 'Munchlax', 'Mime Jr.']
const incenseAdultsWithExclusiveEMs = ['Marill', 'Chimecho', 'Roselia', 'Snorlax']
const altFormMonsWithExclusiveEMs = ['Basculin (Red-Striped)', 'Basculin (Blue-Striped)', 'Basculin (White-Striped)', 'Indeedee (Male)', 'Indeedee (Female)']
//i specify babies of gen123 pokemon as their baby and adult forms originate from different generations. its used in one backend getter.
const babiesOfGen1Pokemon = ['Pichu', 'Igglybuff', 'Cleffa', 'Smoochum', 'Elekid', 'Magby', 'Mime Jr.', 'Happiny', 'Munchlax']
const babiesOfGen2Pokemon = ['Azurill', 'Wynaut', 'Bonsly', 'Mantyke']
const babiesOfGen3Pokemon = ['Budew', 'Chingling']

//below is primarily used for collection creation options (frontend)
const pokeBabies = ['Pichu', 'Cleffa', 'Igglybuff', 'Smoochum', 'Elekid', 'Magby', 'Togepi', 'Riolu', 'Toxel'] //tyrogue is purposefully excluded since i made it that you cannot decide to display their evolutions instead
const pokeAdults = ['Pikachu', 'Clefairy', 'Jigglypuff', 'Jynx', 'Electabuzz', 'Magmar', 'Togetic', 'Lucario', 'Toxtricity']
const pokeIncenseBabies = ['Mime Jr.', 'Happiny', 'Munchlax', 'Azurill', 'Wynaut', 'Bonsly', 'Mantyke', 'Budew', 'Chingling']
const pokeIncenseAdults = ['Mr. Mime', 'Chansey', 'Snorlax', 'Marill', 'Wobbuffet', 'Sudowoodo', 'Mantine', 'Roselia', 'Chimecho']

//below primarily used to filter out all non-breedables in comparison operators
const legendaryPokemon = [
    'Articuno', 'Galarian Articuno', 'Zapdos', 'Galarian Zapdos', 'Moltres', 'Galarian Moltres', 'Mewtwo', 'Raikou', 'Entei', 'Suicune', 'Lugia', 'Ho-oh',
    'Regirock', 'Regice', 'Registeel', 'Latias', 'Latios', 'Kyogre', 'Groudon', 'Rayquaza', 'Uxie', 'Mesprit', 'Azelf', 'Dialga', 'Palkia', 'Heatran', 'Regigigas', 'Giratina', 'Cresselia', 
    'Cobalion', 'Terrakion', 'Virizion', 'Tornadus', 'Thundurus', 'Reshiram', 'Zekrom', 'Landorus', 'Kyurem', 'Keldeo', 'Meloetta', 'Xerneas', 'Yveltal', 'Zygarde', 
    'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini', 'Solgaleo', 'Lunala', 'Necrozma', 'Zacian', 'Zamazenta', 'Eternatus', 'Kubfu', 'Regieleki', 'Regidrago', 'Glastrier', 'Spectrier', 'Calyrex',
    'Wo-Chien', 'Chien-Pao', 'Ting-Lu', 'Chi-Yu', 'Koraidon', 'Miraidon', 'Walking Wake', 'Iron Leaves', 'Okidogi', 'Munkidori', 'Fezandipiti', 'Ogerpon', 'Gouging Fire', 'Raging Bolt', 'Iron Boulder', 'Iron Crown', 'Terapagos', 'Pecharunt'
]
const nonBreedablePokemon = [
    'Ditto', 'Nihilego', 'Buzzwole', 'Pheromosa', 'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Poipole', 'Stakataka', 'Blacephalon', 
    'Dracozolt', 'Arctozolt', 'Dracovish', 'Arctovish', 'Great Tusk', 'Scream Tail', 'Brute Bonnet', 'Flutter Mane', 'Slither Wing', 'Sandy Shocks',
    'Iron Treads', 'Iron Bundle', 'Iron Hands', 'Iron Jugulis', 'Iron Moth', 'Iron Thorns', 'Gimmighoul', 'Gholdengo', 'Roaring Moon', 'Iron Valiant'
]
const nonBreedableAltFormPokemon = ['Sinistea (Antique)', 'Poltchageist (Artisan)']
const effectiveNonBreedable = [...nonBreedablePokemon, ...nonBreedableAltFormPokemon]
const evolvedRegionals = [
    'Alolan Raichu', 'Alolan Exeggutor', 'Alolan Marowak', 'Galarian Weezing', 'Hisuian Typhlosion', 'Hisuian Samurott', 'Hisuian Lilligant',
    'Hisuian Braviary', 'Hisuian Sliggoo', 'Hisuian Goodra', 'Hisuian Avalugg', 'Hisuian Decidueye'
]

const noCompareWithoutOnhand = [...legendaryPokemon, ...nonBreedablePokemon, ...nonBreedableAltFormPokemon, ...evolvedRegionals]

//these are alternate and regional form pokemon who have special cases when creating ball list for them.
const uniqueAlternateFormPokemon = ['Basculin', 'Vivillon', 'Flabébé', 'Rockruff', 'Alcremie']
//basculin is unique in that his white striped form is exclusive to gen 9+. 
//Flabebe is unique as her blue flower form in gen 7 specifically is unavailable to have HA, due to a bug in the code that was never fixed (blue flower floette never calls for SOS).
//Rockruff is unique as his dusk form not only calls for the original to be placed as well (kinda like a regional form), but does not have HA. 
//vivillon and alcremie are special for obvious reasons (SO. MANY. FORMS.)
const uniqueRegionalFormPokemon = ['Tauros']
//paldean tauros is unique as it has 3 different alternate forms.

//used for imglink virtuals to filter out non alternate/regional form pokemon off 'if' pipe
const pokemonNamesWithSpaces = [
    'Mr. Mime', 'Mime Jr.', 
    'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini',
    'Great Tusk', 'Scream Tail', 'Brute Bonnet', 'Flutter Mane', 'Slither Wing', 'Sandy Shocks', 'Roaring Moon',
    'Iron Treads', 'Iron Bundle', 'Iron Hands', 'Iron Jugulis', 'Iron Moth', 'Iron Thorns', 'Iron Valiant',
    'Walking Wake', 'Iron Leaves', 
    'Gouging Fire', 'Raging Bolt', 'Iron Boulder', 'Iron Crown'
]

const pokemonGroups = [
    {key: 'breedables', display: 'Breedables', desc: 'Breedable pokemon who do not fit into other categories.'}, 
    {key: 'alternateForms', display: 'Alternate Forms', desc: 'Pokemon with alternate forms.'}, 
    {key: 'babyAdultMons', display: 'Baby/Adult Pokemon', desc: 'Pokemon classified as baby pokemon with their adult counterparts'}, 
    {key: 'nonBreedables', display: 'Non-Breedables', desc: 'Pokemon who cannot breed.'},
    {key: 'legendaries', display: 'Legendaries', desc: 'Legendary pokemon.'},
    {key: 'evolvedRegionals', display: 'Evolved Regional Forms', desc: "Fully evolved regional form pokemon whose pre-evolved forms lack the form."}
]
const pokemonSubGroups = {
    'breedables': [
        {key: 'regular', display: 'Regular', desc: 'Regular pokemon with no alternate/regional forms.'}, 
        {key: 'regionalForms', display: 'Regional Forms', desc: 'Regional variants of previous pokemon.'}
    ], 
    'nonBreedables': [
        {key: 'regular', display: 'Regular', desc: 'Regular pokemon who cannot breed.'}, 
        {key: 'ultraBeasts', display: 'Ultra Beasts', desc: 'The Gen 7 (Sun/Moon) pokemon classified as Ultra Beasts.'}, 
        {key: 'paradoxPokemon', display: 'Paradox Pokemon', desc: 'The Gen 9 (Scarlet/Violet) pokemon classified as paradox pokemon (non-legendary ones).'}
    ],
    'alternateForms': [
        {key: 'breedable', display: 'Breedable', desc: 'Pokemon who can pass down their alternate forms via breeding.'}, 
        {key: 'nonBreedable', display: 'Non-Breedable', desc: 'Pokemon who can breed, but cannot pass down their alternate forms via breeding.'}, 
        {key: 'interchangeable', display: 'Changeable Alt Forms', desc: 'Pokemon who can switch between their alternate forms.'}, 
        {key: 'vivillon', display: 'Vivillon Patterns', desc: 'The 18 non-event Vivillon patterns (19 in Scarlet/Violet)'}, 
        {key: 'alcremie', display: 'Alcremie Forms', desc: 'All 63 possible Alcremie forms.'}
    ],
    'babyAdultMons': [
        // {key: 'regularAdults', display: 'Adults', desc: 'Adult version of regular baby pokemon'}, 
        // {key: 'regularBabies', display: 'Babies', desc: 'Regular baby pokemon'}, 
        // {key: 'incenseAdults', display: 'Incense Adults', desc: 'Adult version of baby pokemon obtained through breeding with incense'}, 
        // {key: 'incenseBabies', display: 'Incense Babies', desc: 'Baby pokemon obtained through breeding with incense'}
        {display: 'Regular', key: ['regularBabies', 'regularAdults'], desc: 'Regular baby/adult pokemon'},
        {display: 'Incense', key: ['incenseBabies', 'incenseAdults'], desc: 'Baby pokemon obtained through breeding with incense, and their adult versions'}
    ], 
}

//evolutions of pokemon with different forms. only if the pre-evolve form does not have that form AND that form isn't available to evolve into for everyone
const differentRegionalFormEvolutions = ['Alolan Raichu', 'Alolan Exeggcutor', 'Alolan Marowak', 'Galarian Weezing', 'Hisuian Typhlosion', 'Hisuian Samurott', 'Hisuian Lilligant', 'Hisuian Braviary', 'Hisuian Sliggoo', 'Hisuian Avalugg', 'Hisuian Decidueye']
const vivillonForms = ['Archipelago', 'Continental', 'Elegant', 'Garden', 'High Plains', 'Icy Snow', 'Jungle', 'Marine', 'Meadow', 'Modern', 'Monsoon', 'Ocean', 'Polar', 'River', 'Sandstorm', 'Savanna', 'Sun' ,'Tundra']
const alcremieForms = {
    sweets: ['Strawberry', 'Berry', 'Love', 'Star', 'Clover', 'Flower', 'Ribbon'], 
    creams: ['Vanilla Cream', 'Ruby Cream', 'Matcha Cream', 'Mint Cream', 'Lemon Cream', 'Salted Cream', 'Ruby Swirl', 'Caramel Swirl', 'Rainbow Swirl']
}

const getAllAlcremieFormsArr = () => {
    const allAlcremieForms = []
    for (let sweet of alcremieForms.sweets) {
        for (let cream of alcremieForms.creams) {
            allAlcremieForms.push(`${sweet} ${cream}`)
        }
    }
    return allAlcremieForms
}

//this information is only used for sorting operations. multiple pokemon with the same dex number (alt or regional forms) && their name has a space in it
const multipleDexNumAndSpaceHavingPokemon = ['Mr. Mime']

//pokemon name display information for frontend
const regionalNameDisplayOpts = [
    {value: 'default', display: 'Default'}, {value: 'brackets-full-out', display: 'In Brackets after Name'}, 
    {value: 'brackets-full-in', display: 'In Brackets before Name'}, {value: 'dash-full-out', display: 'Dash after Name'}, {value: 'dash-full-in', display: 'Dash before Name'},
    {value: 'dash-short-out', display: 'Shortened Dash after Name'}, {value: 'dash-short-in', display: 'Shortened Dash before Name'}
]
const originRegionalNameDisplayOpts = [
    {value: 'default', display: 'Default'}, {value: 'default-regional', display: 'Default for Regional Forms'}, {value: 'brackets-full-out', display: 'In Brackets after Name'},
    {value: 'brackets-full-in', display: 'In Brackets before Name'}, {value: 'dash-full-out', display: 'Dash after Name'}, {value: 'dash-full-in', display: 'Dash before Name'},
    {value: 'dash-short-out', display: 'Shortened Dash after Name'}, {value: 'dash-short-in', display: 'Shortened Dash before Name'}
]
const altFormNameDisplayOpts = [
    {value: 'default', display: 'Default'}, {value: 'brackets-full-formname-out', display: 'In Brackets with Form Name'},
    {value: 'brackets-full-in', display: 'In Brackets before Name'}, {value: 'dash-full-out', display: 'Dash after Name'}, {value: 'dash-full-in', display: 'Dash before Name'},
    {value: 'dash-short-out', display: 'Shortened Dash after Name'}, {value: 'dash-short-in', display: 'Shortened Dash before Name'}
]
const altFormNames = {
    'Paldean Tauros': 'Breed', 'Burmy': 'Cloak', 'Shellos': 'Sea', 'Basculin': 'Striped', 'Deerling': 'Form', 'Vivillon': 'Pattern', 'Flabébé': 'Flower', 'Pumpkaboo': 'Size', 'Gourgeist': 'Size',
    'Oricorio': 'Style', 'Rockruff': 'Form', 'Minior': 'Core', 'Sinistea': 'Form', 'Squawkabilly': 'Plumage', 'Tatsugiri': 'Form', 'Poltchageist': 'Form'
}
const threeLetterShorten = ['Vivillon', 'Pumpkaboo', 'Gourgeist', 'Oricorio', 'Deerling']

export {
    regionalFormRegions, alolanFormMons, galarianFormMons, hisuianFormMons, paldeanFormMons, regionalFormMons, multipleRegionalFormMons,
    allAltFormMons, genderAltFormMons, interchangeableAltFormMons, interchangeableAltFormForms, nonBreedableAltFormMons, nonBreedableAltRegIdentifiers,
    altFormMonsWithExclusiveEMs, incenseAdultsWithExclusiveEMs, incenseBabiesWithExclusiveEMs, babiesOfGen1Pokemon, babiesOfGen2Pokemon, babiesOfGen3Pokemon,
    pokeBabies, pokeAdults, pokeIncenseBabies, pokeIncenseAdults, legendaryPokemon, nonBreedablePokemon, effectiveNonBreedable, evolvedRegionals, noCompareWithoutOnhand,
    uniqueRegionalFormPokemon, uniqueAlternateFormPokemon, pokemonNamesWithSpaces,
    pokemonGroups, pokemonSubGroups, differentRegionalFormEvolutions, vivillonForms, getAllAlcremieFormsArr, multipleDexNumAndSpaceHavingPokemon,
    regionalNameDisplayOpts, originRegionalNameDisplayOpts, altFormNameDisplayOpts, altFormNames, threeLetterShorten
}