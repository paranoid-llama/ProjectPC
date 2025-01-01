import {Box, Typography, Button, useTheme} from '@mui/material'
import { useRef, useState, useEffect } from 'react';
import Draggable, {DraggableCore} from 'react-draggable'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { setSelectedBall, toggleEditScreenState, setPosRenderSelectedData } from '../../../../app/slices/editmode';
import { getCenterOffset, renderBallListDragVer } from '../../../../../utils/functions/renderballselection';
import { useDispatch, useSelector, connect } from 'react-redux';
import { selectCollectionPokemon, selectOnHandPokemon, selectOnHandPokemonByPokemon, selectAllOnHandsOfPokemon, selectOwnedBallsAndHangingOnHandBallsList, selectOtherOnhandReqData, selectOwnedBallsList } from '../../../../app/selectors/selectors';
import EditWrapper from '../components/editwrapper';
import SWBallSelection from './editors/swballselection';
import SWCollectionEditor from './editors/swcollectioneditor';
import SWOnhandEditor from './editors/swonhandeditor';
import ImgData from '../../../collectiontable/tabledata/imgdata';
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay';
import { memo } from 'react';
import { selectAllowedBallsList } from '../../../../app/selectors/selectors';
import SWOnhandByPokemonEditor from './editors/swonhandbypokemoneditor';

