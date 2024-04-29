//update these arrays for each new pokemon gen
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genRomans = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ']
const genGames = [{gen: 8, games: ['swsh', 'bdsp']}]
const findGenByDexNum = (dexNum) => {
    const gen = (1 <= dexNum && dexNum <= 151) ? 1 :
                (152 <= dexNum && dexNum <= 251) ? 2 : 
                (252 <= dexNum && dexNum <= 386) ? 3 : 
                (387 <= dexNum && dexNum <= 493) ? 4 : 
                (494 <= dexNum && dexNum <= 649) ? 5 : 
                (650 <= dexNum && dexNum <= 721) ? 6 : 
                (722 <= dexNum && dexNum <= 809) ? 7 : 
                (810 <= dexNum && dexNum <= 905) ? 8 : 
                (906 <= dexNum && dexNum <= 1025) && 9
    return gen
}

//update this array if theres ever a new apriball to collect
const apriballs = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'];
const apriballLiterals = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']

//this array is for balls that are not in every gen, and which gen they were introduced in
const ballIntros = {
    beast: 7
}

const getGenNum = (genStr) => {
    const isGameGenStr = isNaN(parseInt(genStr))
    const gen = isGameGenStr ? genGames.filter((genGame) => {
        let isGame = false
        genGame.games.forEach(gameName => {
            if (gameName === genStr) {
                isGame = true
            }
        })
        return isGame
    }).map(genGame => genGame.gen)[0] : parseInt(genStr)
    return genStr === 'home' ? 'home' : gen
}

const getBallsInGen = (collectionGen) => {
    const genNum = getGenNum(collectionGen)
    if (genNum === 'home') {
        return apriballs
    }
    return apriballs.filter(ball => ballIntros[ball] === undefined || ballIntros[ball] <= genNum)
}

//update this array if theres ever a new shopball to collect

const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk']

//new types of collections put here

const collectionTypes = ['aprimon'] //haven't set up app for living dex collections yet, so it will stay out of this array until it does. exact name has to be 'living dex'
const collectionDescription = ['Collect pokemon in apricorn/rare pokeballs!', "Collect every pokemon. Gotta catch 'em all!"]

const collectionSubTypes = {
    aprimon: {display: ['Gen 6', 'Gen 7', 'SW/SH', 'BD/SP', 'Gen 9', 'HOME'], value: [6, 7, 'swsh', 'bdsp', 9, 'HOME']},
    ['living dex']: ['Regular', 'Shiny', 'Alternate Forms']
}

//this information is only used for sorting operations. multiple pokemon with the same dex number (alt or regional forms) && their name has a space in it
const multipleDexNumAndSpaceHavingPokemon = ['Mr. Mime']

//collection creation options

const pokeBabies = ['Pichu', 'Cleffa', 'Igglybuff', 'Smoochum', 'Elekid', 'Magby', 'Togepi', 'Riolu', 'Toxel'] //tyrogue is purposefully excluded since i made it that you cannot decide to display their evolutions instead
const pokeAdults = ['Pikachu', 'Clefairy', 'Jigglypuff', 'Jynx', 'Electabuzz', 'Magmar', 'Togetic', 'Lucario', 'Toxtricity']

const pokeIncenseBabies = ['Mime Jr.', 'Happiny', 'Munchlax', 'Azurill', 'Wynaut', 'Bonsly', 'Mantyke', 'Budew', 'Chingling']
const pokeIncenseAdults = ['Mr. Mime', 'Chansey', 'Snorlax', 'Marill', 'Wobbuffet', 'Sudowoodo', 'Mantine', 'Roselia', 'Chimecho']

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

//item info for item trading
const items = [
    {value: 'fast', display: 'Fast Ball'}, {value: 'friend', display: 'Friend Ball'}, {value: 'heavy', display: 'Heavy Ball'}, 
    {value: 'level', display: 'Level Ball'}, {value: 'love', display: 'Love Ball'}, {value: 'lure', display: 'Lure Ball'}, {value: 'moon', display: 'Moon Ball'}, 
    {value: 'dream', display: 'Dream Ball'}, {value: 'beast', display: 'Beast Ball'}, {value: 'safari', display: 'Safari Ball'}, {value: 'sport', display: 'Sport Ball'},
    {value: 'capsule', display: 'Ability Capsule'}, {value: 'bottlecap', display: 'Bottle Cap'}, {value: 'goldbottlecap', display: 'Gold Bottle Cap'},
    {value: 'patch', display: 'Ability Patch'}, {value: 'maxmushroom', display: 'Max Mushroom'}, {value: 'candyL', display: 'Exp. Candy L'}, {value: 'candyXL', display: 'Exp. Candy XL'},
]

const notInGenItems = {
    6: ['all'],
    7: ['dream', 'beast', 'safari', 'sport', 'patch', 'maxmushroom', 'candyL', 'candyXL'], //while beast is in gen 7, its not valuable enough to trade (you can buy it)
    'swsh': [],
    'bdsp': ['beast', 'dream', 'safari', 'sport', 'maxmushroom', 'candyL', 'candyXL'],
    9: ['maxmushroom'],
    'home': ['all'] //no item trading with home collection
}

const getPossibleItems = (gen) => {
    const itemsInGen = items.filter(item => {
        return notInGenItems[gen].includes('all') ? false : 
                !notInGenItems[gen].includes(item.value)
    })
    return itemsInGen
}

const regionIdentifiers = ['Alolan', 'Galarian', 'Hisuian', 'Paldean']

export {
    generations, 
    genRomans, genGames,
    apriballs, apriballLiterals, ballIntros,
    shopballs, getBallsInGen,
    findGenByDexNum, 
    collectionTypes, 
    collectionDescription, 
    collectionSubTypes,
    multipleDexNumAndSpaceHavingPokemon,
    pokeBabies, pokeAdults, pokeIncenseBabies, pokeIncenseAdults,
    pokemonGroups, pokemonSubGroups,
    differentRegionalFormEvolutions, vivillonForms, getAllAlcremieFormsArr,
    items, getPossibleItems, regionIdentifiers
}