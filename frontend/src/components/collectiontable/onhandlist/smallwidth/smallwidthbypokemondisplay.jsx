import {Box, Typography, useTheme, TableCell, Tooltip, Button} from '@mui/material'
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from "react-redux";
import { selectByPokemonOHData, seeIfPokemonIsSelected, selectOwnedBallsAndHangingOnHandBallsList } from '../../../../app/selectors/selectors';
import Selection from '../../selection';
import { homeDisplayGames, apriballs } from '../../../../../common/infoconstants/miscconstants.mjs';
import { setQtyByPokemon } from '../../../../app/slices/collectionstate';
import { setSelected, setUnsavedChanges, deselect, toggleOnHandIdToDelete } from '../../../../app/slices/editmode';
import { OnHandQtyDisplay } from '../bypokemoncomponents';
import ImgData from '../../tabledata/imgdata';
import { getGameColor } from '../../../../../common/infoconstants/miscconstants.mjs';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

function SmallWidthByPokemonDisplay({cols1, cols2, row={}, pokemonId, isEditMode, isSelected, setSelected, styles, availableGames=undefined, row1Balls, row2Balls, noRow2, nameLabel, allowedBalls}) {
    const dispatch = useDispatch()
    const theme = useTheme()
    if (row === undefined || Object.keys(row).length === 0) { //see onhandbypokemondisplay.jsx for why this is needed
        return <TableCell sx={{...theme.components.box.fullCenterCol, position: 'relative', height: noRow2 ? '131.344px' : '181.344px', color: 'white', width: '100%', padding: 0, backgroundColor: 'black'}}>
        </TableCell>
    }

    const displayAvailableGames = availableGames !== undefined
    const deleteOnHandMode = isEditMode ? useSelector((state) => state.editmode.deleteOnHandMode) : null
    const ohIdsFlagged = isEditMode ? useSelector((state) => state.editmode.deletedOnHandIds) : null
    const deletedFromMemory = allowedBalls === 'DELETED FROM MEMORY'

    const handleEditQty = (ball, increment, addingNew, removeMonFromDisplay) => {
        dispatch(setQtyByPokemon({pokeId: pokemonId, ball, increment, addingNew, removeMonFromDisplay, smScreen: true, allowedBalls}))
        dispatch(setUnsavedChanges('onhand'))
    }

    console.log(row)
    return (
        <>
            <TableCell sx={{...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.main, position: 'relative', height: noRow2 ? '131.344px' : '181.344px', color: 'white', width: '100%', padding: 0}}>
                {isSelected && <Selection height={'183px'} deselectFunc={() => dispatch(deselect())} otherStyles={{top: '-98px'}}/>}
                <Box 
                    sx={{
                        ...theme.components.box.fullCenterRow, 
                        height: '29.344px', 
                        width: '100%', 
                        backgroundColor: theme.palette.color2.dark, 
                        margin: 0, 
                        padding: '16px', 
                        borderRadius: '10px',
                        ':hover': {cursor: (isEditMode && !deleteOnHandMode) ? 'pointer' : 'auto'}
                    }}
                    onClick={deleteOnHandMode ? undefined : setSelected}
                >
                    <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '20%'}}>
                        <Typography>#{row.natDexNum}</Typography>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '15%'}}>
                        <ImgData type='poke' linkKey={row.imgLink} size='40px'/>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'center', width: '65%', position: 'relative'}}>
                        <Typography><b>{nameLabel}</b></Typography>
                        
                        {displayAvailableGames && 
                        <Box sx={{position: 'absolute', top: '100%', ...theme.components.box.fullCenterRow}}>
                        {homeDisplayGames.map((game, idx) => {
                            const nameOfGame = game === 9 ? 'S/V' : game === 'swsh' ? 'SW/SH' : game === 'bdsp' && 'BD/SP'
                            const firstGame = nameOfGame.slice(0, nameOfGame.indexOf('/'))
                            const secondGame = nameOfGame.slice(nameOfGame.indexOf('/')+1, nameOfGame.length)
                            const firstGameColor = getGameColor(firstGame)
                            const secondGameColor = getGameColor(secondGame)
                            const gamesEnabled = availableGames.includes(game)
                            const margin = idx !== 0 ? {ml: 1} : {} 
                            return (
                                <Box key={`available-home-games-display-${nameOfGame}`} sx={{display: 'flex'}}>
                                    <Typography sx={{fontSize: '10px', color: firstGameColor, opacity: gamesEnabled ? 1 : 0.4, ...margin}}>{firstGame}</Typography>
                                    <Typography sx={{fontSize: '10px', color: secondGameColor, opacity: gamesEnabled ? 1 : 0.4}}>/{secondGame}</Typography>
                                </Box>
                            )
                        })}
                        </Box>
                        }
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', height: '90%', width: '100%', color: 'white', position: 'relative'}}>
                    <Box sx={{width: '100%', height: '50%', ...theme.components.box.fullCenterRow, borderBottom: '1px solid black', borderTop: '1px solid black'}}>
                        {/* <SmallWidthBallArea 
                            p={row}
                            rowBalls={row1Balls}
                            isEditMode={isEditMode}
                            handleEditBallInfo={handleEditBallInfo}
                            collectionId={collectionId}
                            allowedBallsTotal={row1Balls.concat(row2Balls).filter(b => row.balls[b] !== undefined && row.balls[b].disabled === undefined)}
                        /> */}
                        {cols1.map(bC => {
                            const b = bC.dataKey
                            const isBallQty = apriballs.includes(b)
                            const isBlackSquare = row.balls === undefined || (isBallQty && row.balls[b] === undefined) || isBallQty && row.balls[b] !== undefined && row.balls[b].numTotal === 0
                            const bData = !isBlackSquare && row.balls[b]
                            const bSStyle = isBlackSquare ? {backgroundColor: 'black'} : {}
                            const editModeStyles = isEditMode ? 
                                (deleteOnHandMode && !isBlackSquare) ? {':hover': {cursor: 'pointer'}, position: 'relative'} : {position: 'relative'} : {}
                            const deletionFlag = `${pokemonId} ${b}`
                            const flaggedForDeletion = (deleteOnHandMode && !isBlackSquare) && ohIdsFlagged.includes(deletionFlag)
                            const isLastBallQty = isBallQty && row.balls[b] !== undefined && row.balls[b].numTotal === 1 && Object.values(row.balls).map(bD => bD.numTotal).reduce((acc, cV) => acc+cV, 0) === 1
                            const addDecrementOnClick = (isEditMode && !deleteOnHandMode && !deletedFromMemory) ? (isBlackSquare && !allowedBalls.includes(b)) ? undefined : (inc, addingNew) => handleEditQty(b, inc, addingNew, !inc && isLastBallQty) : undefined
                            return (
                                <Box 
                                    sx={{
                                        width: bC.width, 
                                        height: '100%', 
                                        ...theme.components.box.fullCenterCol, 
                                        borderRight: '1px solid black', borderLeft: '1px solid black', 
                                        ...bSStyle, ...editModeStyles
                                    }}
                                    key={`sw-by-pokemon-display-${pokemonId}-${b}`}
                                    onClick={(deleteOnHandMode && !isBlackSquare) ? () => dispatch(toggleOnHandIdToDelete(deletionFlag)) : undefined}
                                >
                                    {(deleteOnHandMode && flaggedForDeletion && !isBlackSquare) &&
                                        <Box sx={{position: 'absolute', backgroundColor: 'rgba(200, 40, 40, 0.1)', border: '3px solid rgb(200, 40, 40)', width: '95%', height: '95%', top: '-2px', zIndex: 1, left: '0px', ':hover': {backgroundColor: 'rgba(200, 40, 40, 0.3)'}}}>

                                        </Box>
                                    }
                                    <Box sx={{width: '95%', height: '95%', ...theme.components.box.fullCenterCol, backgroundColor: isBlackSquare ? 'none' : theme.palette.color2.dark, borderRadius: '10px', position: 'relative'}}>
                                        {!isBlackSquare &&
                                        <>
                                        <Box sx={{opacity: 0.2, position: 'absolute', width: '100%', height: '100%', ...theme.components.box.fullCenterCol}}>
                                            <ImgData type='ball' linkKey={b} size='50px'/>
                                        </Box>
                                        <Box sx={{...styles.indicators.indicatorRowTop, width: '100%', height: '100%'}}>
                                        {(bData.numNonHA !== 0 && bData.numNonHA !== undefined) &&
                                            <Tooltip title="The number of this on-hand which don't have their hidden ability" arrow>
                                                <Typography
                                                    sx={{
                                                        position: 'absolute', 
                                                        top: '0px', 
                                                        color: 'white', 
                                                        fontSize: '10px', 
                                                        width: '100%',
                                                        display: 'flex', 
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        ':hover': {cursor: 'pointer'}
                                                    }}
                                                >
                                                    N-HA: {bData.numNonHA}
                                                </Typography>
                                            </Tooltip>}
                                        </Box>
                                        <Typography 
                                            sx={{
                                                position: 'absolute',
                                                fontWeight: 700,
                                                fontSize: '20px',
                                                textShadow: 'black 1px 0 18px;'
                                            }}
                                        >
                                            {bData.numTotal}
                                        </Typography>
                                        <Box sx={{...styles.indicators.indicatorRow, display: 'flex', width: '100%', height: '100%'}}> 
                                            {bData.reserved !== 0 && bData.reserved !== undefined &&
                                            <Tooltip title='This On-Hand is reserved and is pending in an accepted trade/trade offer. The number indicates the reserved quantity.' arrow>
                                                <Typography
                                                    sx={{
                                                        position: 'absolute', 
                                                        bottom: '0px', 
                                                        color: 'white', 
                                                        fontSize: '10px', 
                                                        width: '100%',
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        ':hover': {cursor: 'pointer'}
                                                    }}
                                                >
                                                    Res: {reserved}
                                                </Typography>
                                            </Tooltip>}
                                        </Box>
                                        </>
                                        }
                                    </Box>
                                    {(isEditMode && isBlackSquare && !deleteOnHandMode && allowedBalls.includes(b) && !deletedFromMemory) && //indicates you can increment by one
                                        <Button sx={{width: '100%', minWidth: '0px', height: '100%', position: 'absolute', top: '0px', left: '0px', padding: 0, zIndex: 1}} fullWidth onClick={() => addDecrementOnClick(true, true)}>
                                            <ControlPointIcon sx={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                                        </Button>
                                    }
                                    {(isEditMode && !isBlackSquare && !deleteOnHandMode && !deletedFromMemory) && //indicates you can increment by one
                                        <>
                                        <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', top: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => addDecrementOnClick(true)}></Button>
                                        <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', bottom: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => addDecrementOnClick(false)}></Button>
                                        </>
                                    }
                                </Box>
                            )
                        })}
                    </Box>
                    {!noRow2 &&
                    <Box sx={{width: '100%', height: '50%', ...theme.components.box.fullCenterRow}}>
                        {/* <SmallWidthBallArea 
                            p={row}
                            rowBalls={row2Balls}
                            isEditMode={isEditMode}
                            handleEditBallInfo={handleEditBallInfo}
                            collectionId={collectionId}
                            isRow2={true}
                            allowedBallsTotal={row1Balls.concat(row2Balls).filter(b => row.balls[b] !== undefined && row.balls[b].disabled === undefined)}
                        /> */}
                        {cols2.map(bC => {
                            const b = bC.dataKey
                            const isBallQty = apriballs.includes(b)
                            const isBlackSquare = row.balls === undefined || (isBallQty && row.balls[b] === undefined) || isBallQty && row.balls[b] !== undefined && row.balls[b].numTotal === 0
                            const bData = !isBlackSquare && row.balls[b]
                            const width = bC.width
                            const bSStyle = isBlackSquare ? {backgroundColor: 'black'} : {}
                            const editModeStyles = isEditMode ? 
                                (deleteOnHandMode && !isBlackSquare) ? {':hover': {cursor: 'pointer'}, position: 'relative'} : {position: 'relative'} : {}
                            const deletionFlag = `${pokemonId} ${b}`
                            const flaggedForDeletion = (deleteOnHandMode && !isBlackSquare) && ohIdsFlagged.includes(deletionFlag)
                            const isLastBallQty = isBallQty && row.balls[b] !== undefined && row.balls[b].numTotal === 1 && Object.values(row.balls).map(bD => bD.numTotal).reduce((acc, cV) => acc+cV, 0) === 1
                            const addDecrementOnClick = (isEditMode && !deleteOnHandMode && !deletedFromMemory) ? (isBlackSquare && !allowedBalls.includes(b)) ? undefined : (inc, addingNew) => handleEditQty(b, inc, addingNew, !inc && isLastBallQty) : undefined
                            return (
                                <Box sx={{
                                    width, 
                                    height: '100%', 
                                    ...theme.components.box.fullCenterCol, 
                                    borderRight: '1px solid black', borderLeft: '1px solid black', 
                                    ...bSStyle, ...editModeStyles
                                }}
                                    key={`sw-by-pokemon-display-${pokemonId}-${b}`}
                                    onClick={(deleteOnHandMode && !isBlackSquare) ? () => dispatch(toggleOnHandIdToDelete(deletionFlag)) : undefined}
                                >
                                    {(deleteOnHandMode && flaggedForDeletion && !isBlackSquare) &&
                                        <Box sx={{position: 'absolute', backgroundColor: 'rgba(200, 40, 40, 0.1)', border: '3px solid rgb(200, 40, 40)', width: '95%', height: '95%', top: '-2px', zIndex: 1, left: '0px', ':hover': {backgroundColor: 'rgba(200, 40, 40, 0.3)'}}}>

                                        </Box>
                                    }
                                    <Box sx={{width: '95%', height: '95%', ...theme.components.box.fullCenterCol, backgroundColor: isBlackSquare ? 'none' : theme.palette.color2.dark, borderRadius: '10px', position: 'relative'}}>
                                        {!isBlackSquare &&
                                        <>
                                        <Box sx={{opacity: 0.2, position: 'absolute', width: '100%', height: '100%', ...theme.components.box.fullCenterCol}}>
                                            <ImgData type='ball' linkKey={b} size='50px'/>
                                        </Box>
                                        <Box sx={{position: 'relative', width: '100%', height: '100%'}}>
                                        {bData.numNonHA !== 0 && bData.numNonHA !== undefined &&
                                            <Tooltip title="The number of this on-hand which don't have their hidden ability" arrow>
                                                <Typography
                                                    sx={{
                                                        position: 'absolute', 
                                                        top: '0px', 
                                                        color: 'white', 
                                                        fontSize: '10px', 
                                                        width: '100%',
                                                        display: 'flex', 
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        ':hover': {cursor: 'pointer'}
                                                    }}
                                                >
                                                    N-HA: {bData.numNonHA}
                                                </Typography>
                                            </Tooltip>}
                                        </Box>
                                        <Box sx={{height: '100%', ...theme.components.box.fullCenterRow}}>
                                        <Typography 
                                            sx={{
                                                position: 'absolute',
                                                fontWeight: 700,
                                                fontSize: '20px',
                                                textShadow: 'black 1px 0 18px;'
                                            }}
                                        >
                                            {bData.numTotal}
                                        </Typography>
                                        </Box>
                                        <Box sx={{position: 'relative', width: '100%', height: '100%'}}>
                                            {bData.reserved !== 0 && bData.reserved !== undefined &&
                                            <Tooltip title='This On-Hand is reserved and is pending in an accepted trade/trade offer. The number indicates the reserved quantity.' arrow>
                                                <Typography
                                                    sx={{
                                                        position: 'absolute', 
                                                        bottom: '0px', 
                                                        color: 'white', 
                                                        fontSize: '10px', 
                                                        width: '100%',
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        ':hover': {cursor: 'pointer'}
                                                    }}
                                                >
                                                    Res: {bData.reserved}
                                                </Typography>
                                            </Tooltip>}
                                        </Box>
                                        </>}
                                    </Box>
                                    {(isEditMode && isBlackSquare && !deleteOnHandMode && allowedBalls.includes(b) && !deletedFromMemory) && //indicates you can increment by one
                                        <Button sx={{width: '100%', minWidth: '0px', height: '100%', position: 'absolute', top: '0px', left: '0px', padding: 0, zIndex: 1}} fullWidth onClick={() => addDecrementOnClick(true, true)}>
                                            <ControlPointIcon sx={{color: 'rgba(255, 255, 255, 0.5)'}}/>
                                        </Button>
                                    }
                                    {(isEditMode && !isBlackSquare && !deleteOnHandMode && !deletedFromMemory) && //indicates you can increment by one
                                        <>
                                        <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', top: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => addDecrementOnClick(true)}></Button>
                                        <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', bottom: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => addDecrementOnClick(false)}></Button>
                                        </>
                                    }
                                </Box>
                            )
                        })}
                    </Box>
                    }
                </Box>
            </TableCell>
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    //this mapStateToProps is in a unique situation. 
    //the selector function below needs to not return a new object reference or it is not memoized properly, and as such 
    //the sw ball selection dragging movement re-renders all rows and makes it SUPER slow.
    // the sw collection and onhand work because they do precisely NOT that.
    //we work around it by calling areStatesEqual which function similarly to a memo - it determines whether mapstatetoprops gets called in the first place on state dispatches
    const pokemon = selectByPokemonOHData(state, ownProps.pokemonId)
    const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
    const allowedBalls = selectOwnedBallsAndHangingOnHandBallsList(state, ownProps.pokemonId)
    return {
        row: pokemon,
        isSelected,
        allowedBalls
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected({selected: ownProps.pokemonId, regSetSelected: true}))
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps,
    null,
    {
        areStatesEqual: 
            (next, prev, nextOp, prevOp) => {
                const prevMatchingOnhands = prev.collectionState.onhand.filter(p => p.imgLink === prevOp.pokemonId)
                const nextMatchingOnhands = next.collectionState.onhand.filter(p => p.imgLink === prevOp.pokemonId)
                const prevBallQtyTotal = prevMatchingOnhands.reduce((acc, cV) => acc+cV.qty, 0)
                const nextBallQtyTotal = nextMatchingOnhands.reduce((acc, cV) => acc+cV.qty, 0)
                const prevnHABallQtyTotal = prevMatchingOnhands.filter(p => p.isHA !== undefined && p.isHA === false).reduce((acc, cV) => acc+cV.qty, 0)
                const nextnHABallQtyTotal = nextMatchingOnhands.filter(p => p.isHA !== undefined && p.isHA === false).reduce((acc, cV) => acc+cV.qty, 0)
                //nextMatchingOnhands[idx]!==undefined needs to be checked in case pokemon were deleted from the row
                const matchingBalls = prevMatchingOnhands.map(oh => oh.ball).filter((b, idx) => nextMatchingOnhands[idx]!==undefined && nextMatchingOnhands[idx].ball !== b).length === 0 
                return next.editmode.selected === prev.editmode.selected && 
                    prevBallQtyTotal === nextBallQtyTotal && 
                    prevnHABallQtyTotal === nextnHABallQtyTotal &&
                    nextOp.isEditMode === prevOp.isEditMode && matchingBalls
            }
    }
)(SmallWidthByPokemonDisplay)