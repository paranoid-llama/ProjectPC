import {moveTypes, typeStyles} from './movetypecolors.js'

const getMoveStyles = (moveName) => {
    const moveStyles = typeStyles[moveTypes[moveName]]
    return moveStyles
}

export default getMoveStyles