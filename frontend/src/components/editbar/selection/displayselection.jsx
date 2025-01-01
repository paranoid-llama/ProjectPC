import {useState, useEffect, useRef} from 'react'
import {Button, Tooltip} from '@mui/material'
import {useSelector, useDispatch, connect} from 'react-redux'
import {useLoaderData} from 'react-router-dom'
import {selectOnHandPokemon, selectCollectionPokemon, selectOnHandPokemonByPokemon, selectAllOnHandsOfPokemon} from './../../../app/selectors/selectors'
import {Box} from '@mui/material'
import NothingSelected from './nothingselected'
import MiscButtonArea from './miscbuttonarea'
import FlexAppBarContainer from './components/flexappbarcontainer'
import ShowSelectionConfirm from './showselectionconfirm'
import RenderCollectionEdit from './collectionlist/rendercollectionedit'
import RenderOnHandEdit from './onhandlist/renderonhandedit'
import ByPokemonEdit from './onhandlist/bypokemonedit'
import { selectPokeIdMatches } from '../../../app/selectors/selectpokeidmatches'

 function DisplaySelection({collection, anyUnsavedChanges, saving, saveCollectionEdits, selection, listType, showEditScreen, ohByPSWShowEditScreen, pokemon, idxOfPokemon, demo, smScreen, pokemonDeletedFromMemory, onhandViewType}) {
    const ownerID = collection.owner._id
    const collectionID = collection._id
    // console.log(pokemon)
    const pokemonBallInfo = listType === 'collection' ? pokemon.balls : ((!smScreen && listType === 'onHand') && (!pokemonDeletedFromMemory && selection !== '')) && ( 
        collection.ownedPokemon.filter(p => selectPokeIdMatches(p.imgLink, pokemon.imgLink !== undefined ? pokemon.imgLink : pokemon.list[0].imgLink, p.disabled))[0].balls)
    const possibleGender = (!pokemonDeletedFromMemory && selection !== '' && onhandViewType === 'byPokemon' && listType === 'onHand' && showEditScreen && !smScreen) && collection.ownedPokemon.filter(p => p.imgLink === pokemon.list[0].imgLink)[0].possibleGender
    
    const noSelection = selection === ''
    const buttonArea = noSelection ? 'noSelection' : 
        showEditScreen === false ? 'selectionConfirm' :
        listType === 'collection' ? 'collectionEdit' :
        listType === 'onHand' && 'onHandEdit'
    const selectedBall = useSelector((state) => state.editmode.selectedBall)
    const allEggMoves = useSelector((state) => state.collectionState.eggMoveInfo)
    const globalDefault = useSelector((state) => state.collectionState.options.globalDefaults)

    return (
        <>
        <FlexAppBarContainer
            widthPercent={smScreen ? '100%' : '80%'}
            additionalStyles={{color: 'black', justifyContent: 'center', position: 'relative', display: 'flex', height: '100%', zIndex: 999}}
        >
            {(anyUnsavedChanges && smScreen) && 
                <Box sx={{position: 'absolute', backgroundColor: '#e3e5e6', height: '48px', width: '150px', paddingLeft: '8px', top: listType === 'onHand' && noSelection ? '144.547px' : ohByPSWShowEditScreen ? '112.547px' : '64.547px', left: '0%', color: '#73661e', borderBottomRightRadius: '5px', borderTop: '1px solid black'}}>
                    {demo ? 
                    <Tooltip title='Your changes are already saved, but not to the database. To save it there, click the button on the top of the page to register an account!'>
                    <Button
                        sx={{height: '100%', width: '100%', fontSize: '13px', ':hover': {cursor: 'auto'}}}
                        onClick={null}
                    >
                        Save Changes
                    </Button>
                    </Tooltip> : 
                    <Button
                        sx={{height: '100%', width: '100%', fontSize: '13px'}}
                        onClick={() => saveCollectionEdits(false)}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    }
                </Box>
            }
            {/* {onHandNoSelection ? <Box sx={{width: '81.5136%', display: 'flex', justifyContent: 'end'}}><NothingSelected listType={listType}/></Box> : */}
            {noSelection ? <NothingSelected listType={listType} onhandViewType={onhandViewType} isHomeCollection={collection.gen === 'home'} collectionID={collectionID} demo={demo} smScreen={smScreen}/> :
            (showEditScreen === false || smScreen) ? <ShowSelectionConfirm listType={listType} pokemon={pokemon} pokemonDeletedFromMemory={pokemonDeletedFromMemory} pokemonIdx={idxOfPokemon} globalDefault={globalDefault} possibleEggMoves={allEggMoves[pokemon.name]} smScreen={smScreen} onhandView={onhandViewType} ohByPSWShowEditScreen={ohByPSWShowEditScreen}/> :
            !smScreen && listType === 'collection' ? <RenderCollectionEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} ballInfo={pokemonBallInfo} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'}/> :
            (!smScreen && listType === 'onHand' && onhandViewType === 'byPokemon') ? <ByPokemonEdit collectionId={collection._id} ownerId={ownerID} ohPokemonObj={pokemon} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'} demo={demo} colBallInfo={pokemonBallInfo[selectedBall]} possibleGender={possibleGender}/> : 
            (!smScreen && listType === 'onHand' ) && <RenderOnHandEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} idxOfPokemon={idxOfPokemon} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'} demo={demo}/>
            }
        </FlexAppBarContainer>
        {!smScreen && 
        <MiscButtonArea 
            currentView={buttonArea}
            collectionID={collectionID}
            listType={listType}
            onhandView={onhandViewType}
            showEditScreen={showEditScreen}
            pokemonInfo={(buttonArea === 'onHandEdit' && !(onhandViewType === 'byPokemon')) ? 
                {
                    name: pokemon.name, 
                    natDexNum: pokemon.natDexNum,
                    ball: pokemon.ball, 
                    imgLink: pokemon.imgLink, 
                    isHA: pokemon.isHA, 
                    emCount: pokemon.emCount,
                    gender: pokemon.gender,
                    isMaxEMs: pokemon.emCount === 4 || (collection.gen === 'home' ? true : pokemon.emCount === 
                        (allEggMoves[pokemon.name] === undefined ? allEggMoves[`${pokemon.name.slice(0, pokemon.name.indexOf(' '))} (Any)`] : 
                        allEggMoves[pokemon.name]).length),
                    pokemonId: pokemon._id
                } : 
                buttonArea === 'collectionEdit' && 
                    {
                        name: pokemon.name,
                        ball: selectedBall, 
                        isOwned: pokemon.balls[selectedBall].isOwned, 
                        idx: idxOfPokemon,
                        activeTag: pokemon.balls[selectedBall].highlyWanted !== undefined ? 'highlyWanted' : 
                                    pokemon.balls[selectedBall].pending !== undefined ? 'pending' : 'none'
                    }
            }
            demo={demo}
            byPokemonNum={(listType === 'onHand' && onhandViewType === 'byPokemon' && !noSelection && !showEditScreen) && pokemon.idSetsAndNums[selectedBall]}
        />}
        {/* {(!noSelection && smScreen) &&
            <Box sx={{position: 'absolute', pointerEvents: 'none', height: '192vh', width: '100%'}}>
                <Box sx={{position: 'absolute', width: '100%', height: '50px', backgroundColor: 'grey', borderTopRightRadius: '10px', borderTopLeftRadius: '10px', bottom: '0px'}}>

                </Box>
            </Box>
        } */}
        </>
    )
}

