import {Box, Grid, Typography, useTheme} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import { apriballs } from '../../../../../../common/infoconstants/miscconstants.mjs'
import { sortByDexNum } from '../../../../../../common/sortingfunctions/sortbydexnum.mjs'
import SpeciesSelect from '../../../editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'

export default function ExcludedComboSave({addedPokemon, removedPokemon, ballChanges, sw}) {
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    const theme = useTheme()
    const totalList = sortByDexNum('NatDexNumL2H', [
        ...addedPokemon,
        ...removedPokemon,
        ...ballChanges
    ])

    const listExcludedCombosChange = (index) => {
        const pokemonInfo = totalList[index]
        const pokemonName = pokemonInfo.name
        const pokemonType = addedPokemon.filter(mon => mon.imgLink === pokemonInfo.imgLink).length !== 0 ? 'addedPokemon' : 
            removedPokemon.filter(mon => mon.imgLink === pokemonInfo.imgLink).length !== 0 ? 'removedPokemon' :
            ballChanges.filter(mon => mon.imgLink === pokemonInfo.imgLink).length !== 0 && 'ballChangedPokemon'
        const diffBackground = pokemonType === 'addedPokemon' || pokemonType === 'removedPokemon'
        //this just reorders the balls so its all in the same order, and its not all the removed balls, added balls, and unchanged balls right beside each other
        const reOrderBalls = pokemonType === 'ballChangedPokemon' && 
            apriballs.filter(aprib => 
                pokemonInfo.removedBalls.includes(aprib) || 
                pokemonInfo.addedBalls.includes(aprib) || 
                pokemonInfo.unchangedBalls.includes(aprib)
            )
        const excludedBallsNum = pokemonType === 'ballChangedPokemon' ? 
            [pokemonInfo.removedBalls, pokemonInfo.addedBalls, pokemonInfo.unchangedBalls].flat().length :
            pokemonInfo.excludedBalls.length
        return (
            <>
            <Box 
                sx={{
                    display: 'flex',  
                    alignItems: 'center', 
                    backgroundColor: '#283f57',
                    borderRadius: '10px', 
                    marginBottom: '3px', 
                    marginTop: '3px',
                    position: 'relative',
                    opacity: pokemonType === 'removedPokemon' ? 0.5 : 1
                }}
            >
                <Box sx={{width: '100%', height: '100%', borderRadius: '10px', backgroundColor: pokemonType === 'addedPokemon' ? 'green' : pokemonType === 'removedPokemon' ? 'red' : 'black', opacity: diffBackground ? 0.4 : 0, position: 'absolute'}}></Box>
                <Box sx={{height: '100%', width: sw ? '8%' : '7%', mx: 1, zIndex: 1}}>
                    <ImgData linkKey={pokemonInfo.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width:  sw ? '11%' : '8%', zIndex: 1}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemonInfo.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '35%', zIndex: 1}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemonInfo.name, pokemonInfo.natDexNum)}</Typography>
                </Box>
                {sw ? 
                <Grid container sx={{height: '100%', width: '45%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 0.5, zIndex: 1}}>
                    {(pokemonType === 'addedPokemon' || pokemonType === 'removedPokemon') && pokemonInfo.excludedBalls.map((ball) => {
                        return (
                            <Grid key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`} item xs={2}>
                                <ImgData
                                    type='ball'
                                    linkKey={ball}
                                    size={'23px'}
                                />
                            </Grid>
                        )
                    })}
                    {pokemonType === 'ballChangedPokemon' && reOrderBalls.map((ball) => {
                        const addedBall = pokemonInfo.addedBalls.includes(ball)
                        const removedBall = pokemonInfo.removedBalls.includes(ball)
                        const bgColorScaling = excludedBallsNum >= 10 ? 23 : excludedBallsNum === 9 ? 26 :  excludedBallsNum === 8 ? 29 : 32
                        return (
                            <Grid key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`} item xs={2}>
                                <Box sx={{position: 'relative', zIndex: 3, opacity: removedBall ? 0.5 : 1}} key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`}>
                                    <Box sx={{backgroundColor: addedBall ? 'green' : removedBall ? 'red' : 'black', opacity: (addedBall || removedBall) ? 0.4 : 0, position: 'absolute', borderRadius: '5px', zIndex: 2, width: '23px', height: '23px'}}></Box> 
                                    <Box sx={{zIndex: 4, position: 'relative'}}>
                                    <ImgData
                                        type='ball'
                                        linkKey={ball}
                                        size={'23px'}
                                    />
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid> : 
                <Box sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 0.25, zIndex: 1}}>
                    {(pokemonType === 'addedPokemon' || pokemonType === 'removedPokemon') && pokemonInfo.excludedBalls.map((ball) => {
                        return (
                            <ImgData
                                key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`}
                                type='ball'
                                linkKey={ball}
                                size={excludedBallsNum >= 10 ? '23px' : excludedBallsNum === 9 ? '26px' :  excludedBallsNum === 8 ? '29px' : '32px'}
                            />
                        )
                    })}
                    {pokemonType === 'ballChangedPokemon' && reOrderBalls.map((ball) => {
                        const addedBall = pokemonInfo.addedBalls.includes(ball)
                        const removedBall = pokemonInfo.removedBalls.includes(ball)
                        const ballScaling = excludedBallsNum >= 10 ? '23px' : excludedBallsNum === 9 ? '26px' :  excludedBallsNum === 8 ? '29px' : '32px'
                        const bgColorScaling = excludedBallsNum >= 10 ? 23 : excludedBallsNum === 9 ? 26 :  excludedBallsNum === 8 ? 29 : 32
                        const bgColorWidth = `${bgColorScaling}px`
                        const bgColorHeight = `${bgColorScaling+3}px`
                        return (
                            <Box sx={{position: 'relative', zIndex: 3, opacity: removedBall ? 0.5 : 1}} key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`}>
                                <Box sx={{backgroundColor: addedBall ? 'green' : removedBall ? 'red' : 'black', opacity: (addedBall || removedBall) ? 0.4 : 0, position: 'absolute', borderRadius: '5px', zIndex: 2, width: bgColorWidth, height: bgColorHeight}}></Box> 
                                <Box sx={{zIndex: 4, position: 'relative'}}>
                                <ImgData
                                    type='ball'
                                    linkKey={ball}
                                    size={ballScaling}
                                />
                                </Box>
                            </Box>
                        )
                    })}
                </Box>}
            </Box> 
            </>
        )
    }

    return (
        <>
        <Box sx={{width: '100%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography sx={{height: '10%', fontSize: '14px', display: 'flex', alignItems: 'center'}}>
                Excluded Pokemon/Ball Combos: 
            </Typography>
            <SpeciesSelect
                listItemContent={listExcludedCombosChange}
                totalCount={totalList.length}
                height='80%'
                onlyList={true}
                otherStyles={{width: '100%', mt: 1}}
                virtuosoStyles={{border: '1px solid white'}}
            />
        </Box>
        </>
    )
}