function SWEditSelection({collectionID, demo, selection, listType, showEditScreen, ohByPSWShowEditScreen, pokemon, gen, idxOfPokemon, allowedBalls, pokemonDeletedFromMemory, otherOnhandReqData, onhandView, ohByPSESData}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const noSelection = selection === ''
    const editSelectionRef = useRef(null)
    

    // effective edit area is the area of space to edit selection. add 40 to include the button to drag open/drag close area and thats the total area.
    const effectiveEditArea = 360 

    const generateKeyframe = () => {
        return (
            `
                @keyframes open-sw-edit-selection {
                    from {
                        bottom: ${-1*effectiveEditArea}px
                    }
                    to {
                        bottom: 0px
                    }
                }
                @keyframes close-sw-edit-selection {
                    from {
                        bottom: 0px
                    }
                    to {
                        bottom: ${-1*effectiveEditArea}px
                    }
                }
            `
        )
    }

    const baseBallImgWidth = '40px'
    const baseBallGapWidth = '16px'

    return (
        (!noSelection && (listType === 'collection' || (listType === 'onHand' && (!pokemonDeletedFromMemory)))) &&
        <Box sx={{position: 'fixed', bottom: '0px', width: '100%', zIndex: 500}}>
            <style>{generateKeyframe()}</style>
            <Box 
                sx={{
                    position: 'absolute', 
                    width: '100%', 
                    height: `${effectiveEditArea+40}px`, 
                    backgroundColor: '#e3e5e6', 
                    borderTopRightRadius: '10px', 
                    borderTopLeftRadius: '10px',
                    bottom: `${-1*effectiveEditArea}px`,
                    ...theme.components.box.fullCenterCol,
                    justifyContent: 'start'
                }} 
                ref={editSelectionRef}
            >
                <Button 
                    variant='contained' 
                    sx={{
                        width: '100%', 
                        height: '40px', 
                        borderTopRightRadius: '10px', 
                        borderTopLeftRadius: '10px', 
                        borderBottomRightRadius: '0px', 
                        borderBottomLeftRadius: '0px', 
                        zIndex: 600
                    }}
                    onClick={() => {
                        if (showEditScreen) {
                            editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 close-sw-edit-selection'
                            editSelectionRef.current.style.animationFillMode = 'forwards'
                        } else {
                            editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 open-sw-edit-selection'
                            editSelectionRef.current.style.animationFillMode = 'forwards'
                        }
                        dispatch(toggleEditScreenState())
                    }}
                >
                    {showEditScreen ? 'Hide Edit' : 'Edit Selection'}
                </Button>
                <EditWrapper
                    imgLink={pokemon.imgLink}
                    name={pokemon.name}
                    natDexNum={pokemon.natDexNum}
                    orientation='column'
                    CustomNameImgPlate={(userNameDisplaySettings) => (
                        // listType==='onHand' ? 
                        // <Button sx={{width: '100%', height: '15%', mb: '1.5%', ...theme.components.box.fullCenterRow, gap: 2, padding: 0, textTransform: 'none'}}>
                        //     <ImgData size='40px' linkKey={pokemon.imgLink}/>
                        //     <Typography sx={{fontSize: '20px'}}>{getNameDisplay(userNameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
                        // </Button> : 
                        <Box sx={{width: '100%', height: '15%', mb: listType === 'onHand' ? '3%' : 0, ...theme.components.box.fullCenterRow, gap: 2}}>
                            <ImgData size='40px' linkKey={pokemon.imgLink}/>
                            <Typography sx={{fontSize: '20px'}}>{getNameDisplay(userNameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
                        </Box>
                    )}
                    customNameWrapperStyles={{width: '100%', height: '15%', maxWidth: '768px', gap: '0px'}}
                    lowerNameWrapperSx={{position: 'relative', width: '53%', justifyContent: 'start'}}
                    imgWrapperSx={{width: '47%', justifyContent: 'end', mr: 1}}
                    customTotalWrapperStyles={{height: `${effectiveEditArea}px`, position: 'relative'}}
                    childWrapperSx={{}}
                    customNameStyles={{fontSize: '20px', width: '500%', textAlign: 'start', left: '0px'}}
                    customImgSize='40px'
                >
                    {!(listType === 'onHand' && onhandView === 'byPokemon') &&
                    <SWBallSelection 
                        allowedBalls={allowedBalls}
                        ohBall={(listType === 'onHand' && !(onhandView === 'byPokemon')) ? pokemon.ball : undefined}
                        isCollectionList={listType === 'collection' || onhandView === 'byPokemon'}
                        baseImgWidth={baseBallImgWidth}
                        baseGapWidth={baseBallGapWidth}
                        pokemonId={(listType === 'collection') ? pokemon.imgLink : pokemon._id}

                    />
                    }
                    {listType === 'collection' && 
                    <SWCollectionEditor
                        allowedBalls={allowedBalls}
                        pokemonId={pokemon.imgLink}
                        isHomeCollection={gen === 'home'}
                        idxOfPokemon={idxOfPokemon}
                    />
                    }
                    {(listType === 'onHand' && !(onhandView === 'byPokemon') && !pokemonDeletedFromMemory) && 
                    <SWOnhandEditor
                        collectionID={collectionID}
                        demo={demo}
                        pokemonId={pokemon._id}
                        allowedBalls={!allowedBalls.includes(pokemon.ball) ? [...allowedBalls, pokemon.ball] : allowedBalls}
                        possibleGender={otherOnhandReqData.possibleGender}
                        noHA={otherOnhandReqData.noHA}
                        noEMs={otherOnhandReqData.noEMs}
                        isHomeCollection={gen === 'home'}
                        idxOfPokemon={idxOfPokemon}
                    />
                    }
                    {(listType === 'onHand' && (onhandView === 'byPokemon') && !pokemonDeletedFromMemory) && 
                    <SWOnhandByPokemonEditor
                        collectionID={collectionID}
                        demo={demo}
                        ohByPSWShowEditScreen={ohByPSWShowEditScreen}
                        pokemon={pokemon}
                        baseImgWidth={baseBallImgWidth}
                        baseGapWidth={baseBallGapWidth}
                        allowedBalls={allowedBalls}
                        isHomeCollection={gen === 'home'}
                        otherOnhandReqData={otherOnhandReqData}
                        ohByPSESData={ohByPSESData}
                    />
                    }
                </EditWrapper>
            </Box>
        </Box>
    )
}

// const SWEditSelection = memo(SWEditSelectionFunc, (oP, nP) => {
//     return (
//         oP.selection === nP.selection && oP.listType === nP.listType && oP.showEditScreen === nP.showEditScreen && oP.ohByPSWShowEditScreen === nP.ohByPSWShowEditScreen && 
//         (nP.listType === 'collection' || ((nP.listType === 'onHand') ?
//             nP.ohByPSWShowEditScreen && (oP.ohByPSESData.list.length === nP.ohByPSESData.list.length && oP.ohByPSESData.list[0].ball === nP.ohByPSESData.list[0].ball) : 
//             (oP.pokemon.ball === nP.pokemon.ball && oP.pokemon.name === nP.pokemon.name)))
//     )
// })

const mapStateToProps = function(state) {
    const selection = state.editmode.selected
    const listType = state.editmode.listType
    const showEditScreen = state.editmode.showEditScreen
    const ohByPSWShowEditScreen = state.editmode.ohByPSWShowEditScreen
    const onhandView = state.collectionState.listDisplay.onhandView
    const byPView = onhandView === 'byPokemon' && listType === 'onHand'
    const pokemon = selection !== '' ? 
        (listType === 'collection') ? selectCollectionPokemon(state, selection) :
        byPView ? state.collectionState.onhand.filter(p => p.imgLink === selection)[0] : //just need basic data
        listType === 'onHand' && selectOnHandPokemon(state, selection) : 'none'
    const idxOfPokemon = selection !== '' && (listType === 'collection' ? state.collectionState.collection.indexOf(pokemon) :
        (listType === 'onHand') && 
            (byPView ? state.collectionState.onhand.findIndex(p => pokemon.imgLink === p.imgLink) : 
            state.collectionState.onhand.indexOf(pokemon)))
    
    const pokemonInCollectionList = (listType === 'onHand' && selection !== '') ? selectCollectionPokemon(state, pokemon.imgLink) : undefined

    const pokemonDeletedFromMemory = (listType === 'onHand' && selection !== '') ? (pokemonInCollectionList === undefined || pokemonInCollectionList.disabled) : false

    const allowedBalls = selection === '' ? false : 
        listType === 'collection' ? selectAllowedBallsList(state, pokemon.imgLink) : 
        pokemonDeletedFromMemory ? [] : !byPView && selectOwnedBallsList(state, pokemon.imgLink)
    
    const otherOnhandReqData = (listType === 'onHand' && selection !== '' && !pokemonDeletedFromMemory) ? selectOtherOnhandReqData(state, byPView ? selection : pokemon.imgLink) : undefined

    const ohByPSESData = (ohByPSWShowEditScreen) ? selectAllOnHandsOfPokemon(state, selection) : undefined 
    // const colBallInfoProp = (listType === 'onHand' && ohByPSWShowEditScreen) ? {colBallInfo: pokemonInCollectionList.balls} : {} 

    return {
        selection, listType, showEditScreen, ohByPSWShowEditScreen,
        pokemon, idxOfPokemon, pokemonDeletedFromMemory, 
        allowedBalls: (listType === 'onHand' && selection !== '' && !byPView && !allowedBalls.includes(pokemon.ball)) ? [...allowedBalls, pokemon.ball] : allowedBalls, 
        otherOnhandReqData,
        onhandView, ohByPSESData
    }
}

export default connect(
    mapStateToProps,
    null,
    null
    // {areStatesEqual: (next, prev, nextOp, prevOp) => {
    //     const prevOhs = next.editmode.ohByPSWShowEditScreen === true && prev.collectionState.onhand.filter(p => p.imgLink === next.editmode.selected)
    //     return (
    //         next.editmode.selected === prev.editmode.selected && next.editmode.listType === prev.editmode.listType &&
    //         next.editmode.showEditScreen === prev.editmode.showEditScreen && next.editmode.ohByPSWShowEditScreen === prev.editmode.ohByPShowEditScreen &&
    //         next.collectionState.listDisplay.onhandView === prev.collectionState.listDisplay.onhandView &&
    //         (next.editmode.ohByPSWShowEditScreen === true && (next.collectionState.onhand.filter(ohP => ohP.imgLink === state.editmode.selected).filter((p, i) => prevOhs[i].ball !== p.ball).length === 0))
    //     )
    // }}
)(SWEditSelection)