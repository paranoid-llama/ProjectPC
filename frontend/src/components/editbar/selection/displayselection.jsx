import {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch, connect} from 'react-redux'
import {useLoaderData} from 'react-router-dom'
import {selectOnHandPokemon, selectCollectionPokemon} from './../../../app/selectors/selectors'
import {Box} from '@mui/material'
import NothingSelected from './nothingselected'
import MiscButtonArea from './miscbuttonarea'
import FlexAppBarContainer from './components/flexappbarcontainer'
import ShowSelectionConfirm from './showselectionconfirm'
import RenderCollectionEdit from './collectionlist/rendercollectionedit'
import RenderOnHandEdit from './onhandlist/renderonhandedit'

 function DisplaySelection({collection, selection, listType, showEditScreen, pokemon, idxOfPokemon, demo}) {
    const ownerID = collection.owner._id
    const collectionID = collection._id
    // console.log(pokemon)
    const pokemonDeletedFromMemory = listType === 'onHand' && collection.ownedPokemon.filter(p => p.imgLink === pokemon.imgLink).length === 0

    const pokemonBallInfo = (!pokemonDeletedFromMemory && selection !== '') && (listType === 'collection' ? pokemon.balls : 
        collection.ownedPokemon.filter(p => p.imgLink === pokemon.imgLink)[0].balls)
    
    const noSelection = selection === ''
    const buttonArea = noSelection ? 'noSelection' : 
        showEditScreen === false ? 'selectionConfirm' :
        listType === 'collection' ? 'collectionEdit' :
        listType === 'onHand' && 'onHandEdit'
    const selectedBall = useSelector((state) => state.editmode.selectedBall)
    const allEggMoves = useSelector((state) => state.collectionState.eggMoveInfo)
    const onhandViewType = useSelector((state) => state.collectionState.listDisplay.onhandView)
    const globalDefault = useSelector((state) => state.collectionState.options.globalDefaults)

    return (
        <>
        <FlexAppBarContainer
            widthPercent='80%'
            additionalStyles={{color: 'black', justifyContent: 'center', position: 'relative', display: 'flex', height: '100%', zIndex: 999}}
        >
            {/* {onHandNoSelection ? <Box sx={{width: '81.5136%', display: 'flex', justifyContent: 'end'}}><NothingSelected listType={listType}/></Box> : */}
            {noSelection ? <NothingSelected listType={listType} onhandViewType={onhandViewType} isHomeCollection={collection.gen === 'home'} collectionID={collectionID} demo={demo}/> :
            showEditScreen === false ? <ShowSelectionConfirm listType={listType} pokemon={pokemon} pokemonDeletedFromMemory={pokemonDeletedFromMemory} pokemonIdx={idxOfPokemon} globalDefault={globalDefault} possibleEggMoves={allEggMoves[pokemon.name]}/> :
            listType === 'collection' ? <RenderCollectionEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} ballInfo={pokemonBallInfo} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'}/> :
            listType === 'onHand' && <RenderOnHandEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} idxOfPokemon={idxOfPokemon} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'} demo={demo}/>
            }
        </FlexAppBarContainer>
        <MiscButtonArea 
            currentView={buttonArea}
            collectionID={collectionID}
            listType={listType}
            pokemonInfo={(buttonArea === 'onHandEdit') ? 
                {
                    name: pokemon.name, 
                    natDexNum: pokemon.natDexNum,
                    ball: pokemon.ball, 
                    imgLink: pokemon.imgLink, 
                    isHA: pokemon.isHA, 
                    emCount: pokemon.emCount,
                    gender: pokemon.gender,
                    isMaxEMs: pokemon.emCount === 4 || (collection.gen === 'home' ? true : pokemon.emCount === allEggMoves[pokemon.name].length),
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
        />
        </>
    )
}

const mapStateToProps = function(state) {
    const selection = state.editmode.selected
    const listType = state.editmode.listType
    const showEditScreen = state.editmode.showEditScreen
    const pokemon = selection !== '' ? 
        listType === 'collection' ? selectCollectionPokemon(state, selection) :
        listType === 'onHand' && selectOnHandPokemon(state, selection) : 'none'
    const idxOfPokemon = selection !== '' && (listType === 'collection' ? state.collectionState.collection.indexOf(pokemon) :
        listType === 'onHand' && state.collectionState.onhand.indexOf(pokemon))
    return {selection, listType, showEditScreen, pokemon, idxOfPokemon}
}

export default connect(mapStateToProps)(DisplaySelection)