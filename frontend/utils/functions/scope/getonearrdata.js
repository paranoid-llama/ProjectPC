import { sortByDexNum } from "../../../common/sortingfunctions/sortbydexnum.mjs";

//aggregates all pokemongroup data into one array and assigns group and subgroup keys to each pokemon. used for mass changes to particular pokemon (such
//as changing ball scope) which requires their group/subgroup data to change the form data.
const getOneArrData = (pokemonGroups, includeGroups=true, onlyIds=false) => {
    const groupKeys = Object.keys(pokemonGroups)
    const groupKeysWithSubGroups = groupKeys.filter(gK => !(Array.isArray(pokemonGroups[gK])))
    const subGroupKeys = {}
    groupKeysWithSubGroups.forEach(gK => {
        subGroupKeys[gK] = Object.keys(pokemonGroups[gK])
    })
    const groupKeysWithoutSubGroups = groupKeys.filter(gK => !groupKeysWithSubGroups.includes(gK))

    const totalPokemonData = []

    groupKeysWithSubGroups.forEach((gK) => {
        subGroupKeys[gK].forEach((sGK) => {
            const groupInfo = includeGroups ? {group: gK, subGroup: sGK} : {}
            totalPokemonData.push(pokemonGroups[gK][sGK].map(mon => {return onlyIds ? mon.id !== undefined ? mon.id : mon.imgLink : {...mon, ...groupInfo}}))
        })
    })
    groupKeysWithoutSubGroups.forEach(gK => {
        const groupInfo = includeGroups ? {group: gK} : {}
        totalPokemonData.push(pokemonGroups[gK].map(mon => {return onlyIds ? mon.id !== undefined ? mon.id : mon.imgLink : {...mon, ...groupInfo}}))
    })

    return !onlyIds ? sortByDexNum('NatDexNumL2H', totalPokemonData.flat()) : totalPokemonData.flat()
}

export { getOneArrData }