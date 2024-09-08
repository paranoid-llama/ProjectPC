import { pokemonGroups, pokemonSubGroups } from "../../../common/infoconstants/pokemonconstants.mjs"

//this function gets the info required for scope selection components (collection options and scope selection)
const getScopePeripheralInfo = (modalState, groupKeys, formData, typeTotalMons) => { 
    //modalState refers to which group/subgroup is currently selected, while formData is the selected pokemon in all groups
    const groupKeysWithSubGroups = groupKeys.filter((groupKey) => !Array.isArray(typeTotalMons[groupKey])) //only used to get other info
    const groupTotal = groupKeys.length

    const activeGroup = modalState.group
    const activeSubGroupKey = modalState.subGroup[activeGroup]
    const hasSubGroups = groupKeysWithSubGroups.includes(activeGroup)
    const groupInfo = {group: activeGroup, subGroup: modalState.subGroup[modalState.group]}

    const babyAdultMonGroupActive = activeGroup === 'babyAdultMons'
    const interchangeableAltFormGroupActive = activeGroup === 'alternateForms' && activeSubGroupKey === 'interchangeable'

    const groupLabels = groupKeys.map(grpKey => pokemonGroups.filter(grp => grp.key === grpKey)[0].display)
    const activeSubGroups = hasSubGroups && pokemonSubGroups[activeGroup].filter(subGroup => Object.keys(typeTotalMons[activeGroup]).includes(subGroup.key) || Object.keys(typeTotalMons[activeGroup]).map(sGK => subGroup.key.includes(sGK)).includes(true))
    const activeSubGroup = hasSubGroups && activeSubGroups.filter((sG) => babyAdultMonGroupActive ? sG.display.toLowerCase() === activeSubGroupKey : sG.key === activeSubGroupKey)[0]
    
    const totalPokemonInGroup = hasSubGroups ?
        (babyAdultMonGroupActive) ? {babies: typeTotalMons.babyAdultMons[`${activeSubGroupKey}Babies`], adults: typeTotalMons.babyAdultMons[`${activeSubGroupKey}Adults`]} : 
        typeTotalMons[activeGroup][activeSubGroupKey] : typeTotalMons[activeGroup]

    const selectedPokemonInGroup = hasSubGroups ? 
        (babyAdultMonGroupActive) ? {babies: formData.babyAdultMons[`${activeSubGroupKey}Babies`].map(p => p.id), adults: formData.babyAdultMons[`${activeSubGroupKey}Adults`].map(p => p.id)} : 
        formData[activeGroup][activeSubGroupKey].map(p => p.id) : formData[activeGroup].map(p => p.id)

    const totalMonsActiveSubGroupLength = Object.values(totalPokemonInGroup).flat().length
    const formDataActiveSubGroupLength = Object.values(selectedPokemonInGroup).flat().length

    const amountIncluded = totalMonsActiveSubGroupLength === formDataActiveSubGroupLength || 
        (interchangeableAltFormGroupActive && (
            typeTotalMons.alternateForms.interchangeable.filter(mon => !mon.imgLink.includes('-a') && !mon.imgLink.includes('-any')).length === formData.alternateForms.interchangeable.filter(mon => !mon.id.includes('-a') && !mon.id.includes('-any')).length)) ? 'All' :
        formDataActiveSubGroupLength === 0 ? 'None' : 'Some'

    return {groupTotal, activeSubGroupKey, hasSubGroups, groupInfo, babyAdultMonGroupActive, interchangeableAltFormGroupActive, 
        groupLabels, activeSubGroups, activeSubGroup, totalPokemonInGroup, selectedPokemonInGroup, amountIncluded
    }
}

export {getScopePeripheralInfo}