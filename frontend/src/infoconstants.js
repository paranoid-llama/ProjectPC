//update these arrays for each new pokemon gen
const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const genRomans = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ']
const findGenByDexNum = (dexNum) => {
    const gen = (1 < dexNum && dexNum <= 151) ? 1 :
                (151 < dexNum && dexNum <= 251) ? 2 : 
                (252 < dexNum && dexNum <= 386) ? 3 : 
                (386 < dexNum && dexNum <= 493) ? 4 : 
                (493 < dexNum && dexNum <= 649) ? 5 : 
                (649 < dexNum && dexNum <= 721) ? 6 : 
                (721 < dexNum && dexNum <= 809) ? 7 : 
                (809 < dexNum && dexNum <= 905) ? 8 : 
                (905 < dexNum && dexNum <= 1025) && 9
    return gen
}

//update this array if theres ever a new apriball to collect
const apriballs = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport'];

//update this array if theres ever a new shopball to collect

const shopballs = ['poke', 'great', 'ultra', 'premier', 'repeat', 'timer', 'nest', 'net', 'luxury', 'dive', 'quick', 'heal', 'dusk']

export {generations, genRomans, apriballs, shopballs, findGenByDexNum}
