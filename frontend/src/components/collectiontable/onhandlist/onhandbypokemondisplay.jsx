import DataCell from "../tabledata/datacell";
import { connect, useSelector, useDispatch } from "react-redux";
import { TableCell, Box, Typography } from "@mui/material";
import ImgData from "../tabledata/imgdata";
import { apriballs, homeDisplayGames, getGameColor } from "../../../../common/infoconstants/miscconstants.mjs";
import { OnHandQtyDisplay } from "./bypokemoncomponents";
import { selectCollectionPokemon, seeIfPokemonIsSelected, selectByPokemonOHData, selectOwnedBallsList, selectOwnedBallsAndHangingOnHandBallsList } from "../../../app/selectors/selectors";
import { setMaxEmArr } from "../../../../utils/functions/misc";
import { deselect, setSelected, setUnsavedChanges, toggleOnHandIdToDelete } from "../../../app/slices/editmode";
import newObjectId from "../../../../utils/functions/newobjectid";
import { setQtyByPokemon } from "../../../app/slices/collectionstate";
import Selection from "../selection";
import getNameDisplay from "../../../../utils/functions/display/getnamedisplay";

function OnHandByPokemonDisplay({columns, row, pokemonId, isEditMode, isSelected, setSelected, styles, availableGames=undefined, demo, userData, isHomeCollection, localHandleChange=null}) {
    // console.log(row)
    // console.log(columns)
    const dispatch = useDispatch()
    const displayAvailableGames = availableGames !== undefined
    if (row === undefined) { //when switching between collections theres seems to be a bit of lag in updating the state, even though i tried to stop it.
        //this is also needed since deleting a single pokemon (via edit bar -> detailed edit), the delete dispatch also has lag for whatever reason
        // and that undefined pokemon is called in the list display. the selector accounts for this and returns undefined in that case.
        return <>
            {columns.map(c => {
                return (
                    <TableCell key={`${c.dataKey}-${newObjectId()}-undefined-row`} sx={{backgroundColor: 'black'}}></TableCell>
                )
            })}
        </>
    }

    const allowedBalls = isEditMode ? useSelector((state) => selectOwnedBallsAndHangingOnHandBallsList(state, pokemonId)) : null
    const deleteOnHandMode = isEditMode ? useSelector((state) => state.editmode.deleteOnHandMode) : null
    const ohIdsFlagged = isEditMode ? useSelector((state) => state.editmode.deletedOnHandIds) : null
    const deselectFunc = () => {dispatch(deselect())}

    const handleEditQty = (ball, increment, addingNew, removeMonFromDisplay) => {
        dispatch(setQtyByPokemon({pokeId: pokemonId, ball, increment, addingNew, removeMonFromDisplay}))
        dispatch(setUnsavedChanges('onhand'))
    }

    return (
        <>
        {columns.map(c => {
            // console.log(row)
            const isBallQty = apriballs.includes(c.dataKey)
            const isBlackSquare = row.balls === undefined || (isBallQty && row.balls[c.dataKey] === undefined) || isBallQty && (row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].numTotal === 0)
            
            const label = !isBlackSquare && (isBallQty ? row.balls[c.dataKey] : c.dataKey === 'name' ? getNameDisplay(!userData.loggedIn ? undefined : userData.user.settings.display.pokemonNames, row[c.dataKey], row.natDexNum) : row[c.dataKey])
            const alignment = c.label === '#' ? {width: '90%', position: 'relative'} :
            (c.label === 'img') ? {width: '90%'} : {width: '90%', position: 'relative'}
            const displayHomeGames = c.dataKey === 'name' && displayAvailableGames
            const deleteFlag = `${row.imgLink} ${c.dataKey}`
            const isLastBallQty = isBallQty && row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].numTotal === 1 && Object.values(row.balls).map(bD => bD.numTotal).reduce((acc, cV) => acc+cV, 0) === 1
            const onClickFunc = isBallQty ? 
                (isEditMode) ? 
                    deleteOnHandMode ? (isBlackSquare || row.balls[c.dataKey].numTotal === 0) ? undefined : () => dispatch(toggleOnHandIdToDelete(deleteFlag)) : 
                    allowedBalls.includes(c.dataKey) ? (inc, addingNew) => handleEditQty(c.dataKey, inc, addingNew, !inc && isLastBallQty) : 
                    undefined : undefined :
                undefined
            const leftMostCell = c.label === '#'
            const hoverSx = isEditMode && !isBallQty ? {':hover': {cursor: 'pointer'}} : {}
            
            return (
                isBallQty ? 
                <OnHandQtyDisplay 
                    key={`onhand-${row.name}-${c.dataKey}-qty`}
                    qty={!isBlackSquare && row.balls[c.dataKey].numTotal}
                    nonHAQty={!isBlackSquare && (row.balls[c.dataKey].numNonHA === undefined ? 0 : row.balls[c.dataKey].numNonHA)}
                    reserved={!isBlackSquare && row.balls[c.dataKey].reserved}
                    styles={styles}
                    blackSquare={isBlackSquare}
                    onClickFunc={onClickFunc}
                    isSelected={isSelected}
                    deleteOnHandMode={deleteOnHandMode}
                    flaggedForDeletion={deleteOnHandMode && ohIdsFlagged.includes(deleteFlag)}
                /> : 
                <TableCell 
                    key={`onhand-${row.name}-${c.label === 'img' ? 'img' : c.dataKey}-column`}
                    padding='none' 
                    sx={!(isBlackSquare) ? {...styles.tableCell, height: '72px', ...hoverSx} : {backgroundColor: 'black'}}
                    onClick={(!isBlackSquare && isEditMode && !isSelected && !deleteOnHandMode) ? setSelected : undefined}
                >
                    {(leftMostCell && isSelected) && 
                        <Selection 
                            height={'76px'} 
                            onhandSelection={true} 
                            otherStyles={deleteOnHandMode ? {backgroundColor: 'rgba(225, 30, 30, 0.2)', borderColor: 'rgba(150, 30, 30, 1)', top: '-7px'} : {top: '-7px'}} 
                            deselectFunc={deleteOnHandMode ? onClickFunc : localHandleChange !== null ? localHandleChange : deselectFunc}
                        />
                    }
                    <Box sx={{display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                        <Box sx={{...styles.bodyColor, ...alignment, height: '32px'}}>
                            {c.isImg ? 
                            <><Box sx={{position: 'absolute', top: 'calc(50% - 16px)', right: 'calc(50% - 16px)'}}><ImgData type='poke' size='32px' linkKey={row.imgLink}/></Box></> :
                            !(isBlackSquare) && 
                                <Typography 
                                    sx={{
                                        width: '100%', 
                                        height: '100%', 
                                        textAlign: 'center', 
                                        position: 'absolute', 
                                        left: '0px', top: '0px', 
                                        display: 'flex',
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: '14px'
                                    }} 
                                    variant={'body2'}
                                >
                                    {label}
                                </Typography>
                            }
                            {displayHomeGames &&  
                            <Box sx={{position: 'absolute', fontSize: '10px', width: '80%', right: '10%', bottom: '-3px', display: 'flex', justifyContent: 'center'}}>
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
                </TableCell>
            )
        })}
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.isEditMode) {
        return {}
    }
    const pokemon = selectByPokemonOHData(state, ownProps.pokemonId)
    const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
    return {
        row: pokemon,
        isSelected
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (!ownProps.isEditMode) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected(ownProps.pokemonId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnHandByPokemonDisplay)