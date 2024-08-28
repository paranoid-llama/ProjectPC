import {Box, useTheme, Typography, Paper, styled, Grid, Button} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { useState, useEffect, useContext, useRef} from 'react'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../alerts/alerts-context'
import ControlledTextInput from '../../../components/functionalcomponents/controlledtextinput'
import { useRouteLoaderData, useRevalidator, useOutletContext } from 'react-router'
import hexToRgba from 'hex-to-rgba'
import { gamesOrder } from '../../../../common/infoconstants/miscconstants.mjs'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import userSettingsBackendRequest from '../../../../utils/functions/backendrequests/users/settings'
import { Virtuoso } from 'react-virtuoso'

export default function Profile({user, revalidate}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const [formData, setFormData] = useState({bioValue: user.settings.profile.bio, bioLength: user.settings.profile.bio.length, games: user.settings.profile.games})
    const changesRef = useRef({bio: user.settings.profile.bio, games: user.settings.profile.games})

    const noChangesMade = formData.bioValue === changesRef.current.bio && (!changesRef.current.games.map(game => formData.games.includes(game)).includes(false) && changesRef.current.games.length === formData.games.length)

    const changeBio = (newValue) => {
        const closeNoChanges = formData.closeNoChanges === true ? {closeNoChanges: false} : {}
        setFormData({...formData, bioValue: newValue, bioLength: newValue.length, ...closeNoChanges})
    }

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

    const gameChange = (game) => {
        const alreadySelected = formData.games.includes(game)
        const newGamesArr = alreadySelected ? formData.games.filter(curGame => curGame !== game) : [...formData.games, game]
        const closeNoChanges = formData.closeNoChanges === true ? {closeNoChanges: false} : {}
        setFormData({...formData, games: newGamesArr, ...closeNoChanges})
    }

    const saveChanges = () => {
        if (noChangesMade) {
            //spawning alert
            const alertMessage = `No changes were made!`
            const alertInfo = {severity: 'error', message: alertMessage, timeout: 3}
            const id = addAlert(alertInfo);
            setAlertIds((prev) => [...prev, id]);
        } else {
            const newProfileSettings = {...user.settings.profile, bio: formData.bioValue, games: formData.games}
            const backendFunc = async() => await userSettingsBackendRequest('profile', newProfileSettings, user.username)
            const successFunc = () => {
                // revalidator.revalidate()
                revalidate()
                changesRef.current = {bio: formData.bioValue, games: formData.games}
                setTimeout(() => {
                    //spawning alert
                    const alertMessage = `Changed profile settings!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                }, 250)
            }
            handleError(backendFunc, false, successFunc, () => {})
        }
    }

    const ToggleButton = styled(MuiToggleButton)({
        '&.MuiToggleButton-root': {
            backgroundColor: theme.palette.color1.main,
            opacity: 0.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textTransform: 'none',
            color: 'white',
            border: 'none',
            padding: 8
        },
        '&.Mui-selected': {
            backgroundColor: theme.palette.color1.main,
            opacity: 1,
            boxShadow: '0px 5px 4px -4px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 5px 7px 0px rgba(0,0,0,0.12)',
            color: 'turquoise',
            ':hover': {
                backgroundColor: theme.palette.color1.main,
                opacity: 0.8
            }
        },
        '&:hover': {
            opacity: 0.9
        },
        
    })

    const Item = styled(Paper)(() => ({
        backgroundColor: 'transparent',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        textAlign: 'center',
        color: 'inherit',
        fontFamily: 'Arial',
    }));

    return (
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: '100%', margin: 2, position: 'relative'}}>
            {!noChangesMade && <Typography sx={{fontSize: '12px', color: 'grey', position: 'absolute', top: -12}}>You have unsaved changes</Typography>}
            <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', width: '100%', mt: 1}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700, mr: 3, mt: 2}}>Edit Bio:</Typography>
                <Box sx={{position: 'relative', width: '80%'}}>
                <ControlledTextInput
                    textFieldProps={{
                        multiline: true,
                        rows: 6
                    }}
                    textFieldStyles={{
                        '&.MuiTextField-root': {
                            width: '100%'
                        },
                        '& .MuiInputBase-input': {
                            '&::-webkit-scrollbar': {
                                width: '0.3em'
                            },
                            '&::-webkit-scrollbar-track': {
                                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75),
                                borderRadius: '5px'   
                            },
                        }
                    }}
                    charLimit={300}
                    defaultValue={formData.bioValue}
                    controlInputFunc={changeBio}
                />
                <Typography sx={{position: 'absolute', left: 0, top: '100%', color: 'grey', fontSize: '12px', fontWeight: formData.bioLength === 300 ? 700 : 400}}><i>{formData.bioLength}/300</i></Typography>
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', mt: 2}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Select Games:</Typography>
                <Typography sx={{fontSize: '12px'}}>Select which games you are collecting in/currently have. This is only used to let other users know what you have access to.</Typography>
                <Box sx={{position: 'relative', width: '90%'}}>
                    <Grid container sx={{...theme.components.box.fullCenterRow, gap: 1}}>
                        {gamesOrder.map((game) => {
                            return (
                                <Grid item key={`user-profile-pokemon-${game}-selection`}>
                                    <Item>
                                        <ToggleButton value={game} selected={formData.games.includes(game)} onChange={() => gameChange(game)}>
                                            <ImgData type='icons' linkKey={game} imgFolder={`h_60,c_scale/icons`} size='inherit'/>
                                        </ToggleButton>
                                    </Item>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
            </Box>
            <Button sx={{mt: 2, position: 'absolute', bottom: 0}} onClick={saveChanges}>Save Changes</Button>
        </Box>
    )
}