<<<<<<< HEAD
import { regionIdentifiers } from "../infoconstants/miscconstants.mjs"

const sortByNameLogic = (a, b, order) => {
    if (order === 'A2Z') {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        // const comparingPokemonToTheirRegional = (aIsRegional && a.name.slice(a.name.indexOf(" ")+1) === b.name) || (bIsRegional && b.name.slice(b.name.indexOf(" ")+1) === a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? 1 : -1
        }
        if (aNameComparator < bNameComparator) {
            return -1;
        }
        if (aNameComparator > bNameComparator) {
            return 1;
        }
        return 0;
    } else {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? -1 : 1
        }
        if (aNameComparator < bNameComparator) {
            return 1;
        }
        if (aNameComparator > bNameComparator) {
            return -1;
        }
        return 0;
    }
}

const sortByName = (order='A2Z', list) => {
    const sortedList = list.slice().sort((a, b) => sortByNameLogic(a, b, order))
    return sortedList
}

=======
import { regionIdentifiers } from "../infoconstants/miscconstants.mjs"

const sortByNameLogic = (a, b, order) => {
    if (order === 'A2Z') {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        // const comparingPokemonToTheirRegional = (aIsRegional && a.name.slice(a.name.indexOf(" ")+1) === b.name) || (bIsRegional && b.name.slice(b.name.indexOf(" ")+1) === a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? 1 : -1
        }
        if (aNameComparator < bNameComparator) {
            return -1;
        }
        if (aNameComparator > bNameComparator) {
            return 1;
        }
        return 0;
    } else {
        const aIsRegional = regionIdentifiers.map(id => a.name.includes(id)).includes(true)
        const bIsRegional = regionIdentifiers.map(id => b.name.includes(id)).includes(true)
        const aNameComparator = aIsRegional ? a.name.slice(a.name.indexOf(" ")+1) : a.name
        const bNameComparator = bIsRegional ? b.name.slice(b.name.indexOf(" ")+1) : b.name
        const comparingOriginalFormMonToRegional = aIsRegional && a.name.includes(b.name) || bIsRegional && b.name.includes(a.name)
        if (comparingOriginalFormMonToRegional) {
            return aIsRegional ? -1 : 1
        }
        if (aNameComparator < bNameComparator) {
            return 1;
        }
        if (aNameComparator > bNameComparator) {
            return -1;
        }
        return 0;
    }
}

const sortByName = (order='A2Z', list) => {
    const sortedList = list.slice().sort((a, b) => sortByNameLogic(a, b, order))
    return sortedList
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {sortByNameLogic, sortByName}