const incenseBabiesWithExclusiveEMs = ['Azurill', 'Mantyke', 'Budew', 'Munchlax', 'Mime Jr.']
const incenseAdultsWithExclusiveEMs = ['Marill', 'Chimecho', 'Roselia', 'Snorlax']
const altFormMonsWithExclusiveEMs = ['Basculin (Red-Striped)', 'Basculin (Blue-Striped)', 'Basculin (White-Striped)', 'Indeedee (Male)', 'Indeedee (Female)']
const babiesOfGen1Pokemon = ['Pichu', 'Igglybuff', 'Cleffa', 'Smoochum', 'Elekid', 'Magby', 'Mime Jr.', 'Happiny', 'Munchlax']
const babiesOfGen2Pokemon = ['Azurill', 'Wynaut', 'Bonsly', 'Mantyke']
const babiesOfGen3Pokemon = ['Budew', 'Chingling']


//regional info
const regionalFormRegions = ['Alola', 'Galar', 'Hisui', 'Paldea']
const alolanFormMons = ['Rattata', 'Raichu', 'Sandshrew', 'Vulpix', 'Diglett', 'Meowth', 'Geodude', 'Grimer', 'Exeggutor', 'Marowak']
const galarianFormMons = ['Meowth', 'Ponyta', 'Slowpoke', "Farfetch'd", 'Weezing', 'Mr. Mime', 'Corsola', 'Zigzagoon', 'Darumaka', 'Yamask', 'Stunfisk', 'Articuno', 'Zapdos', 'Moltres']
const hisuianFormMons = ['Growlithe', 'Voltorb', 'Typhlosion', 'Qwilfish', 'Sneasel', 'Samurott', 'Lilligant', 'Zorua', 'Braviary', 'Sliggoo', 'Goodra', 'Avalugg', 'Decidueye']
const paldeanFormMons = ['Tauros', 'Wooper']
//above specific regional forms above are only used to concat the large array below, which is being used. can import smaller lists if needed. 
const regionalFormMons = alolanFormMons.concat(galarianFormMons, hisuianFormMons, paldeanFormMons)
const multipleRegionalFormMons = ['Meowth']
const allAltFormMons = ['Nidoran', 'Paldean Tauros', 'Burmy', 'Shellos', 'Basculin', 'Deerling', 'Flabébé', 'Pumpkaboo', 'Rockruff', 'Oricorio', 'Minior', 'Indeedee', 'Squawkabilly', 'Tatsugiri']
const genderAltFormMons = ['Nidoran', 'Indeedee']
const interchangeableAltFormMons = ['Burmy', 'Deerling', 'Oricorio']
const nonBreedableAltFormMons = ['Sinistea', 'Poltchageist']

//below is dexnums that are allowed to be duplicate. used for importing collections to check if theres unauthorized overlaps to give the user a warning.
const allowedAprimonMultipleDexNums = [19, 27, 37, 50, 52, 58, 74, 77, 79, 83, 88, 100, 122, 128, 144, 145, 146, 194, 211, 215, 222, 263, 554, 562, 570, 618, 412, 422, 550, 585, 666, 669, 710, 741, 744, 774, 854, 869, 876, 931, 978, 1012]
//this one relates to the first one as the number of allowed duplicates.
const allowedAprimonDuplicateNum = [2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 4, 19, 5, 4, 4, 2, 7, 2, 63, 2, 4, 3, 2]

//apriballs and ball info
const apriballs = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']
const apriballLiterals = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon'] //used for setting ball info based on apriball (only) legality
const specialBalls = ['beast', 'dream', 'safari', 'sport']//used for setting ball info based on other ball legality
const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk'] //currently unused

//generations and game info/funcs
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genGames = [{gen: 8, games: ['swsh', 'bdsp']}] //only put games here if there is significant difference in the aprimon scope (ex dont put ultra sun/ultra moon cuz theres no difference)

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

//these are alt form pokemon with first letter allowed (no overlap). If a new form is introduced to any of these mons and screws it up this needs to be updated
const firstLetterAllowedAltForms = ['Nidoran♂', 'Nidoran♀', 'Burmy', 'Shellos', 'Basculin', 'Flabébé', 'Minior', 'Indeedee', 'Squawkabilly', 'Tatsugiri']

//these are alternate and regional form pokemon who have special cases when creating ball list for them.
const uniqueAlternateFormPokemon = ['Basculin', 'Vivillon', 'Flabébé', 'Rockruff', 'Alcremie']
//basculin is unique in that his white striped form is exclusive to gen 9+. 
//Flabebe is unique as her blue flower form in gen 7 specifically is unavailable to have HA, due to a bug in the code that was never fixed (blue flower floette never calls for SOS).
//Rockruff is unique as his dusk form not only calls for the original to be placed as well (kinda like a regional form), but does not have HA. 
//vivillon and alcremie are special for obvious reasons

const uniqueRegionalFormPokemon = ['Tauros']
//paldean tauros is unique as it has 3 different alternate forms.

const pokemonNamesWithSpaces = [
    'Mr. Mime', 'Mime Jr.', 
    'Tapu Koko', 'Tapu Lele', 'Tapu Bulu', 'Tapu Fini',
    'Great Tusk', 'Scream Tail', 'Brute Bonnet', 'Flutter Mane', 'Slither Wing', 'Sandy Shocks', 'Roaring Moon',
    'Iron Treads', 'Iron Bundle', 'Iron Hands', 'Iron Jugulis', 'Iron Moth', 'Iron Thorns', 'Iron Valiant',
    'Walking Wake', 'Iron Leaves', 
    'Gouging Fire', 'Raging Bolt', 'Iron Boulder', 'Iron Crown'
]

export {
    incenseBabiesWithExclusiveEMs, incenseAdultsWithExclusiveEMs, altFormMonsWithExclusiveEMs, 
    babiesOfGen1Pokemon, babiesOfGen2Pokemon, babiesOfGen3Pokemon,
    regionalFormRegions, regionalFormMons, multipleRegionalFormMons,
    allAltFormMons, interchangeableAltFormMons, nonBreedableAltFormMons, allowedAprimonMultipleDexNums, allowedAprimonDuplicateNum,
    apriballs, apriballLiterals, specialBalls, shopballs, generations, genGames, findGenByDexNum,
    gapIdentifiers, regionalFormNameIdentifiers, originalRegionalFormNameIdentifiers, additionalOriginRegionalFormNameIdentifiers, firstLetterAllowedAltForms, regions,
    uniqueAlternateFormPokemon, uniqueRegionalFormPokemon, pokemonNamesWithSpaces
}