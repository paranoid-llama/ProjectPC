import {Grid, ToggleButtonGroup, ToggleButton} from '@mui/material'
import EggMove from './eggmove'

export default function RenderPossibleEggMoves({possibleEggMoves, EMs, handleEMChange, maxEMs, isOnHandEdit=false, customXs=undefined, customSx={}}) {

    const gridStyles = {
        border: '1px solid black',
        borderRadius: '10px',
        textAlign: 'center',
        fontSize: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        '@media only screen and (min-width: 1000px)': {
            fontSize: '15px'
        }, 
        '&:hover': {
            cursor: 'pointer'
        }
    }

    const possibleEggMoveButtons = () => {
        return (
            possibleEggMoves.map((em, idx) => {
                const isSelected = EMs.includes(em)
                const disabled = (EMs.length === maxEMs) && !(EMs.includes(em))
                const keyIdentifier = `Possible EM ${idx+1}`
                return (
                    <EggMove 
                        moveName={em} 
                        customXs={customXs}
                        onClickFunc={disabled ? undefined : (e) => handleEMChange(e)}
                        displayType='possibleEggMoves'
                        selected={isSelected}
                        disabled={disabled}
                        dropDownMenu={true}
                        key={keyIdentifier}
                    />
                )
            })
        )
    }

    const fillEggMoves = () => {
        const numToFillArr = isOnHandEdit ? [12, 11, 10, 9, 8, 7] : [6, 5, 4, 3, 2, 1]
        const numToFill = possibleEggMoves.length === 1 ? numToFillArr[0] : 
            possibleEggMoves.length === 2 ? numToFillArr[1] :
            possibleEggMoves.length === 3 ? numToFillArr[2] : 
            possibleEggMoves.length === 4 ? numToFillArr[3] : 
            possibleEggMoves.length === 5 ? numToFillArr[4] : 
            possibleEggMoves.length === 6 ? numToFillArr[5] :
            possibleEggMoves.length === 7 && isOnHandEdit ? 6 : 
            possibleEggMoves.length === 8 && isOnHandEdit ? 5 : 
            possibleEggMoves.length === 9 && isOnHandEdit ? 4 :
            possibleEggMoves.length === 10 && isOnHandEdit ? 3 : 
            possibleEggMoves.length === 11 && isOnHandEdit ? 2 : 
            possibleEggMoves.length === 12 && isOnHandEdit && 1   
        return (
            Array.from(Array(numToFill).keys()).map(n => {
                return (
                    <Grid key={`empty-em-fill-${n}`} item xs={customXs !== undefined ? 2 : customXs}></Grid>
                )
            })
        )
    }

    return (
        <Grid container sx={{height: '100%', width: '100%', ...customSx}} spacing={0}>
            {possibleEggMoveButtons()}
            {possibleEggMoves.length <= 6 && fillEggMoves()}
        </Grid>
    )
}