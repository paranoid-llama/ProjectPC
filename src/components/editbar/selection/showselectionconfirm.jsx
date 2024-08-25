import { useEffect } from 'react'
import {Box, Typography, Button} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../collectiontable/tabledata/imgdata'
import {useSelector, useDispatch} from 'react-redux'
import {toggleEditScreenState} from './../../../app/slices/editmode'
import { setSelectedBall } from './../../../app/slices/editmode'

export default function ShowSelectionConfirm({listType, pokemon}) {
    const dispatch = useDispatch()
    const userData = useRouteLoaderData('root')
    const capitalizedBallName = listType === 'onHand' && `${pokemon.ball[0].toUpperCase()}${pokemon.ball.slice(1)}`
    if (listType === 'collection') {
        const allowedBalls = Object.keys(pokemon.balls).filter(ball => pokemon.balls[ball].disabled === undefined)
        const initBallState = allowedBalls.length === 3 || allowedBalls.length === 4 ? allowedBalls[1] : allowedBalls[0] 
        useEffect(() => {
            dispatch(setSelectedBall(initBallState)) //setting state here as 2 diff components (miscbuttonarea and ballselection) in the screen after (edit screen) uses it. prevents unnecessary re-renders
        })
    }
    return(
        <>
        <Box>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {listType === 'onHand' && <ImgData linkKey={pokemon.ball} type='ball'/>}
                <ImgData linkKey={pokemon.imgLink}/>
                <Typography sx={{fontSize: '15px', marginLeft: '10px', paddingRight: '15px'}}>
                    {listType === 'onHand' && capitalizedBallName} {getNameDisplay(userData.user.settings.display.pokemonNames, pokemon.name, pokemon.natDexNum)} is selected
                </Typography>
            </Box>
        </Box>
        <Button onClick={() => dispatch(toggleEditScreenState())}>Edit Selection</Button>
        </>
    )
}