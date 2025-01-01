import getMoveStyles from './../../../../../utils/functions/eggmoves/getmovestyles'
import {Grid, Typography} from '@mui/material'

export default function EggMove({moveName='none', onClickFunc=undefined, displayType, selected=false, displayNoInfo=false, displayAddEM=false, disabled=false, dropDownMenu=false, disabledWholeEMSelection=false, noInfoBgColor, customXs=undefined, otherTextStyles={}}) {
    const xs = customXs !== undefined ? customXs :  
            displayType === 'possibleEggMoves' ? 2 :
        (displayType === 'currentEggMoves' || displayType === 'editScreenCurrentEMs') ? 6 :
        displayType === 'onHandEditEMs' && 6
    const spacing = displayType === 'onHandEditEMs' ? 0.5 : 0
    const gridStyles = {
        border: '1px solid black',
        borderRadius: '10px',
        textAlign: 'center',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center', 
        '&:hover': (disabled === false) ? {
            cursor: 'pointer'
        } : {}
    }
    const textStyles = {
        fontSize: dropDownMenu ? '12px' : '10px',
        '@media only screen and (min-width: 1000px)': {
            fontSize: dropDownMenu ? '15px' : '12px'
        }
    }
    const selectedStyles = selected ? {boxShadow: '0px 0px 2px 3px #363535'} : {}
    const infoStyles = disabledWholeEMSelection ? {} : 
        displayNoInfo ? {backgroundColor: noInfoBgColor ? noInfoBgColor : '#545454', opacity: 0.7, color: 'white', '&:hover': {boxShadow: '0px 0px 2px 3px #363535', cursor: 'pointer'}} : 
        displayAddEM ? {opacity: 0.5, '&:hover': {boxShadow: '0px 0px 2px 3px black', cursor: 'pointer'}} : 
        disabled ? {opacity: 0.5} : {} 
    const typeStyles = moveName !== 'none' ? getMoveStyles(moveName) : {}
    const displayText = () => {
        if (displayType === 'currentEggMoves' || displayType === 'editScreenCurrentEMs') {
            return moveName !== 'none' ? moveName : 
            displayNoInfo ? '(No Info)' : 
            displayAddEM ? 'Add EM' : 
            disabled && ''
        } else {
            return moveName
        } 
    }
    
    return (
        <Grid item xs={xs} sx={{...gridStyles, ...typeStyles, ...selectedStyles, ...infoStyles}} onClick={onClickFunc}>
            <Typography sx={{...textStyles, ...otherTextStyles}}>{disabledWholeEMSelection ? '' : displayText()}</Typography>
        </Grid>
    )
}