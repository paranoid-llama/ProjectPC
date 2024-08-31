import {Box, useTheme, Typography, TableBody, TableContainer, Table, TableHead, TableRow, TableCell, Select, MenuItem, Button, ToggleButton, ToggleButtonGroup} from '@mui/material'
import { useRouteLoaderData, useLoaderData, useOutletContext, useRevalidator } from 'react-router'
import { apriballs } from '../../../../common/infoconstants/miscconstants.mjs'
import {useState, useContext} from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { regionalNameDisplayOpts, originRegionalNameDisplayOpts, altFormNameDisplayOpts } from '../../../../common/infoconstants/pokemonconstants.mjs'
import userSettingsBackendRequest from '../../../../utils/functions/backendrequests/users/settings'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'
import NameSettingsModal from './components/namesettingsmodal'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import hexToRgba from 'hex-to-rgba'

export default function Display({user, revalidate}) {
    const theme = useTheme()
    const pokemonNameDisplays = user.settings.display.pokemonNames
    const [displayTentativeChanges, setDisplayTentativeChanges] = useState({
        general: {regionalForms: pokemonNameDisplays.general.regionalForms, originRegionalForms: pokemonNameDisplays.general.originRegionalForms, alternateForms: pokemonNameDisplays.general.alternateForms},
        modal: {open: false},
        specific: pokemonNameDisplays.specific,
        ballOrder: user.settings.display.ballOrder,
        onhandView: user.settings.display.defaultOnhandView
    })

    const trueTentativeBallOrder = [...displayTentativeChanges.ballOrder, ...apriballs.filter(apB => !displayTentativeChanges.ballOrder.includes(apB))]

    const noNameDisplayChanges = (pokemonNameDisplays.general.regionalForms === displayTentativeChanges.general.regionalForms && pokemonNameDisplays.general.originRegionalForms === displayTentativeChanges.general.originRegionalForms && pokemonNameDisplays.general.alternateForms === displayTentativeChanges.general.alternateForms) &&
        !Object.keys(displayTentativeChanges.specific).map(p => pokemonNameDisplays.specific[p] !== undefined && pokemonNameDisplays.specific[p] === displayTentativeChanges.specific[p]).includes(false) && Object.keys(displayTentativeChanges.specific).length === Object.keys(pokemonNameDisplays.specific).length 
    const noBallOrderChanges = !trueTentativeBallOrder.map((apB, idx) => user.settings.display.ballOrder.indexOf(apB) === idx).includes(false)
    const noOnhandViewChanges = user.settings.display.defaultOnhandView === displayTentativeChanges.onhandView
    const noTotalChanges = noNameDisplayChanges && noBallOrderChanges && noOnhandViewChanges

    const toggleModal = () => {setDisplayTentativeChanges({...displayTentativeChanges, modal: {...displayTentativeChanges.modal, open: !displayTentativeChanges.modal.open}})}

    const {addAlert} = useContext(AlertsContext)
    const {handleError} = useContext(ErrorContext)

    const makeGeneralNameDisplayChanges = (group, newVal) => {
        setDisplayTentativeChanges({...displayTentativeChanges, general: {...displayTentativeChanges.general, [group]: newVal}})
    }

    const makeSpecificNameDisplayChanges = (poke, newVal) => {
        const removeKeyValue = displayTentativeChanges.specific[poke] !== undefined && (displayTentativeChanges.specific[poke] === newVal || newVal === 'n/a')
        const newSpecificObj = (removeKeyValue) ? {...displayTentativeChanges.specific} : {...displayTentativeChanges.specific, [poke]: newVal}
        if (removeKeyValue) {
            delete newSpecificObj[poke]
        }
        setDisplayTentativeChanges({...displayTentativeChanges, specific: newSpecificObj})
    }  
    
    const changeBallOrder = (ball, ballIsSelected) => {
        const newState = {...displayTentativeChanges, ballOrder: ballIsSelected ? displayTentativeChanges.ballOrder.filter(b => b !== ball) : [...displayTentativeChanges.ballOrder, ball]}
        setDisplayTentativeChanges(newState)
    }

    const generateNamingSelect = (nameGroup) => {
        const namingOptsFull = nameGroup === 'originRegionalForms' ? originRegionalNameDisplayOpts : nameGroup === 'regionalForms' ? regionalNameDisplayOpts : altFormNameDisplayOpts
        return (
            <Select
                onChange={(e, newValue) => makeGeneralNameDisplayChanges(nameGroup, newValue.props.value)}
                sx={{
                    width: '100%', 
                    height: '70%', 
                    '&.MuiInputBase-root': {
                        width: '100%',
                        textOverflow: 'ellipsis'
                    },
                    '& .MuiSelect-select': {
                        padding: 0.5,
                    },
                    fontSize: '12px'
                }}
                value={displayTentativeChanges.general[nameGroup]}
            >
                {namingOptsFull.map(namingOpt => {
                    return (
                        <MenuItem 
                            key={`${nameGroup}-naming-${namingOpt.value}-option`} 
                            value={namingOpt.value}
                        >
                            {namingOpt.display}
                        </MenuItem>
                    )
                })}
            </Select>
        )
    }

    const ballButtonStyles = {
        '&.Mui-selected': {
            backgroundColor: hexToRgba(theme.palette.color1.main, 0.9),
            ':hover': {
                backgroundColor: hexToRgba(theme.palette.color1.main, 0.75)
            }
        }
    }

    const saveChanges = () => {
        if (noTotalChanges) {
            addAlert({severity: 'error', message: 'No changes were made!', timeout: 3})
        }
        else {
            const newDisplaySettings = {pokemonNames: {general: displayTentativeChanges.general, specific: displayTentativeChanges.specific}, ballOrder: trueTentativeBallOrder, defaultOnhandView: displayTentativeChanges.onhandView}
            const backendFunc = async() => await userSettingsBackendRequest('display', newDisplaySettings, user.username)
            const successFunc = () => {
                revalidate()
                setTimeout(() => {
                    addAlert({severity: 'success', message: `Changed display settings!`, timeout: 3});
                }, 250)
            }
            handleError(backendFunc, false, successFunc, () => {})
        }
    }

    return (
        <>
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: '100%', margin: 2, position: 'relative'}}>
            {!noTotalChanges && <Typography sx={{fontSize: '12px', color: 'grey', position: 'absolute', top: -12}}>You have unsaved changes</Typography>}
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', mt: 1}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Pokemon Name Display Settings:</Typography>
                <Table sx={{border: '1px solid black'}}>
                    <TableHead sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50px', border: 'none'}}>
                        <TableRow sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50px', border: 'none'}}>
                            <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', borderRight: '1px solid black', py: 0}}><Typography sx={{textAlign: 'center'}}>Name Group</Typography></TableCell>
                            <TableCell sx={{...theme.components.box.fullCenterRow, width: '50%', height: '100%', border: 'none', borderRight: '1px solid black', py: 0}}><Typography sx={{textAlign: 'center'}}>Naming Convention</Typography></TableCell>
                            <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0}}><Typography sx={{textAlign: 'center'}}>Example</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                <TableBody sx={{...theme.components.box.fullCenterCol, width: '100%'}}>
                    <TableRow sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50px'}}>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}><Typography sx={{textAlign: 'center', fontSize: '10px'}}>Origin Regional Form Pokemon</Typography></TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, minWidth: '120px', width: '50%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}>{generateNamingSelect('originRegionalForms')}</TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0}}><Typography sx={{textAlign: 'center'}}>{getNameDisplay(displayTentativeChanges, 'Meowth', 52)}</Typography></TableCell>
                    </TableRow>
                    <TableRow sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50px', borderTop: 'none'}}>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}><Typography sx={{textAlign: 'center', fontSize: '12px'}}>Regional Form Pokemon</Typography></TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, minWidth: '120px', width: '50%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}>{generateNamingSelect('regionalForms')}</TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0}}><Typography sx={{textAlign: 'center'}}>{getNameDisplay(displayTentativeChanges, 'Alolan Meowth', 52)}</Typography></TableCell>
                    </TableRow>
                    <TableRow sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50px', borderTop: 'none', borderBottom: 'none'}}>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}><Typography sx={{textAlign: 'center', fontSize: '12px'}}>Alternate Form Pokemon</Typography></TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, minWidth: '120px', width: '50%', height: '100%', border: 'none', py: 0, borderRight: '1px solid black'}}>{generateNamingSelect('alternateForms')}</TableCell>
                        <TableCell sx={{...theme.components.box.fullCenterRow, width: '30%', height: '100%', border: 'none', py: 0}}><Typography sx={{textAlign: 'center'}}>{getNameDisplay(displayTentativeChanges, 'Flabébé (Red)', 669)}</Typography></TableCell>
                    </TableRow>
                </TableBody>
                </Table>
                <Button variant='contained' sx={{mt: 1}} onClick={() => setDisplayTentativeChanges({...displayTentativeChanges, modal: {...displayTentativeChanges.modal, open: true}})}>Specific Name Display Settings</Button>
            </Box>
            <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Box sx={{width: '100%', position: 'relative'}}>
                    <Typography sx={{fontSize: '18px', fontWeight: 700}}>
                        Select Ball Order
                    </Typography>
                    <Typography sx={{fontSize: '12px'}}>Select the order of the ball columns when you view a collection. Unselected balls will be ordered left to right.</Typography>
                </Box>
                <Box sx={{width: '100%', height: '40%', display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2}}>
                    {apriballs.map((ball) => {
                        return (
                            <ToggleButton 
                                key={`order-select-${ball}-ball`} 
                                value={ball}
                                selected={displayTentativeChanges.ballOrder.includes(ball)}
                                onChange={() => changeBallOrder(ball, displayTentativeChanges.ballOrder.includes(ball))}
                                sx={{padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'end', mx: 0.2, position: 'relative', height: '55px', ...ballButtonStyles}}
                            >
                                {displayTentativeChanges.ballOrder.includes(ball) && 
                                <Typography
                                    sx={{
                                        fontSize: '14px', 
                                        position: 'absolute',
                                        top: '-3px', 
                                        fontWeight: 700,
                                        color: 'white'
                                    }}
                                >
                                        {displayTentativeChanges.ballOrder.indexOf(ball) + 1}
                                </Typography>
                                }
                                <ImgData type='ball' linkKey={ball}/>
                            </ToggleButton>
                        )
                    })}
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: -5}}>
                <Box sx={{width: '100%', position: 'relative'}}>
                    <Typography sx={{fontSize: '18px', fontWeight: 700}}>
                        Select Default On-Hand View
                    </Typography>
                    <Typography sx={{fontSize: '12px'}}>Select the default view when looking at an On-Hands list.</Typography>
                </Box>
                <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2}}>
                    <ToggleButtonGroup value={displayTentativeChanges.onhandView} sx={{backgroundColor: hexToRgba(theme.palette.color1.main, 0.65), color: 'white'}} exclusive onChange={(e, newVal) => setDisplayTentativeChanges({...displayTentativeChanges, onhandView: newVal})}>
                        <ToggleButton value='byIndividual' sx={{padding: 0.25, px: 2, color: 'white', '&.Mui-selected': {color: 'white', backgroundColor: hexToRgba(theme.palette.color1.dark, 0.9)}}}>By Individual</ToggleButton>
                        <ToggleButton value='byPokemon' sx={{padding: 0.25, px: 2, color: 'white', '&.Mui-selected': {color: 'white', backgroundColor: hexToRgba(theme.palette.color1.dark, 0.9)}}}>By Pokemon</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                
            </Box>
            <Button sx={{mt: 2, position: 'absolute', bottom: 0}} onClick={saveChanges}>Save Changes</Button>
        </Box>
        <NameSettingsModal 
            open={displayTentativeChanges.modal.open} 
            toggleModal={toggleModal} 
            changeSpecificSetting={makeSpecificNameDisplayChanges}
            nameSettingsState={displayTentativeChanges}
            currNameSettings={pokemonNameDisplays}
        />
        </>
    )
}