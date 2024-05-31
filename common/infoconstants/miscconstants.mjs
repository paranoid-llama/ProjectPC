//this file handles peripheral constants

//generations and game info/funcs
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genRomans = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ']
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

//update this array if theres ever a new apriball to collect
const apriballs = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'];
const apriballLiterals = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon']
const specialBalls = ['beast', 'dream', 'safari', 'sport']
const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk'] 

//this array is for balls that are not in every gen, and which gen they were introduced in
const ballIntros = {
    beast: 7
}

//functions more used for frontend
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

//collection data
const collectionTypes = ['aprimon'] //haven't set up app for living dex collections yet, so it will stay out of this array until it does. exact name has to be 'living dex'
const collectionDescription = ['Collect pokemon in apricorn/rare pokeballs!', "Collect every pokemon. Gotta catch 'em all!"]

const collectionSubTypes = {
    aprimon: {display: ['Gen 6', 'Gen 7', 'SW/SH', 'BD/SP', 'Gen 9', 'HOME'], value: [6, 7, 'swsh', 'bdsp', 9, 'HOME']},
    ['living dex']: ['Regular', 'Shiny', 'Alternate Forms']
}

//item info for item trading
const items = [
    {value: 'fast', display: 'Fast Ball'}, {value: 'friend', display: 'Friend Ball'}, {value: 'heavy', display: 'Heavy Ball'}, 
    {value: 'level', display: 'Level Ball'}, {value: 'love', display: 'Love Ball'}, {value: 'lure', display: 'Lure Ball'}, {value: 'moon', display: 'Moon Ball'}, 
    {value: 'dream', display: 'Dream Ball'}, {value: 'beast', display: 'Beast Ball'}, {value: 'safari', display: 'Safari Ball'}, {value: 'sport', display: 'Sport Ball'},
    {value: 'capsule', display: 'Ability Capsule'}, {value: 'bottlecap', display: 'Bottle Cap'}, {value: 'goldbottlecap', display: 'Gold Bottle Cap'},
    {value: 'patch', display: 'Ability Patch'}, {value: 'maxmushroom', display: 'Max Mushroom'}, {value: 'candyL', display: 'Exp. Candy L'}, {value: 'candyXL', display: 'Exp. Candy XL'},
    {value: 'fsMochi', display: 'Fresh-Start Mochi'}
]

const notInGenItems = {
    6: ['all'],
    7: ['dream', 'beast', 'safari', 'sport', 'patch', 'maxmushroom', 'candyL', 'candyXL', 'fsMochi'], //while beast is in gen 7, its not valuable enough to trade (you can buy it)
    'swsh': ['fsMochi'],
    'bdsp': ['beast', 'dream', 'safari', 'sport', 'maxmushroom', 'candyL', 'candyXL', 'fsMochi'],
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

//used for misc functions, primarily sorting
const regionIdentifiers = ['Alolan', 'Galarian', 'Hisuian', 'Paldean']

//display info for trade preferences keys
const tradePreferenceDisplay = {
    'status': {
        'open': 'Accepting trade offers!',
        'closed': 'Not accepting offers!'
    },
    'size': {
        'any': 'Any Size',
        'small preferred': 'Small Trades Preferred',
        'small only': 'Small Trades Only',
        'large preferred': 'Large Trades Preferred',
        'large only': 'Large Trades Only'
    },
    'onhandOnly': {
        'yes': 'On-Hand Only',
        'no': 'Any List',
        'preferred': 'On-Hand Preferred'
    },
    'items': {
        'lf': 'LF Items',
        'ft': 'Items FT',
        'lf/ft': 'LF/FT Items'
    }
}

const gamesOrder = ['sword', 'shield', 'home',  'letsgopikachu', 'letsgoeevee', 'brilliantdiamond', 'shiningpearl', 'legendsarceus', 'scarlet', 'violet']

export {
    generations, genRomans, genGames, findGenByDexNum,
    apriballs, apriballLiterals, specialBalls, ballIntros,
    getGenNum, getBallsInGen,
    collectionTypes, collectionDescription, collectionSubTypes,
    items, getPossibleItems,
    regionIdentifiers,
    tradePreferenceDisplay,
    gamesOrder
}
