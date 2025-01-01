import {Grid, Box, ToggleButton, ToggleButtonGroup, Tooltip, ClickAwayListener} from '@mui/material'
import SWEditEggMovesForm from '../../selection/smallwidth/editors/swediteggmovesform'
import EggMove from './../eggmovecomponents/eggmove'

export default function RenderEggMoves({emCount, EMs, maxEms, idxOfSelectedEM, changeEMScreen=false, toggleScreen=undefined, handleEMChange, disabledSelection=false, noInfoBgColor, displayType='none', otherEmTextStyles={}}) {
    const isOnHandEdit = displayType === 'onHandEditEMs'
    // console.log(o)
    const renderEggMoveSlots = () => {
        return(
            Array.from(Array(maxEms).keys()).map(a => {
                const selected = idxOfSelectedEM === a 
                const noInfo = (emCount >= (a+1) && EMs[a] === undefined)
                const isEggMove = (EMs[a] && emCount >= (a+1))
                const addEm = emCount < (a+1) && (a) <= emCount
                const disabled = emCount < (a+1) && !((a) <= emCount)
                const keyIdentifier = `EM Slot ${a+1}`
                return(
                    <EggMove 
                        moveName={isEggMove ? EMs[a] : 'none'} 
                        onClickFunc={disabledSelection ? undefined : ((addEm || noInfo) && (idxOfSelectedEM === '')) ? //if it is not an egg move in the slot AND theres no selected EM (possible EMs haven't popped out yet), move on
                        (addEm && maxEms === 1) ? () => handleEMChange('onlyOnePossibleEM') : //if there is only one possible egg move and they dont have it, just add it without opening the possible em screen
                        (toggleScreen !== undefined && (() => toggleScreen())) : //toggles the screen to show possible egg move selections
                            isEggMove ? (e) => handleEMChange(e) : undefined} //deletes the eggmove if there is an egg move in the slot (handled in the function)
                        displayType='currentEggMoves'
                        selected={selected}
                        displayNoInfo={noInfo}
                        displayAddEM={addEm}
                        disabled={disabled}
                        disabledWholeEMSelection={disabledSelection}
                        noInfoBgColor={noInfoBgColor}
                        key={keyIdentifier}
                        otherTextStyles={otherEmTextStyles}
                    /> 
                )
            })
        )
    }

    const renderEggMovesToChangeEms = () => {
        return (
            Array.from(Array(maxEms).keys()).map(a => {
                const selected = idxOfSelectedEM === a 
                const isEggMove = EMs[a] !== undefined
                const disabled = emCount < (a+1) && !((a) <= emCount)
                const displayModifier = displayType === 'onHandEditEMs' ? 'onHandEditEMs' : 'editScreenCurrentEMs'
                const keyIdentifier = `ChangeEMScreen - EM${a+1}`
                return (
                    <EggMove 
                        moveName={isEggMove ? EMs[a] : ''}
                        displayType={displayModifier}
                        onClickFunc={isEggMove ? (e) => handleEMChange(e) : undefined}
                        selected={selected}
                        disabled={disabled}
                        dropDownMenu={true}
                        key={keyIdentifier}
                        otherTextStyles={otherEmTextStyles}
                    />
                )
            })
        )
    }

    return (
        <Grid container sx={{height: '100%', width: '100%', marginLeft: (changeEMScreen) ? '0px' : '3px'}} spacing={displayType === 'onHandEditEMs' ? 0 : 0}>
            {changeEMScreen ? renderEggMovesToChangeEms() : renderEggMoveSlots()}
        </Grid>
    )
}