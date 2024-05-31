import { multipleDexNumAndSpaceHavingPokemon } from "../infoconstants/pokemonconstants.mjs"

const sortByDexNumLogic = (a, b, order) => {
    if (order === 'NatDexNumL2H') {
        if (a.natDexNum > b.natDexNum) {
            return 1
        }
        if (a.natDexNum < b.natDexNum) {
            return -1
        }
        if (a.natDexNum === b.natDexNum) {//ensures regional and alternate form pokemon are listed after their regular forms
            if (a.name.includes(" ") && b.name.includes(" ")) {
                return multipleDexNumAndSpaceHavingPokemon.includes(a.name) ? -1 : a.name.localeCompare(b.name)
            } else if (b.name.includes(" ")){
                return -1
            } else if (a.name.includes(" ")) {
                return 1
            } else {
                return 0
            }
        }
        return 0
    } else {
        if (a.natDexNum > b.natDexNum) {
            return -1
        }
        if (a.natDexNum < b.natDexNum) {
            return 1
        }
        if (a.natDexNum === b.natDexNum) {//ensures regional and alternate form pokemon are listed BEFORE their regular forms (UNTESTED)
            if (a.name.includes(" ") && b.name.includes(" ")) {
                return multipleDexNumAndSpaceHavingPokemon.includes(a.name) ? 1 : b.name.localeCompare(a.name)
            } else if (b.name.includes(" ")){
                return 1
            } else {
                return -1
            }
        }
        return 0
    }
}

const sortByDexNum = (order='NatDexNumL2H', list) => {
    const sortedList = list.slice().sort((a, b) => sortByDexNumLogic(a, b, order))
    return sortedList
}

export {sortByDexNum, sortByDexNumLogic}