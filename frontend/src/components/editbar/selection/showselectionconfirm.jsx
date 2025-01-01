import { useEffect, useRef, useState } from 'react'
import {Box, Typography, Button, useTheme, TextField} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../collectiontable/tabledata/imgdata'
import {useSelector, useDispatch} from 'react-redux'
import {toggleEditScreenState} from './../../../app/slices/editmode'
import { setSelectedBall, deselect, setUnsavedChanges } from './../../../app/slices/editmode'
import { setMultipleIsOwned, setQtyByPokemon } from '../../../app/slices/collectionstate'
import BallSelectionForm from '../editsectioncomponents/shared/ballselectionform'
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { selectAllowedBallsList, selectOwnedBallsAndHangingOnHandBallsList } from '../../../app/selectors/selectors'
import { apriballs } from '../../../../common/infoconstants/miscconstants.mjs'
import { NumericFormat } from 'react-number-format'
import ByPokemonQtyEditor from './onhandlist/bypokemonqtyeditor'

export default function ShowSelectionConfirm({listType, pokemon, pokemonDeletedFromMemory, globalDefault, pokemonIdx, possibleEggMoves, smScreen, onhandView, ohByPSWShowEditScreen}) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const userData = useRouteLoaderData('root')
    const byPokemonEdit = (listType === 'onHand' && onhandView === 'byPokemon')
    
    //need to add conditional in the selector, else it detects that less hooks were rendered.
    const allowedBalls = useSelector((state) => (byPokemonEdit && !pokemonDeletedFromMemory && !smScreen) ? selectOwnedBallsAndHangingOnHandBallsList(state, pokemon.imgLink) : undefined)
    const selectedBall = useSelector((state) => byPokemonEdit ? state.editmode.selectedBall : '') 


    const capitalizedBallName = (listType === 'onHand' && !(onhandView === 'byPokemon')) ? `${pokemon.ball[0].toUpperCase()}${pokemon.ball.slice(1)}` : ''
    useEffect(() => {
        if ((listType === 'collection' && !smScreen) || (byPokemonEdit && !smScreen)) {
            if (listType === 'collection' && !smScreen) {
                const allowedBallsColVer = Object.keys(pokemon.balls).filter(ball => pokemon.balls[ball].disabled === undefined)
                const initBallState = allowedBallsColVer.length === 3 || allowedBallsColVer.length === 4 ? allowedBallsColVer[1] : allowedBallsColVer[0] 
                dispatch(setSelectedBall(initBallState)) //(collection) setting state here as 2 diff components (miscbuttonarea and ballselection) in the screen after (edit screen) uses it. prevents unnecessary re-renders
            } else {
                if (!pokemonDeletedFromMemory && !allowedBalls.includes(selectedBall)) {
                    const initBallState = allowedBalls.length === 3 || allowedBalls.length === 4 ? allowedBalls[1] : allowedBalls[0] 
                    dispatch(setSelectedBall(initBallState))
                }
            }
        }
    })
    

    const fullyCompleteSet = () => {
        const checkDefault = Object.keys(pokemon.balls)[Object.values(pokemon.balls).map((b) => b.default !== undefined).indexOf(true)]
        const currentDefault = checkDefault === undefined ? 'none' : checkDefault
        dispatch(setMultipleIsOwned({idx: pokemonIdx, ballDefault: currentDefault, globalDefault, possibleEggMoves}))
        dispatch(setUnsavedChanges('collection'))
    }

    const smScreenMQuery = smScreen ? {
        '@media only screen and (min-width: 320px) and (max-width: 340px)': {fontSize: '9px'}, 
        '@media only screen and (min-width: 341px) and (max-width: 380px)': {fontSize: '10px'}, 
    } : {}

    // useEffect(() => {
    //     if (byPokemonEdit && (pokemon.idSetsAndNums[selectedBall] === undefined || pokemon.idSetsAndNums[selectedBall] !== undefined && pokemon.idSetsAndNums[selectedBall].numTotal !== val)) {
    //         setVal({num: pokemon.idSetsAndNums[selectedBall] === undefined ? 0 : pokemon.idSetsAndNums[selectedBall].numTotal, focused: false})
    //     }
    // }, [pokemon.idSetsAndNums, selectedBall])

    const firstBoxSx = byPokemonEdit && !smScreen ? {width: '30%', height: '100%', ...theme.components.box.fullCenterRow} : {}

    return(
        <>
        <Box sx={firstBoxSx}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative'}}>
                {(listType === 'onHand' && !(onhandView === 'byPokemon')) && <ImgData linkKey={pokemon.ball} type='ball'/>}
                <ImgData linkKey={pokemon.imgLink}/>
                <Typography sx={{fontSize: '15px', marginLeft: '10px', paddingRight: '15px'}}>
                    {listType === 'onHand' && capitalizedBallName} {getNameDisplay(!userData.loggedIn ? {} : userData.user.settings.display.pokemonNames, pokemon.name, pokemon.natDexNum)}{byPokemonEdit && !smScreen ? '' : ' is selected'}
                </Typography>
                
            </Box> 
        </Box>
        {pokemonDeletedFromMemory &&
            <Box sx={{position: 'absolute', bottom: '0px'}}>
                <Typography sx={{fontSize: '11px', ...smScreenMQuery}}>Re-add this pokemon to your collection to edit, or delete this on-hand.</Typography>
            </Box>
        }
        {(!pokemonDeletedFromMemory && !smScreen && !byPokemonEdit) && <Button onClick={() => dispatch(toggleEditScreenState())}>Edit Selection</Button>}
        {(listType === 'collection' && !smScreen) && 
            <Button sx={{position: 'absolute', right: '-70px', fontSize: '10px'}} onClick={fullyCompleteSet}>
                Complete Set
            </Button>
        }
        {(smScreen) &&
            <Box sx={{width: '100px', position: 'absolute', top: ohByPSWShowEditScreen ? '112.547px' : '100%', right: '0px', backgroundColor: '#e3e5e6', height: '48px', color: '#73661e', borderBottomLeftRadius: '5px', borderTop: '1px solid black', ...theme.components.box.fullCenterCol}}>
                <Button onClick={() => dispatch(deselect())} size='small' sx={{fontSize: '13px', width: '100%', height: '100%'}}>Deselect</Button>
            </Box>
        }
        {(smScreen && listType === 'collection') &&
            <Button onClick={fullyCompleteSet} size='small' variant='contained' sx={{position: 'absolute', top: '2px', right: '10px', textTransform: 'none', padding: 0, px: '2px', fontSize: '10px'}}>Complete Set</Button>
        }
        {(byPokemonEdit && !smScreen && !pokemonDeletedFromMemory) &&
            <Box sx={{width: '70%', height: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                {allowedBalls.includes(selectedBall) && //if this ever fails to occur, it'll only be a split moment, but that's enough to cause a crash.
                <>
                <BallSelectionForm
                    allowedBalls={allowedBalls}
                    value={selectedBall}
                    width='40%'
                    handleChange={(e, b) => dispatch(setSelectedBall(b))}
                />
                <ByPokemonQtyEditor qtyData={pokemon.idSetsAndNums[selectedBall]} fullIdSetsAndNums={pokemon.idSetsAndNums} pokeId={pokemon.imgLink} ball={selectedBall} smScreen={false}/>
                </>}
            </Box>
        }
        </>
    )
}