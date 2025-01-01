import {Box, Typography, Grid, ToggleButton} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import SpeciesSelect from '../../../editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'

export default function BallScopeSave({addedBalls, removedBalls, newBallScope, fullBalls, removedPokemon, sw}) {
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    const notRemovingPokemon = removedPokemon.length === 0

    const listItemContent = (index) => {
        const pokemonInfo = removedPokemon[index]
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
                }}
            >
                <Box sx={{height: '100%', width: '7%', mx: 1}}>
                    <ImgData linkKey={pokemonInfo.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: '8%', ml: 1}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemonInfo.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '30%', ml: 2}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemonInfo.name, pokemonInfo.natDexNum)}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 0.5}}>
                    {pokemonInfo.legalBalls.map((lB) => {
                        const key = `${pokemonInfo.id}-ball-legality-${lB}`
                        const ballName = capitalizeFirstLetter(lB)
                        const isApriball = lB === 'apriball'
                        return (
                            isApriball ? 
                            <Typography sx={{fontSize: '12px'}} key={key}> 
                                Apriballs
                            </Typography> :
                            <Box key={key} sx={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '10px'}}>
                                    {ballName}
                                </Typography>
                                <ImgData type='ball' linkKey={lB} size='20px'/>
                            </Box>
                        )
                    })}
                </Box>
            </Box> 
            </>
        )
    }

    const renderBalls = () => {
        return (
            fullBalls.map(ball => {
                const ballDisplay = capitalizeFirstLetter(ball)
                const removedBall = removedBalls.includes(ball)
                const includedBall = newBallScope.includes(ball)
                return (
                    <Grid item xs={sw ? 3 : 2} key={`ball-scope-${ball}-confirm`} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton 
                            value={ball} 
                            sx={{
                                padding: sw ? 0.85 : 1.5, 
                                display: 'flex', 
                                flexDirection: 'column',
                                textTransform: 'none',
                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 3px 0px rgba(0,0,0,0.22)',
                                backgroundColor: '#283f57',
                                position: 'relative',
                                opacity: (removedBall || !includedBall) ? 0.5 : 1
                            }}
                            disabled
                        >
                            <Typography sx={{fontSize: '14px', color: '#e3e3e3'}}>{ballDisplay}</Typography>
                            <ImgData type='items' linkKey={ball} size='32px'/>
                            {addedBalls.includes(ball) && <Typography sx={{fontSize: '10px', color: '#e3e3e3', position: 'absolute', bottom: '0px'}}>Added</Typography>}
                            {removedBall && <Typography sx={{fontSize: '10px', color: '#e3e3e3', position: 'absolute', bottom: '0px'}}>Removed</Typography>}
                        </ToggleButton>
                    </Grid>
                )
            })
        )
    }

    return (
        <>
        <Box sx={{display: 'flex', height: sw ? '50%' : notRemovingPokemon ? '40%' : '35%', width: '100%', flexDirection: 'column'}}>
            <Typography sx={{fontWeight: 700, textAlign: 'center', mt: sw ? -1 : 0}}>New Ball Scope</Typography>
            <Grid container sx={{height: '90%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {renderBalls()}
            </Grid>
        </Box>
        {removedBalls.length !== 0 && 
        <Box sx={{display: 'flex', height: '30px', width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: sw ? -1 : 0}}>
            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                {!sw ? <>Associated ball data (Is Owned, HA, and EM info) will be <b>permanently deleted</b>!</> : 
                    <>Ball Data will be <b>permanently deleted</b>!</>
                }
            </Typography>
        </Box>
        }
        <Box sx={{display: 'flex', height: notRemovingPokemon ? '30%' : sw ? '13%' : '8%', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: sw ? -1 : -2}}>
            {notRemovingPokemon ? 
                <>
                <Typography sx={{fontSize: sw ? '14px' : '24px', textAlign: 'center'}}>
                    No pokemon are set to be removed from the current ball scope changes.
                </Typography>
                <Typography sx={{fontSize: '12px', textAlign: 'center', mt: 3}}>
                    This typically only ever happens for Gen 6/Gen 7 collections. 
                </Typography>
                </> : 
                sw ? 
                <Typography sx={{textAlign: 'center', fontSize: '11px'}}>
                    Certain pokemon whose only legal ball combinations were removed balls are set to be removed. 
                    Below is the list of to be removed pokemon, as well as their legal ball combinations.
                </Typography> : 
                <>
                <Typography sx={{textAlign: 'center', fontSize: '11px'}}>
                    Certain pokemon whose only legal ball combinations were removed balls are set to be removed.
                </Typography>
                <Typography sx={{textAlign: 'center', fontSize: '11px'}}>
                    Below is the list of to be removed pokemon, as well as their legal ball combinations.
                </Typography>
                </>
            }
        </Box>
        {notRemovingPokemon === false && 
        <Box sx={{display: 'flex', height: '40%', width: '100%', flexDirection: 'column', alignItems: 'center'}}>
            <SpeciesSelect 
                listItemContent={(index) => listItemContent(index)}
                totalCount={removedPokemon.length}
                height='90%'
                onlyList={true}
                otherStyles={{width: '90%', mt: 1}}
                virtuosoStyles={{border: '1px solid white'}}
            />
            <Typography sx={{fontSize: '9px', textAlign: 'center'}}>
                Note: You will not be able to regain these pokemon by changing the ball scope back, only by changing the pokemon scope!
            </Typography>
        </Box>
        }
        </>
    )
}