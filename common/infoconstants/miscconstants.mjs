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
const findRegionByDexNum = (dexNum, getRegionSuffix=false) => {
    const region = (1 <= dexNum && dexNum <= 151) ? getRegionSuffix ? 'Kantonian' : 'Kanto' :
                (152 <= dexNum && dexNum <= 251) ? getRegionSuffix ? 'Johtonian' : 'Johto' : 
                (252 <= dexNum && dexNum <= 386) ? getRegionSuffix ? 'Hoennian' : 'Hoenn' : 
                (387 <= dexNum && dexNum <= 493) ? getRegionSuffix ? 'Sinnohan' : 'Sinnoh' : 
                (494 <= dexNum && dexNum <= 649) ? getRegionSuffix ? 'Unovan' : 'Unova' : 
                (650 <= dexNum && dexNum <= 721) ? getRegionSuffix ? 'Kalosian' :'Kalos' : 
                (722 <= dexNum && dexNum <= 809) ? getRegionSuffix ? 'Alolan' :'Alola' : 
                (810 <= dexNum && dexNum <= 905) ? getRegionSuffix ? 'Galarian' :'Galar' : 
                (906 <= dexNum && dexNum <= 1025) && getRegionSuffix ? 'Paldean' : 'Paldea'
    return region
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
    aprimon: {display: ['Gen 6', 'Gen 7', 'SW/SH', 'BD/SP', 'Gen 9', 'HOME'], value: [6, 7, 'swsh', 'bdsp', 9, 'home']},
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
//most games aren't compatible with home on first release. This just keeps track of it, as well as if any games somehow lose home compatibility.
//mainly used for determining which gens can trade with home collections
const homeCompatibleGames = [
    {game: 'sword', compatible: true}, {game: 'shield', compatible: true}, {game: 'letsgopikachu', compatible: true}, {game: 'letsgoeevee', compatible: true},
    {game: 'brilliantdiamond', compatible: true}, {game: 'shiningpearl', compatible: true}, {game: 'legendsarceus', compatible: true}, {game: 'scarlet', compatible: true}, {game: 'violet', compatible: true},
    //below parts are dupes but they're used for backend operations related to home collection generation
    {game: 7, compatible: true}, {game: 'swsh', compatible: true}, {game: 'bdsp', compatible: true}, {game: 9, compatible: true}
]

const noRegionalFormGens = [6, 'bdsp']
const homeDisplayGames = ['swsh', 'bdsp', 9]

const getGameColor = (gameLetter) => { //for home-compatible games only
    const color = gameLetter === 'SW' ? '#009fe8' : gameLetter === 'SH' ? '#e5015a' : 
        gameLetter === 'BD' ? '#9ad4f6' : gameLetter === 'SP' ? '#e3d0df' : 
        gameLetter === 'S' ? '#c33124' : gameLetter === 'V' && '#95398a'
    return color
}

//default value of various trade items in HA Aprimon
const valueDefaults = {
    'On Hand HA Aprimon': 0.5,
    'Non-HA Aprimon': 1,
    'On Hand Non-HA Aprimon': 0.5,
    'Wishlist Aprimon': 1,
    'Apriballs': 4, 'Dream Ball': 5, 'Beast Ball': 5, 'Safari Ball': 5, 'Sport Ball': 5,
    'Ability Capsule': 1, 'Bottle Cap': 2, 'Gold Bottle Cap': 3, 'Ability Patch': 3,
    'Max Mushroom': 2, 'Exp. Candy L': 1, 'Exp. Candy XL': 2
}

export {
    generations, genRomans, genGames, findGenByDexNum, findRegionByDexNum,
    apriballs, apriballLiterals, specialBalls, ballIntros,
    getGenNum, getBallsInGen,
    collectionTypes, collectionDescription, collectionSubTypes,
    items, getPossibleItems,
    regionIdentifiers,
    tradePreferenceDisplay,
    gamesOrder, homeCompatibleGames, noRegionalFormGens, homeDisplayGames, getGameColor,
    valueDefaults
}
