import { evolvedRegionals } from "../../common/infoconstants/pokemonconstants.mjs";

export default function frontendToApiNameFormat(name, babyLiteral=false) {
    // extracts the pokemon species as viewed from the api from a regular name.
    // recall regional format is "<regional name -an> <species>", alternate format is "<species> (<alternate form name>)"
    // the only exception is evolved regionals who in the api just have the full regional name and species.
    
    const isRegionalOrAlt = name.includes(' ')
    if (evolvedRegionals.includes(name) || !isRegionalOrAlt) {
        return name
    } else {
        if (name.includes('(')) {
            if (name.includes('Tauros')) {return 'Tauros'}
            return name.slice(0, name.indexOf('(')-1)
        }
        return name.slice(name.indexOf(' ')+1, name.length)
    }
}