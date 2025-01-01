import { interchangeableAltFormIds } from "../../../common/infoconstants/pokemonconstants.mjs";

//need a function like this since interchangeable alt form needs to match any

const selectPokeIdMatches = (currId, compId, monDisabled) => {
    if (interchangeableAltFormIds.forms.includes(compId)) {
        const matchesFormOrAny = currId === compId || currId === `${compId.slice(0, compId.indexOf('-'))}-a${compId.slice(0, compId.indexOf('-')) === '585' ? 'ny' : ''}`
        return matchesFormOrAny && !monDisabled
    }
    return currId === compId && !monDisabled
}

export {selectPokeIdMatches}