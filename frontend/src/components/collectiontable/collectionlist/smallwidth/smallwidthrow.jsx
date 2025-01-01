import {Box, Typography, TableCell, TableRow, useTheme} from '@mui/material'
import { useSelector, useDispatch, connect } from 'react-redux'
import { setMaxEmArr, selectNextEmCount } from '../../../../../utils/functions/misc'
import { seeIfPokemonIsSelected, selectCollectionPokemon } from '../../../../app/selectors/selectors'
import { setSelected, setSelectedAfterChangingOwned, setUnsavedChanges, deselect } from '../../../../app/slices/editmode'
import { setIsOwned, setIsHA, setEmCount, setEms, deleteEms } from '../../../../app/slices/collectionstate'
import getDefaultData from '../../../../../utils/functions/defaultdata'
import newObjectId from '../../../../../utils/functions/newobjectid'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../tabledata/imgdata'
import SmallWidthBallArea from './smallwidthballarea'
import Selection from '../../selection'
import { getGameColor, homeDisplayGames } from '../../../../../common/infoconstants/miscconstants.mjs'

export function ConnectlessSmallWidthColRow({row, id, isCollectionOwner, ownerId, isEditMode, isHomeCollection, availableGames, noStates, isTradePage, tradeSide, wantedByOtherList, userData}) {

}

function SmallWidthColRow({row, isSelected, collectionId, setSelected, ballScopeDisplay, id, isCollectionOwner, ownerId, isEditMode, isHomeCollection, userData, row1Balls, row2Balls}) {
    const dispatch = useDispatch()
    const theme = useTheme()

    if (row === undefined) { //when switching between collections theres seems to be a bit of lag in updating the state, even though i tried to stop it.
        return <>
            <TableCell key={`${id}-${newObjectId()}-undefined-row`} sx={{backgroundColor: 'black', height: '165px'}}></TableCell>
        </>
    }

    const noRow2 = row2Balls.length === 0

    //following data is used for editing values in the list
    const possibleEggMoves = (isEditMode && !isHomeCollection) ? useSelector((state) => state.collectionState.eggMoveInfo[row.name]) : null
    const availableGames = (isHomeCollection) ? useSelector((state) => state.collectionState.availableGamesInfo[row.name]) : null
    const maxEMs = (isEditMode && !isHomeCollection) ? possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length : null
    const emCountSelectionList = (isEditMode && !isHomeCollection) ? setMaxEmArr(maxEMs) : null
    const idx = isEditMode ? useSelector(state => state.collectionState.collection.findIndex((p) => p.imgLink === id)) : null
    const unsavedChanges = isEditMode ? useSelector((state) => state.editmode.unsavedChanges) : null

    //default data
    const globalDefaults = isEditMode ? useSelector((state) => state.collectionState.options.globalDefaults) : null
    const checkDefault = Object.keys(row.balls)[Object.values(row.balls).map((b) => b.default !== undefined).indexOf(true)]
    const currentDefault = checkDefault === undefined ? 'none' : checkDefault

    const handleEditBallInfo = (e, key, pokename, ballname, collectionID, ownerID) => {
        const newValue = 
            (
                key === 'isOwned' ? e.target.checked :
                key === 'isHA' ? !(e.target.value === 'true') :
                key === 'emCount' ? selectNextEmCount(emCountSelectionList, parseInt(e.target.value)) :
                key === 'EMs' && 'none'
            )
        const deleteEMs = key === 'emCount' && row.balls[ballname].EMs.length > newValue
        const hasAllPossibleEMs = key === 'emCount' && newValue === possibleEggMoves.length
        const defaultData = key === 'emCount' ? (deleteEMs ? {EMs: []} : hasAllPossibleEMs ? {EMs: possibleEggMoves} : undefined) : getDefaultData(globalDefaults, currentDefault, row.balls, maxEMs, possibleEggMoves, ballname)
        if (key === 'isOwned') {
            if (newValue === true) {
                dispatch(setSelectedAfterChangingOwned({idx: id, ball: ballname, smScreen: true}))
            }
            dispatch(setIsOwned({idx, ball: ballname, ballDefault: defaultData}))
        } else if (key === 'isHA') {
            dispatch(setIsHA({idx, ball: ballname, listType: 'collection'}))
        } else if (key === 'emCount') {
            dispatch(setEmCount({idx, ball: ballname, listType: 'collection', numEMs: newValue}))
            if (deleteEMs) {
                dispatch(deleteEms({idx, ball: ballname, listType: 'collection'}))
            }
            if (hasAllPossibleEMs) {
                for (let eggmove of possibleEggMoves) {
                    dispatch(setEms({idx, ball: ballname, listType: 'collection', emName: eggmove}))
                }
            }
        }
        dispatch(setUnsavedChanges())
    }

    const nameLabel = userData.loggedIn ? getNameDisplay(userData.user.settings.display.pokemonNames, row.name, row.natDexNum) : row.name

    return (
        <>
            <TableCell sx={{...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.main, position: 'relative', height: noRow2 ? '165px' : '293.5px', color: 'white', width: '100%', padding: 0}}>
                {isSelected && <Selection height={noRow2 ? '165px' : '293.5px'} deselectFunc={() => dispatch(deselect())} otherStyles={{top: '-152px'}}/>}
                <Box 
                    sx={{
                        ...theme.components.box.fullCenterRow, 
                        height: '10%', 
                        width: '100%', 
                        backgroundColor: theme.palette.color2.dark, 
                        margin: 0, 
                        padding: '16px', 
                        borderRadius: '10px',
                        ':hover': {cursor: isEditMode ? 'pointer' : 'auto'}
                    }}
                    onClick={!isEditMode ? undefined : setSelected}
                >
                    <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '20%'}}>
                        <Typography>#{row.natDexNum}</Typography>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '15%'}}>
                        <ImgData type='poke' linkKey={row.imgLink} size='40px'/>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'center', width: '65%', position: 'relative'}}>
                        <Typography><b>{nameLabel}</b></Typography>
                        
                        {isHomeCollection && 
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
                    <Box sx={{width: '100%', height: '116.5px'}}>
                        <SmallWidthBallArea 
                            p={row}
                            rowBalls={row1Balls}
                            isEditMode={isEditMode}
                            handleEditBallInfo={handleEditBallInfo}
                            collectionId={collectionId}
                            allowedBallsTotal={row1Balls.concat(row2Balls).filter(b => row.balls[b] !== undefined && row.balls[b].disabled === undefined)}
                        />
                    </Box>
                    {!noRow2 &&
                    <Box sx={{width: '100%', height: '116.5px'}}>
                        <SmallWidthBallArea 
                            p={row}
                            rowBalls={row2Balls}
                            isEditMode={isEditMode}
                            handleEditBallInfo={handleEditBallInfo}
                            collectionId={collectionId}
                            isRow2={true}
                            allowedBallsTotal={row1Balls.concat(row2Balls).filter(b => row.balls[b] !== undefined && row.balls[b].disabled === undefined)}
                        />
                    </Box>
                    }
                </Box>
            </TableCell>
        </>
    )
}

const mapStateToProps = function(state, ownProps) {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    } 
    const isPokemonSelected = seeIfPokemonIsSelected(state, ownProps.id)
    // const pokemon = state.collection[ownProps.idx]
    const pokemon = selectCollectionPokemon(state, ownProps.id)
    return {
        row: pokemon,
        isSelected: isPokemonSelected
    }
}

const mapDispatchToProps = function(dispatch, ownProps) {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected({selected: ownProps.id, regSetSelected: true}))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SmallWidthColRow);
