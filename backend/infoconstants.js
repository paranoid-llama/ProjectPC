const incenseBabiesWithExclusiveEMs = ['Azurill', 'Mantyke', 'Budew', 'Munchlax', 'Mime Jr.']
const incenseAdultsWithExclusiveEMs = ['Marill', 'Chimecho', 'Roselia', 'Snorlax']
const regionalFormMons = ['Rattata', 'Sandshrew', 'Vulpix', 'Diglett', 'Meowth', 'Growlithe', 'Geodude', 'Ponyta', "Farfetch'd", 'Grimer', 'Voltorb', 'Mr. Mime', 'Tauros', 'Wooper', 'Qwilfish', 'Sneasel', 'Corsola', 'Zigzagoon', 'Darumaka', 'Yamask', 'Zorua', 'Stunfisk']
const altFormMonsWithExclusiveEMs = ['Basculin (Red-Striped)', 'Basculin (Blue-Striped)', 'Basculin (White-Striped)', 'Indeedee (Male)', 'Indeedee (Female)']
const babiesOfGen1Pokemon = ['Pichu', 'Igglybuff', 'Cleffa', 'Smoochum', 'Elekid', 'Magby', 'Mime Jr.', 'Happiny', 'Munchlax']
const babiesOfGen2Pokemon = ['Azurill', 'Wynaut', 'Bonsly', 'Mantyke']
const babiesOfGen3Pokemon = ['Budew', 'Chingling']

const altFormMons = ['Paldean Tauros', 'Burmy', 'Shellos', 'Basculin', 'Deerling', 'Flabébé', 'Pumpkaboo', 'Rockruff', 'Oricorio', 'Minior', 'Indeedee', 'Squawkabilly', 'Tatsugiri']
const interchangeableAltFormMons = ['Burmy', 'Deerling', 'Oricorio']

const apriballs = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']
const apriballLiterals = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
const specialBalls = ['beast', 'dream', 'safari', 'sport']
const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk']
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]

//used to filter out breaks in spreadsheets for collection import

const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea']
const otherGapTextValues = ['generation', 'region']
const gapIdentifiers = [...regions, ...otherGapTextValues]

//these are alternate and regional form pokemon who have special cases when creating ball list for them.

const uniqueAlternateFormPokemon = ['Basculin', 'Flabébé', 'Rockruff']
//basculin is unique in that his white striped form is exclusive to gen 9+. 
//Flabebe is unique as her blue flower form in gen 7 specifically is unavailable to have HA, due to a bug in the code that was never fixed (blue flower floette never calls for SOS).
//Rockruff is unique as his dusk form not only calls for the original to be placed as well (kinda like a regional form), but does not have HA. 

const uniqueRegionalFormPokemon = ['Paldean Tauros']
//paldean tauros is unique as it has 3 different alternate forms.

module.exports = {
    incenseBabiesWithExclusiveEMs, incenseAdultsWithExclusiveEMs, regionalFormMons, altFormMonsWithExclusiveEMs, 
    babiesOfGen1Pokemon, babiesOfGen2Pokemon, babiesOfGen3Pokemon,
    altFormMons, interchangeableAltFormMons,
    apriballs, apriballLiterals, specialBalls, shopballs, generations,
    gapIdentifiers, regions,
    uniqueAlternateFormPokemon, uniqueRegionalFormPokemon
}