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

 function DisplaySelection({collection, selection, listType, showEditScreen, pokemon, idxOfPokemon}) {
    const ownerID = collection.owner._id
    const collectionID = collection._id
    const pokemonBallInfo = selection !== '' && (listType === 'collection' ? pokemon.balls : 
        collection.ownedPokemon.filter(p => p.imgLink === pokemon.imgLink)[0].balls)
    const noSelection = selection === ''
    const buttonArea = noSelection ? 'noSelection' : 
        showEditScreen === false ? 'selectionConfirm' :
        listType === 'collection' ? 'collectionEdit' :
        listType === 'onHand' && 'onHandEdit'
    const selectedBall = useSelector((state) => state.editmode.selectedBall)
    const allEggMoves = useSelector((state) => state.listDisplay.eggMoveInfo)

    return (
        <>
        <FlexAppBarContainer
            widthPercent='80%'
            additionalStyles={{color: 'black', justifyContent: 'center', display: 'flex', height: '100%', zIndex: 999}}
        >
            {/* {onHandNoSelection ? <Box sx={{width: '81.5136%', display: 'flex', justifyContent: 'end'}}><NothingSelected listType={listType}/></Box> : */}
            {noSelection ? <NothingSelected listType={listType} isHomeCollection={collection.gen === 'home'} collectionID={collectionID}/> :
            showEditScreen === false ? <ShowSelectionConfirm listType={listType} pokemon={pokemon}/> :
            listType === 'collection' ? <RenderCollectionEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} ballInfo={pokemonBallInfo} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'}/> :
            listType === 'onHand' && <RenderOnHandEdit collectionId={collection._id} ownerId={ownerID} pokemon={pokemon} idxOfPokemon={idxOfPokemon} allEggMoves={allEggMoves} isHomeCollection={collection.gen === 'home'}/>
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
                    isMaxEMs: pokemon.emCount === 4 || (collection.gen === 'home' ? true : pokemon.emCount === collection.eggMoveInfo[pokemon.name].length),
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
    const idxOfPokemon = selection !== '' && (listType === 'collection' ? state.collection.indexOf(pokemon) :
        listType === 'onHand' && state.onhand.indexOf(pokemon))
    return {selection, listType, showEditScreen, pokemon, idxOfPokemon}
}

export default connect(mapStateToProps)(DisplaySelection)