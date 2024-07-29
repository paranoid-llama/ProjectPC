import {Box, Typography, Button, LinearProgress, Grid, styled, Paper} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { useEffect, useState, useRef} from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Header from '../../../../titlecomponents/subcomponents/header'
import { getPokemonGroups } from '../../../../../../utils/functions/backendrequests/getpokemongroups'
import { scopeSingleChange, scopeMassChange, ballScopeChange, excludedCombosChange } from '../../../../../../utils/functions/scope/statechanges'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import PokemonBallCombosModal from '../aprimon/pokemonballcombosmodal'
import PokemonGroupCardArea from '../aprimon/pokemongroupcardarea'

export default function ScopeSelection({collectionType, collectionGen, importedCollection, scope, ballScopeInit, goBackStep, cssClass, handleChange}) {
    if (scope !== undefined && scope.error) {
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
                <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Set Collection Scope</Header>
                <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
                <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <>
                    <Typography sx={{fontSize: '24px', color: 'rgb(200, 50, 50)', fontWeight: 700, mb: 2, mt: 10}}>
                        Error {scope.status}: {scope.name}
                    </Typography>
                    <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                        {scope.message}
                    </Typography>
                    <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                        Go back and try again, or try again later!
                    </Typography>
                </> 
                </Box>
                <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                    <Box sx={{display: 'flex', width: '90%'}}>
                        <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                            <Button onClick={goBackStep.func}>
                                <ArrowBackIcon/>
                                <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }
    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected': {
            backgroundColor: 'rgba(99, 99, 99, 0.3)',
        }
    })

    const firstNoticeRender = importedCollection === undefined
    const inheritScopeFromImportNotice = firstNoticeRender ? false : Object.values(importedCollection).length !== 0
    const [showImportScopeNotice, setShowImportScopeNotice] = useState('firstRender')
    const showNotice = showImportScopeNotice === 'firstRender' && inheritScopeFromImportNotice 

    const closeNotice = () => {
        setShowImportScopeNotice(false)
    }

    const [pokemonGroupsFormData, setPokemonGroupsFormData] = useState({
        pokemon: scope === undefined ? {} : scope.formData, 
        balls: ballScopeInit === undefined ? [] : ballScopeInit.formData,
        excludedCombos: scope === undefined ? {} : scope.excludedCombos
    })
    const [pokemonBallComboModal, setPokemonBallComboModal] = useState({selected: '', open: false})

    const toggleModal = () => {
        const newStatus = !pokemonBallComboModal.open
        setPokemonBallComboModal({selected: {}, open: newStatus})
    }

    const selectPokemonBallCombo = (pokemonId) => {
        setPokemonBallComboModal({...pokemonBallComboModal, selected: pokemonId})
    }

    const gettingGroups = scope === undefined
    const gettingBallData = ballScopeInit === undefined
    const groupKeys = !gettingGroups && Object.keys(scope.total)
    const firstPokemonScopeRender = Object.keys(pokemonGroupsFormData.pokemon).length === 0
    const firstBallScopeRender = pokemonGroupsFormData.balls.length === 0

    const Item = styled(Paper)(() => ({
        backgroundColor:'#222222',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '8px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
    }));
    
    const tyroguePresent = scope !== undefined && (Array.isArray(scope.total.breedables) ? scope.total.breedables.filter(mon => mon.id === '236').length !== 0 : scope.total.breedables.regular.filter(mon => mon.id === '236').length !== 0)

    //a bit weird what we do below. long explanation for this and for the conditional state initialization above:
    //scope and ballscopeinit are initialized after an async function to get data from backend. first few renders of this component, it comes out undefined,
    //which sets the state as empty objects. to prevent component from throwing an error for trying to get a nested item from an undefined object, we add these conditionals
    // and use that data for the first state update since the state was already initialized as empty objects. this has no bad effect since you can't actually
    // change any of the states until the data comes out due to the "gettingGroups" and "gettingBallData" preventing any interactable forms from rendering on the page. 
    const pokemonFormData = firstPokemonScopeRender ? scope !== undefined && scope.formData : pokemonGroupsFormData.pokemon
    const ballScopeData = firstBallScopeRender ? ballScopeInit !== undefined && ballScopeInit.formData : pokemonGroupsFormData.balls

    const togglePokemon = (e, groupInfo, imgLink, name, natDexNum) => {
        const newPokemonScopeState = scopeSingleChange(groupInfo, {name, id: imgLink, natDexNum}, pokemonFormData)
        setPokemonGroupsFormData({...pokemonGroupsFormData, pokemon: newPokemonScopeState})
    }

    const massTogglePokemon = (e, groupInfo, type) => {
        const newPokemonScopeState = scopeMassChange(groupInfo, type, pokemonFormData, scope.total, ballScopeData)
        if (newPokemonScopeState === 'doNothing') {
            null
        } else {
            setPokemonGroupsFormData({...pokemonGroupsFormData, pokemon: newPokemonScopeState})
        }
    }

    const toggleBall = (e, ball) => {
        const newBallScope = ballScopeChange(ball, ballScopeData, pokemonFormData, scope.oneArrTotal)
        if (newBallScope === 'doNothing') {
            null
        } else if (newBallScope.changePokemonScope) {
            setPokemonGroupsFormData({...pokemonGroupsFormData, pokemon: newBallScope.newPokemonScopeData, balls: newBallScope.ballFormData})
        } else {
            setPokemonGroupsFormData({...pokemonGroupsFormData, balls: newBallScope.ballFormData})
        }
    }

    const togglePokemonBallCombo = (monInfo, ball) => {
        const newCombosState = excludedCombosChange(monInfo, ball, pokemonGroupsFormData.excludedCombos)
        setPokemonGroupsFormData({...pokemonGroupsFormData, excludedCombos: newCombosState})
    }

    // console.log(scope)
    // console.log(pokemonGroupsFormData)

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Set Collection Scope</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: showNotice ? 'blur(4px)' : 'none', opacity: showNotice ? 0.5 : 1}}>
                <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Select Pokemon Groups</Typography>
                <Typography sx={{fontSize: '12px'}}>Select which groups of pokemon you want in your collection. Click on a group to see details.</Typography>
                <Box sx={{width: '80%', height: '27%', display: 'flex', flexDirection: 'column'}}>
                    {gettingGroups ? 
                    <>
                    <Typography sx={{mt: 2}}>Getting Pokemon Groups...</Typography>
                    <LinearProgress/>
                    </> : 
                    <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', mt: 1, gap: 1}}>
                        <PokemonGroupCardArea 
                            typeTotalMons={scope.total} 
                            formData={pokemonFormData} 
                            ballScope={ballScopeData}
                            groupKeys={groupKeys} 
                            handleChange={togglePokemon}
                            handleMassChange={massTogglePokemon}
                            tyroguePresent={tyroguePresent}
                        />
                    </Box>
                    }
                    
                </Box>
                <Box sx={{width: '90%', height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3}}>
                    <Box sx={{width: '60%', height: '90%', display: 'flex', flexDirection: 'column'}}>
                        <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Select Ball Scope</Typography>
                        <Typography sx={{fontSize: '12px'}}>Select which apri/special balls you want to collect </Typography>
                        {gettingBallData ? 
                        <>
                        <Typography sx={{mt: 2}}>Getting Ball Scope...</Typography>
                        <LinearProgress/>
                        </> : 
                        <>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', mt: 1, gap: 1}}>
                            <Grid sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} container>
                                {ballScopeInit.total.map((ball) => {
                                    return (
                                        <Grid item xs={2} key={`${ball}-ball-scope-selection`}>
                                            <ToggleButton 
                                                sx={{height: '40px', px: 0.5}}
                                                selected={ballScopeData.includes(ball)}
                                                value={ball}
                                                onChange={(e) => toggleBall(e, ball)}
                                            >
                                                <ImgData type='ball' linkKey={ball} size={'40px'}/>
                                            </ToggleButton>
                                        </Grid>
                                    )
                                })
                                }
                            </Grid>
                        </Box>
                        <Typography sx={{fontSize: '12px', mt: 2}}>
                            <b>WARNING:</b> Deselecting a ball will remove pokemon whose only legal ball combo is that ball!
                        </Typography>
                        </>
                        }
                    </Box>
                    <Box sx={{width: '20%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Exclude Pokemon/Ball Combos</Typography>
                        <Typography sx={{fontSize: '12px'}}>Exclude certain pokemon/ball combos you don't want to collect</Typography>
                        {gettingGroups ?
                            <></> :
                            <>
                            <Button sx={{padding: 0, margin: 0, textTransform: 'none'}} onClick={toggleModal}>
                                <Item>
                                    Change Pokemon/Ball Combos
                                </Item>
                            </Button>
                            <PokemonBallCombosModal
                                isOpen={pokemonBallComboModal.open}
                                totalList={scope.oneArrTotal}
                                selectedMon={pokemonBallComboModal.selected}
                                ballComboData={pokemonGroupsFormData.excludedCombos}
                                formData={pokemonFormData}
                                ballScope={ballScopeData}
                                allPossibleBalls={ballScopeInit.total}
                                toggleModal={toggleModal}
                                changePokemonSelection={selectPokemonBallCombo}
                                handleChange={togglePokemonBallCombo}
                            />
                            </>
                        }
                    </Box>
                </Box>
                <Typography sx={{fontSize: '14px', fontWeight: 700}}>You can change all of these settings later on.</Typography>
            </Box>
            {showNotice &&
            <Box sx={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                <Typography sx={{fontSize: '32px', fontWeight: 700}}>Inheriting Scope from Import</Typography>
                <Button onClick={() => closeNotice()}>Change Scope Anyway</Button>
            </Box>
            }
            
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={goBackStep.func}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                    {!gettingGroups && 
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={(e) => handleChange(e, pokemonFormData, ballScopeData, pokemonGroupsFormData.excludedCombos)}>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>Options</Typography>
                            <ArrowForward/>
                        </Button>
                    </Box>}
                </Box>
            </Box>
        </Box>
    )
}