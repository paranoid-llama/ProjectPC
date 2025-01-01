import {Box, Typography, useTheme, TableCell, Grid} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setPokemon } from '../../../app/slices/tradeoffer'
import { selectIfPokemonIsSelected } from '../../../app/selectors/tradeselectors'
import { deselect } from '../../../app/slices/editmode'
import getMoveStyles from '../../../../utils/functions/eggmoves/getmovestyles'

export default function EggMoveColumnDisplay({emKeyLiteral, 
    EMs, 
    emCount, 
    baseStyles={tableCell: {textAlign: 'center', height: '72px'}, bodyColor: {margin: 0, padding: '16px', borderRadius: '10px'}}, 
    isEditMode, onClickFunc, blackSquare, flaggedForDeletion, 
    isTradePage, tradeSide, tradeDispData, 
    skeleton=false, boxWrapper=false, customSx={}, 
    centeredGridItems=false, 
    customPadding=4.5, 
    customInnerWrapperSx={}}) {
    const theme = useTheme()
    const blackSquareStyles = blackSquare ? {backgroundColor: 'black'} : {}
    const hoverSx = isEditMode ? {':hover': {cursor: 'pointer'}} : {}
    const isSelectedForTrade = isTradePage ? useSelector((state) => selectIfPokemonIsSelected(state, tradeSide, {name: tradeDispData.pData.name, ball: tradeDispData.ballData.ball, onhandId: tradeDispData.ballData.onhandId})) : false
    const dispatchTradeChange = isTradePage ? () => dispatch(setPokemon({pData: tradeDispData.pData, ballData: tradeDispData.ballData, tradeSide})) : false

 
    const ChosenWrapper = boxWrapper ? Box : TableCell
    const centerGridIStyles = centeredGridItems ? {...theme.components.box.fullCenterCol} : {}

    if (EMs === undefined) {
        return (
            <ChosenWrapper
                padding='none' 
                sx={{...blackSquareStyles, ...hoverSx}}
                onClick={(isTradePage && !isSelectedForTrade) ? dispatchTradeChange : (isEditMode && !flaggedForDeletion) ? onClickFunc : null}
            ></ChosenWrapper>
        )
    }

    if (skeleton) { //see onhandrowcontent
        return (
            <ChosenWrapper
                padding='none' 
                sx={{...baseStyles.tableCell}}
            >
                <Box sx={{...baseStyles.bodyColor, position: 'relative', padding: 4.5, ...theme.components.box.fullCenterCol}}>
                    <Grid container sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', alignItems: 'start', width: '100%', height: '100%', position: 'absolute'}}>
                        <Grid item xs={6} sx={{width: '50%', height: '50%', ...centerGridIStyles}}><Box sx={{...theme.components.box.fullCenterCol, backgroundColor: 'rgb(100, 100, 100)', width: '95%', height: '95%', borderRadius: '10px'}}></Box></Grid>
                        <Grid item xs={6} sx={{width: '50%', height: '50%', ...centerGridIStyles}}><Box sx={{...theme.components.box.fullCenterCol, backgroundColor: 'rgb(100, 100, 100)', width: '95%', height: '95%', borderRadius: '10px'}}></Box></Grid>
                        <Grid item xs={6} sx={{width: '50%', height: '50%', ...centerGridIStyles}}><Box sx={{...theme.components.box.fullCenterCol, backgroundColor: 'rgb(100, 100, 100)', width: '95%', height: '95%', borderRadius: '10px'}}></Box></Grid>
                        <Grid item xs={6} sx={{width: '50%', height: '50%', ...centerGridIStyles}}><Box sx={{...theme.components.box.fullCenterCol, backgroundColor: 'rgb(100, 100, 100)', width: '95%', height: '95%', borderRadius: '10px'}}></Box></Grid>
                    </Grid>
                </Box>
            </ChosenWrapper>
        )
    }
    
    const noInfoStyles = {opacity: 0.5} 
    const dispatch = useDispatch()
    const deselectFunc = () => dispatch(deselect())

    if (isTradePage) { //supposed to be if is on-hand and trade page, but this component is only used for on-hands. update if it changes.
        if (tradeDispData.fullData.isHA !== undefined) {tradeDispData.ballData.isHA = tradeDispData.fullData.isHA}
        if (tradeDispData.fullData.emCount !== undefined) {
            tradeDispData.ballData.emCount = tradeDispData.fullData.emCount
            tradeDispData.ballData.EMs = tradeDispData.fullData.EMs
        }
    }

    const displayEggMoves = () => {
        const renderedEms = EMs.slice(0, emCount)
        if (emCount > EMs.length) {
            const noInfoCount = emCount - EMs.length
            for (let i=0;i < noInfoCount;i++) {
                renderedEms.push('none')
            }
        }
        return (
            <Grid container sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', alignItems: 'start', width: '100%', height: '100%', position: 'absolute'}}>
                {renderedEms.map((rEm, idx) => {
                    const moveStyles = rEm === 'none' ? {backgroundColor: 'rgb(100, 100, 100)', color: 'white'} : getMoveStyles(rEm)
                    return (
                        <Grid item xs={6} key={emKeyLiteral(idx+1)} sx={{width: '50%', height: '50%', ...centerGridIStyles}}>
                            <Box sx={{...theme.components.box.fullCenterCol, ...moveStyles, width: '95%', height: '95%', borderRadius: '10px'}}>
                                <Typography sx={{width: '100%', textAlign: 'center', fontSize: '12px'}}>
                                    {rEm === 'none' ? <i>No Info</i> : rEm}
                                </Typography>
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    return (
        <ChosenWrapper 
            padding='none' 
            sx={!(blackSquare) ? {...baseStyles.tableCell, ...hoverSx, ...customSx} : {...blackSquareStyles, ...hoverSx}}
            onClick={(isTradePage && !isSelectedForTrade) ? dispatchTradeChange : (isEditMode && !flaggedForDeletion) ? onClickFunc : null}
        >
            <Box sx={!(blackSquare) ? {...baseStyles.bodyColor, position: 'relative', padding: customPadding, ...theme.components.box.fullCenterCol, ...customInnerWrapperSx} : {}}>
                {emCount === 0 ? <Typography sx={{color: 'grey'}}><i>No Egg Moves</i></Typography> : 
                !blackSquare && displayEggMoves()}
            </Box>
        </ChosenWrapper>
    )
}