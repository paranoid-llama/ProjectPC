//setCirclePosition function sets up the ball progress circle via another style sheet
//totalApriball cases adds support for when a user clicks one to enlarge it in the center (changing the amount on the circumference), 
//as well as if the user only wants to collect particular balls and not all of them
//ui is no longer in circle shape once theres 6 or less

const setCirclePositionStyles = (idx, totalApriballs) => {
    const ballNum = idx+1

    switch (totalApriballs) {
        case 11:
            const className11 = ballNum === 1 ? 'deg-0' :
                                ballNum === 2 ? 'deg-30' :
                                ballNum === 3 ? 'deg-60' : 
                                ballNum === 4 ? 'deg-90' :
                                ballNum === 5 ? 'deg-120' :
                                ballNum === 6 ? 'deg-150' :
                                ballNum === 7 ? 'deg-210' :
                                ballNum === 8 ? 'deg-240' :
                                ballNum === 9 ? 'deg-270' :
                                ballNum === 10 ? 'deg-300' :
                                ballNum === 11 && 'deg-330' 
            const positioning11 = ballNum > 1 && ballNum < 7 ? '35%' : ballNum >= 7 ? '65%' : undefined
            return {className: className11, position: {right: positioning11}} // right positioning is only used to spread both halves of the circle. otherwise className alone makes a circle
        case 10:
            const className10 = ballNum === 1 ? 'deg-30' :
                                ballNum === 2 ? 'deg-60' :
                                ballNum === 3 ? 'deg-90' : 
                                ballNum === 4 ? 'deg-120' :
                                ballNum === 5 ? 'deg-150' :
                                ballNum === 6 ? 'deg-210' :
                                ballNum === 7 ? 'deg-240' :
                                ballNum === 8 ? 'deg-270' :
                                ballNum === 9 ? 'deg-300' :
                                ballNum === 10 && 'deg-330' 
            const positioning10 = ballNum < 6 ? '35%' : '65%'
            return {className: className10, position: {right: positioning10}}
        case 9:
            const className9 = ballNum === 1 ? 'deg-0' :
                                ballNum === 2 ? 'deg-22-5' :
                                ballNum === 3 ? 'deg-67-5' : 
                                ballNum === 4 ? 'deg-112-5' :
                                ballNum === 5 ? 'deg-157-5' :
                                ballNum === 6 ? 'deg-202-5' :
                                ballNum === 7 ? 'deg-247-5' :
                                ballNum === 8 ? 'deg-292-5' :
                                ballNum === 9 && 'deg-337-5' 
            const positioning9 = ballNum > 1 && ballNum < 6 ? '35%' : ballNum >= 6 ? '65%' : undefined
            return {className: className9, position: {right: positioning9}}
        case 8:
            const className8 = ballNum === 1 ? 'deg-22-5' :
                                ballNum === 2 ? 'deg-67-5' : 
                                ballNum === 3 ? 'deg-112-5' :
                                ballNum === 4 ? 'deg-157-5' :
                                ballNum === 5 ? 'deg-202-5' :
                                ballNum === 6 ? 'deg-247-5' :
                                ballNum === 7 ? 'deg-292-5' :
                                ballNum === 8 && 'deg-337-5' 
            const positioning8 = ballNum < 5 ? '35%' : '65%'
            return {className: className8, position: {right: positioning8}}
        case 7:
            const className7 = ballNum === 1 ? 'deg-0' :
                                ballNum === 2 ? 'deg-45' :
                                ballNum === 3 ? 'deg-90' :
                                ballNum === 4 ? 'deg-135' :
                                ballNum === 5 ? 'deg-225' :
                                ballNum === 6 ? 'deg-270' :
                                ballNum === 7 && 'deg-315'
            const positioning7 = ballNum > 1 && ballNum < 5 ? '35%' : ballNum >= 5 ? '65%' : undefined
            return {className: className7, position: {right: positioning7}}
        case 6:
            const className6 = ballNum === 1 ? 'deg-45' :
                                ballNum === 2 ? 'deg-90' :
                                ballNum === 3 ? 'deg-135' :
                                ballNum === 4 ? 'deg-225' :
                                ballNum === 5 ? 'deg-270' :
                                ballNum === 6 && 'deg-315'
            const positioning6 = ballNum < 4 ? '35%' : '65%'
            return {className: className6, position: {right: positioning6}}
        default: {
            return {}
        }
    }
}

const setRowXScaling = (idx, totalApriballs) => {
    switch (totalApriballs) {
        case 11: {
            return {left: `${(idx+1)*8.4}%`, size: 50}
        }
        case 10: {
            return {left: `${(idx+1)*8.7}%`, size: 50}
        }
        case 9: {
            return {left: `${(idx+1)*10}%`, size: 55}
        }
        case 8: {
            return {left: `${(idx+1)*11}%`, size: 60}
        }
        case 7: {
            return {left: `${(idx+1)*12.5}%`, size: 60}
        }
        case 6: {
            return {left: `${(idx+1)*14}%`, size: 75}
        }
        case 5: {
            return {left: `${((idx+1)*20)-10}%`, size: 65}
        }
        case 4: {
            return {left: `${((idx+1)*25)-12.5}%`, size: 80}
        }
        case 3: {
            return {left: `${((idx+1)*(100/3))-(100/6)}%`, size: 80}
        }
        case 2: {
            return {left: `${((idx+1)*(50))-25}%`, size: 80}
        }
        case 1: {
            return {left: `50%`, size: 80}
        }
        default: {
            return {left: `${(idx+1)*8.4}%`, size: 50}
        }
    }
}

export {setCirclePositionStyles, setRowXScaling}
