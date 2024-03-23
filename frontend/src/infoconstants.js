//update these arrays for each new pokemon gen
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genRomans = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ']
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

//update this array if theres ever a new shopball to collect

const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk']

//new types of collections put here

const collectionTypes = ['aprimon'] //haven't set up app for living dex collections yet, so it will stay out of this array until it does. exact name has to be 'living dex'
const collectionDescription = ['Collect pokemon in apricorn/rare pokeballs!', "Collect every pokemon. Gotta catch 'em all!"]

const collectionSubTypes = {
    aprimon: {display: ['Gen 6', 'Gen 7', 'SW/SH', 'BD/SP', 'Gen 9', 'HOME'], value: [6, 7, 'swsh', 'bdsp', 9, 'HOME']},
    ['living dex']: ['Regular', 'Shiny', 'Alternate Forms']
}

//collection creation options

const pokeBabies = ['Pichu', 'Cleffa', 'Igglybuff', 'Smoochum', 'Elekid', 'Magby', 'Togepi', 'Riolu', 'Toxel'] //tyrogue is purposefully excluded since you cannot decide to display their evolutions instead
const pokeAdults = ['Pikachu', 'Clefairy', 'Jigglypuff', 'Jynx', 'Electabuzz', 'Magmar', 'Togetic', 'Lucario', 'Toxtricity']

const pokeIncenseBabies = ['Mime Jr.', 'Happiny', 'Munchlax', 'Azurill', 'Wynaut', 'Bonsly', 'Mantyke', 'Budew', 'Chingling']
const pokeIncenseAdults = ['Mr. Mime', 'Chansey', 'Snorlax', 'Marill', 'Wobbuffet', 'Sudowoodo', 'Mantine', 'Roselia', 'Chimecho']

//evolutions of pokemon with different forms. only if the pre-evolve form does not have that form AND that form isn't available to evolve into for everyone
const differentRegionalFormEvolutions = ['Alolan Raichu', 'Alolan Exeggcutor', 'Alolan Marowak', 'Galarian Weezing', 'Hisuian Typhlosion', 'Hisuian Samurott', 'Hisuian Lilligant', 'Hisuian Braviary', 'Hisuian Sliggoo', 'Hisuian Avalugg', 'Hisuian Decidueye']
const vivillonForms = ['Archipelago', 'Continental', 'Elegant', 'Garden', 'High Plains', 'Icy Snow', 'Jungle', 'Marine', 'Meadow', 'Modern', 'Monsoon', 'Ocean', 'Polar', 'River', 'Sandstorm', 'Savanna', 'Sun' ,'Tundra']
const alcremieForms = {
    sweets: ['Strawberry', 'Berry', 'Love', 'Star', 'Clover', 'Flower', 'Ribbon'], 
    creams: ['Vanilla Cream', ' Ruby Cream', 'Matcha Cream', 'Mint Cream', 'Lemon Cream', 'Salted Cream', 'Ruby Swirl', 'Caramel Swirl', 'Rainbow Swirl']
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

export {
    generations, 
    genRomans, 
    apriballs, 
    shopballs, 
    findGenByDexNum, 
    collectionTypes, 
    collectionDescription, 
    collectionSubTypes,
    pokeBabies, pokeAdults, pokeIncenseBabies, pokeIncenseAdults,
    differentRegionalFormEvolutions, vivillonForms, getAllAlcremieFormsArr
}