const mapStateToProps = function(state, ownProps) {
    const selection = state.editmode.selected
    const listType = state.editmode.listType
    const showEditScreen = state.editmode.showEditScreen
    const onhandViewType = state.collectionState.listDisplay.onhandView
    const ohByPSWShowEditScreen = state.editmode.ohByPSWShowEditScreen
    //do NOT uncomment below and use it. 
    // const detailedByPEditingMode = onhandViewType === 'byPokemon' && (!ownProps.smScreen && showEditScreen || ownProps.smScreen && ohByPSWShowEditScreen)
    const pokemon = selection !== '' ? 
        listType === 'collection' ? selectCollectionPokemon(state, selection) :
        (listType === 'onHand' && onhandViewType === 'byPokemon') ? 
            (showEditScreen && !ownProps.smScreen) ? selectAllOnHandsOfPokemon(state, selection) : 
            selectOnHandPokemonByPokemon(state, selection) : 
        listType === 'onHand' && selectOnHandPokemon(state, selection) : 'none'
    const idxOfPokemon = selection !== '' && (listType === 'collection' ? state.collectionState.collection.indexOf(pokemon) :
        (listType === 'onHand' && onhandViewType === 'byPokemon' && (!ownProps.smScreen && showEditScreen || ownProps.smScreen && ohByPSWShowEditScreen)) ? state.collectionState.onhand.indexOf(p => p._id === pokemon.init) : 
        (listType === 'onHand' && onhandViewType === 'byPokemon') ? -1 : state.collectionState.onhand.indexOf(pokemon))
    const pokemonDeletedFromMemory = (listType === 'onHand' && selection !== '') && (
        (onhandViewType === 'byPokemon' && (!ownProps.smScreen && showEditScreen || ownProps.smScreen && ohByPSWShowEditScreen)) ? false : 
        state.collectionState.collection.filter(p => selectPokeIdMatches(p.imgLink, pokemon.imgLink, p.disabled)).length === 0
    )
    return {selection, listType, showEditScreen, pokemon, idxOfPokemon, pokemonDeletedFromMemory, onhandViewType, ohByPSWShowEditScreen}
}

export default connect(mapStateToProps)(DisplaySelection)