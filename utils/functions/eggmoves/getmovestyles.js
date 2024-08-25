<<<<<<< HEAD
import {moveTypes, typeStyles} from './movetypecolors.js'

const getMoveStyles = (moveName) => {
    const moveStyles = typeStyles[moveTypes[moveName]]
    return moveStyles
}

=======
import {moveTypes, typeStyles} from './movetypecolors.js'

const getMoveStyles = (moveName) => {
    const moveStyles = typeStyles[moveTypes[moveName]]
    return moveStyles
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export default getMoveStyles