import { sortByDexNumLogic } from "./sortbydexnum.mjs"
import { sortByBallLogic } from './sortbyball.mjs'
import { sortByNameLogic } from "./sortbyname.mjs"

const sortOnHandList = (firstSort='pokemon', pokemonSortKey, ballOrder, list) => {
    const sortedList = list.slice().sort((a, b) => {
        const sortingMonsByDexNum = pokemonSortKey.includes('NatDexNum')
        const firstSortOperation = firstSort === 'pokemon' ? sortingMonsByDexNum ? sortByDexNumLogic(a, b, pokemonSortKey) : sortByNameLogic(a, b, pokemonSortKey) : sortByBallLogic(a, b, ballOrder)
        if (firstSortOperation === 0) {
            const secondSortOperation = firstSort === 'pokemon' ? sortByBallLogic(a, b, ballOrder) : sortingMonsByDexNum ? sortByDexNumLogic(a, b, pokemonSortKey) : sortByNameLogic(a, b, pokemonSortKey)
            return secondSortOperation
        }
        return firstSortOperation
    })
    return sortedList
}

export {sortOnHandList}