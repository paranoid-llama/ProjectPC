import {Box, Typography, useTheme, TableCell, Tooltip, Checkbox} from '@mui/material'
import { connect, useSelector, useDispatch } from 'react-redux'
import newObjectId from '../../../../../utils/functions/newobjectid'
import EggMoveColumnDisplay from '../eggmovecolumndisplay'
import Selection from '../../selection'
import { setSelected } from '../../../../app/slices/editmode'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import ImgData from '../../tabledata/imgdata'
import { setIsHA } from '../../../../app/slices/collectionstate'
import { setPokemon } from '../../../../app/slices/tradeoffer'
import { seeIfPokemonIsSelected, selectOnHandPokemon, selectOnHandPokemonIdx } from '../../../../app/selectors/selectors'
import { selectIfPokemonIsSelected } from '../../../../app/selectors/tradeselectors'
import { toggleOnHandIdToDelete, deselect } from '../../../../app/slices/editmode'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import { homeDisplayGames, getGameColor } from '../../../../../common/infoconstants/miscconstants.mjs'
import SWOnHandHACheckbox from './swonhandhacheckbox'

function SmallWidthOnHandRowContent({row, pokemonId, collectionId, styles, isSelected, setSelected, allEggMoveInfo, availableGamesInfo, isEditMode, demo, isHomeCollection, isTradePage, tradeSide, wantedByOtherList, userData, idxOfPokemon}) {
    const dispatch = useDispatch()
    const theme = useTheme()

    const skeletonRow = row === undefined
    if (skeletonRow) { 
        //skeletonRow happens when adding multiple on-hands and leaving edit mode. they come out undefined at first. I gave up trying to debug it, this is a work-around
        return <>
            <Box 
                sx={{
                    ...theme.components.box.fullCenterRow, 
                    height: '10%', 
                    width: '100%', 
                    backgroundColor: theme.palette.color2.dark, 
                    margin: 0, 
                    padding: '16px', 
                    borderRadius: '10px'
                }}
            >

            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, height: '90%', width: '100%', color: 'white', position: 'relative'}}></Box>
        </>
    }

    const deleteOnHandMode = isEditMode ? useSelector((state) => state.editmode.deleteOnHandMode) : null
    const ohIdsFlagged = isEditMode ? useSelector((state) => state.editmode.deletedOnHandIds) : null
    const isFlaggedForDeletion = (isEditMode && deleteOnHandMode) && ohIdsFlagged.includes(row._id)

    const flagForDeletion = () => {
        dispatch(toggleOnHandIdToDelete(row._id))
    }

    const possibleEMs = !isHomeCollection && (allEggMoveInfo[row.name])
    const maxEMs = !isHomeCollection && (possibleEMs === undefined ? 0 : possibleEMs.length > 4 ? 4 : possibleEMs.length)

    //trade functions
    const isSelectedForTrade = isTradePage ? useSelector((state) => selectIfPokemonIsSelected(state, tradeSide, {name: row.name, ball: row.ball, onhandId: row.onhandId})) : false
    const toggleSelectForTrade = isTradePage ? () => dispatch(setPokemon({pData: tradeDispData.pData, ballData: tradeDispData.ballData, tradeSide})) : undefined

    const nameFontSizeScaling = {
        '@media only screen and (max-width: 465px) and (min-width: 415px)': {
            fontSize: '14px'
        },
        '@media only screen and (max-width: 414px) and (min-width: 360px)': {
            fontSize: '12px'
        },
        '@media only screen and (max-width: 359px) and (min-width: 320px)': {
            fontSize: '10px'
        }
    }

    return (
        <TableCell 
            sx={{...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.main, position: 'relative', height: '150px', color: 'white', width: '100%', padding: 0}}
        >
            {(isSelected || isFlaggedForDeletion) && <Selection height={'150px'} deselectFunc={deleteOnHandMode ? flagForDeletion : () => dispatch(deselect())} otherStyles={deleteOnHandMode ? {backgroundColor: 'rgba(225, 30, 30, 0.2)', borderColor: 'rgba(150, 30, 30, 1)', top: '-80px'} : {top: '-80px'}}/>}
            {isSelectedForTrade && 
                <Box sx={{position: 'absolute', width: '99.7%', zIndex: 100}}>
                    <Box sx={{
                        position: 'absolute', 
                        left: '-2px', 
                        top: '-11px', 
                        border: '1px solid turquoise',
                        height: '150px', 
                        ':hover': {
                            cursor: 'pointer',
                            opacity: 0.5,
                            border: '1px solid turquoise',
                        },
                        // ...listStyles.collection.selectionBox.widthScaling
                        width: '100%',

                    }}
                        onClick={toggleSelectForTrade}
                    >
                    </Box> 
                    <Box sx={{position: 'absolute', top: -10, right: 2}}>
                        <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                    </Box>
                </Box>
            }
            <Box 
                sx={{
                    ...theme.components.box.fullCenterRow, 
                    height: '10%', 
                    width: '100%', 
                    backgroundColor: theme.palette.color2.dark, 
                    margin: 0, 
                    padding: '16px', 
                    borderRadius: '10px',
                    position: 'relative',
                    ':hover': {cursor: isEditMode ? 'pointer' : 'auto'}
                }}
                onClick={isEditMode ? (deleteOnHandMode ? flagForDeletion : isTradePage ? toggleSelectForTrade : setSelected) : undefined}
            >
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '10%'}}>
                    <Typography sx={{...nameFontSizeScaling}}>#{row.natDexNum}</Typography>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '20%'}}>
                    <ImgData type='ball' linkKey={row.ball} size='32px'/>
                    <ImgData type='poke' linkKey={row.imgLink} size='32px'/>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '20%'}}>
                    <Typography sx={row.name.length >= 15 ? {...nameFontSizeScaling} : {}}><b>{capitalizeFirstLetter(row.ball)}</b></Typography>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', alignItems: 'center', width: '40%'}}>
                    <Typography sx={row.name.length >= 15 ? {...nameFontSizeScaling} : {}}><b>{userData.loggedIn ? getNameDisplay(userData.user.settings.display.pokemonNames, row.name, row.natDexNum) : row.name}</b></Typography>
                    {isHomeCollection && 
                        <Box sx={{position: 'absolute', bottom: '-3px', width: '300px', right:'calc(50% - 150px)', ...theme.components.box.fullCenterRow}}>
                        {homeDisplayGames.map((game, idx) => {
                            const nameOfGame = game === 9 ? 'S/V' : game === 'swsh' ? 'SW/SH' : game === 'bdsp' && 'BD/SP'
                            const firstGame = nameOfGame.slice(0, nameOfGame.indexOf('/'))
                            const secondGame = nameOfGame.slice(nameOfGame.indexOf('/')+1, nameOfGame.length)
                            const firstGameColor = getGameColor(firstGame)
                            const secondGameColor = getGameColor(secondGame)
                            const gamesEnabled = availableGamesInfo[row.name].includes(game)
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
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '10%', position: 'relative'}}>
                    <Typography><b>x{row.qty}</b></Typography>
                    {(row.reserved !== undefined && p.reserved > 0) && 
                        <Tooltip title='This On-Hand is reserved and is pending in an accepted trade/trade offer. The number indicates the reserved quantity.' arrow>
                            <Typography sx={{fontSize: '11px', width: '100%', position: 'absolute', bottom: '2px', ':hover': {cursor: 'pointer'}}}>
                                Res: {row.reserved}
                            </Typography>
                        </Tooltip>
                    }
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, height: '90%', width: '100%', color: 'white', position: 'relative', ':hover': {cursor: isEditMode ? 'pointer' : 'auto'}}} onClick={isEditMode ? (deleteOnHandMode ? flagForDeletion : isTradePage ? toggleSelectForTrade : setSelected) : undefined}>
                <Box sx={{width: isHomeCollection ? '30%' : '17.5%', height: '100px', ...theme.components.box.fullCenterRow }}>
                    <Box sx={{width: '94%', height: '94%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark, borderRadius: '10px', border: '1px solid black'}}>
                    {row.gender === 'none' ? <Typography sx={{fontSize: '18px'}}><b>N/A</b></Typography> :
                    row.gender === 'unknown' ? <Typography sx={{fontSize: '12px', color: 'grey'}}><i>Unknown</i></Typography> :
                        <ImgData type='gender' linkKey={row.gender}/>
                    }
                    </Box>
                </Box>
                <Box sx={{width: isHomeCollection ? '30%' : '17.5%', height: '100px', ...theme.components.box.fullCenterRow, backgroundColor: row.isHA === undefined ? 'black' : 'none', position: 'relative'}}>
                    {!(row.isHA === undefined) &&
                    // <Box sx={{width: '94%', height: '94%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark, borderRadius: '10px', border: '1px solid black'}}>
                    // <Checkbox 
                    //     sx={{position: 'absolute', right: 'calc(50% - 26.5px)', top: 'calc(50% - 26.5px)', color: 'white', pointerEvents: isEditMode ? 'auto' : 'none'}}
                    //     checked={row.isHA}
                    //     size='large'
                    //     onChange={isEditMode ? () => dispatch(setIsHA({listType: 'onhand', idx: idxOfPokemon})) : undefined}
                    // />
                    // </Box>
                    <SWOnHandHACheckbox isHA={row.isHA} isEditMode={isEditMode} idxOfPokemon={idxOfPokemon}/>
                    }
                </Box>
                {!isHomeCollection && 
                    (row.emCount === undefined ? <Box sx={{width: '65%', height: '100px', backgroundColor: 'black'}}></Box> :   
                    <>
                   
                    <Box sx={{width: '15%', height: '100px', ...theme.components.box.fullCenterRow}}> 
                        <Box sx={{width: '94%', height: '94%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark, borderRadius: '10px', border: '1px solid black'}}>
                        <Typography sx={{fontSize: '20px'}}><b>{row.emCount}</b></Typography>
                        </Box>
                    </Box>
                   
                    <Box sx={{width: '50%', height: '100px', ...theme.components.box.fullCenterRow}}>
                        <Box sx={{width: '94%', height: '94%', ...theme.components.box.fullCenterCol, backgroundColor: theme.palette.color2.dark, borderRadius: '10px', border: '1px solid black'}}>
                            {row.emCount === 0 ? 
                            <Typography sx={{color: 'grey'}}><i>No Egg Moves</i></Typography> : 
                            <EggMoveColumnDisplay
                                EMs={row.EMs}
                                emCount={row.emCount}
                                emKeyLiteral={(emNum) => `${row._id}-${row.ball}-egg-move-${emNum}`}
                                baseStyles={styles}
                                isEditMode={isEditMode}
                                flaggedForDeletion={deleteOnHandMode && ohIdsFlagged.includes(row._id)}
                                onClickFunc={deleteOnHandMode ? () => dispatch(toggleOnHandIdToDelete(row._id)) : isSelected ? null : setSelected}
                                blackSquare={false}
                                boxWrapper={true}
                                customSx={{width: '100%'}}
                                centeredGridItems
                            />}
                        </Box>
                    </Box>
                    </>
                    )
                }
            </Box>
        </TableCell>
    )
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    const pokemon = selectOnHandPokemon(state, ownProps.pokemonId)
    const idxOfPokemon = selectOnHandPokemonIdx(state, ownProps.pokemonId)
    const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
    return {
        row: pokemon,
        isSelected,
        idxOfPokemon
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

export default connect(mapStateToProps, mapDispatchToProps)(SmallWidthOnHandRowContent)