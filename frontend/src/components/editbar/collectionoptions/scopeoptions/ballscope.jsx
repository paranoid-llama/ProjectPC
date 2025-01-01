import {Box, Typography, ToggleButton, Button, Grid} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import SaveChangesConfirmModal from '../savechangesconfirmmodal'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { useState, useEffect, useContext, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalState } from '../../../../app/slices/editmode'
import { setBallScope } from '../../../../app/slices/collectionstate'
import { getBallsInGen } from '../../../../../common/infoconstants/miscconstants'
import { getOneArrData } from '../../../../../utils/functions/scope/getonearrdata'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import { ballScopeChange } from '../../../../../utils/functions/scope/statechanges'
import { saveBallScopeChanges } from '../../../../../utils/functions/scope/savescopechanges'
import { ownedPokemonEdit } from '../../../../../utils/functions/backendrequests/ownedpokemonedit'

export default function BallScope({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const oneArrLegalBalls = getOneArrData(useSelector((state) => state.editmode.pokemonScopeTotal), false, false)
    //changed collection state to filter disabled mons, and changed legalballinfo to use that instead of collection list display. think thats what
    //i meant to do, but cataloguing in case it comes to an error
    const collectionState = useSelector((state) => state.collectionState.collection).filter(p => !(p.disabled))
    const legalBallInfo = oneArrLegalBalls.filter(mon => collectionState.map(listMon => listMon.imgLink === mon.imgLink).includes(true))
    const ballScopeInit = useSelector((state) => state.collectionState.options.collectingBalls)
    const totalBalls = getBallsInGen(collectionGen)
    const [formData, setFormData] = useState({balls: ballScopeInit, removedPokemon: [], confirmChangesModal: false})
    const addedBalls = formData.balls.filter(ball => !ballScopeInit.includes(ball))
    const removedBalls = ballScopeInit.filter(ball => !formData.balls.includes(ball))

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        return () => {
            clearAlerts();
        };
    }, []);

    const changeBallScope = (newBall) => {
        const newBallStateInfo = ballScopeChange(newBall, formData.balls, [], legalBallInfo, true, formData.removedPokemon)
        if (newBallStateInfo === 'doNothing') {
            null
        } else if (newBallStateInfo.changePokemonScope) {
            setFormData({...formData, balls: newBallStateInfo.ballFormData, removedPokemon: newBallStateInfo.newRemovedPokemonArr})
        } else {
            setFormData({...formData, balls: newBallStateInfo.ballFormData})
        }
    }

    const saveChangesConfirmOpen = (saveButtonSelected, nextScreen) => {
        const noChangesMade = !(ballScopeInit.map(ball => formData.balls.includes(ball)).includes(false)) && !(formData.balls.map(ball => ballScopeInit.includes(ball)).includes(false))
        if (saveButtonSelected && noChangesMade) {
            setFormData({...formData, saveErrorNotice: true})
            setTimeout(() => {
                setFormData((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setFormData({...formData, confirmChangesModal: true, saveButtonSelected, nextScreen})
        } else {
            if (nextScreen === 'exit') {
                dispatch(changeModalState({open: false}))
            } else {
                dispatch(changeModalState({open: true, screen: nextScreen}))
            }
        }
    }

    const closeConfirmChangesModal = () => {
        setFormData({...formData, confirmChangesModal: false})
    }

    const finalizeChanges = async(saveChanges, nextScreen) => {
        if (saveChanges) {
            const newListState = saveBallScopeChanges(formData.balls, addedBalls, collectionState, legalBallInfo, formData.removedPokemon)
            setFormData({...formData, saving: true})
            if (demo) {
                setTimeout(() => {
                    dispatch(setBallScope({newCollectingBalls: formData.balls, newListState}))

                    //spawning alert
                    const alertMessage = `Updated Ball Scope!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);

                    dispatch(changeModalState({open: false}))
                }, 1000)
            } else {
                const newListBackendFormat = JSON.parse(JSON.stringify(newListState)).map(mon => {
                    delete mon.imgLink
                    delete mon.possibleGender
                    return mon
                }) 
                const backendFunc = async() => await ownedPokemonEdit(collectionGen, newListBackendFormat, collectionId, false, [], [], formData.balls)
           
                const successFunc = () => {
                    setTimeout(() => {
                        dispatch(setBallScope({newCollectingBalls: formData.balls, newListState}))
        
                        //spawning alert
                        const alertMessage = `Updated Ball Scope!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        const id = addAlert(alertInfo);
                        setAlertIds((prev) => [...prev, id]);
        
                        dispatch(changeModalState({open: false}))
                    }, 1000)
                }
                const errorFunc = () => {
                    setTimeout(() => {
                        dispatch(changeModalState({open: false}))
                    }, 1000)
                }
                handleError(backendFunc, false, successFunc, errorFunc) 
            } 
        } else if (nextScreen === 'goBack') {
            closeConfirmChangesModal()
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const renderBalls = () => {
        return (
            totalBalls.map(ball => {
                const ballDisplay = capitalizeFirstLetter(ball)
                return (
                    <Grid item xs={sw ? 3 : 2} key={`ball-scope-${ball}-selection`} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton 
                            value={ball} 
                            sx={{
                                padding: 2, 
                                display: 'flex', 
                                flexDirection: 'column',
                                textTransform: 'none',
                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 3px 0px rgba(0,0,0,0.22)',
                                '&.Mui-selected': {
                                    backgroundColor: '#283f57'
                                },
                                position: 'relative'
                            }}
                            selected={formData.balls.includes(ball)}
                            onChange={(e, newVal) => changeBallScope(newVal)}
                        >
                            <Typography sx={{fontSize: '14px', color: '#e3e3e3'}}>{ballDisplay}</Typography>
                            <ImgData type='items' linkKey={ball} size='32px'/>
                            {formData.balls.includes(ball) &&
                            <Box sx={{position: 'absolute', top: '-3px', right: '1px'}}>
                                <ImgData type='icons' linkKey='greencheckmark' size='12px'/>
                            </Box>
                            }
                        </ToggleButton>
                    </Grid>
                )
            })
        )
    }

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center'}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => saveChangesConfirmOpen(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => saveChangesConfirmOpen(false, 'changeScope')}>Change Scope</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1, textAlign: 'center'}}>Ball Scope</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1}}>
            <Typography sx={{fontWeight: 700, fontSize: '22px'}}>Change Ball Scope</Typography>
            <Typography>Select which balls you want to collect.</Typography>
            <Grid container sx={{width: '100%', height: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {renderBalls()}
            </Grid>
        </Box>
        <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => saveChangesConfirmOpen(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => saveChangesConfirmOpen(true, 'changeScope')}>Save</Button>
            </Box>
            {formData.saveErrorNotice && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        <SaveChangesConfirmModal
            open={formData.confirmChangesModal}
            modalScreen='ballScope'
            saveButtonSelected={formData.saveButtonSelected}
            nextScreen={formData.nextScreen}
            ballScopeData={{addedBalls, removedBalls, newBallScope: formData.balls, fullBalls: totalBalls, removedPokemonBallScope: formData.removedPokemon}}
            handleChange={finalizeChanges}
            closeModal={closeConfirmChangesModal}
            saving={formData.saving}
            sw={sw}
        />
        </>
    )
}