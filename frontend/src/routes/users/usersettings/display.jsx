import {Box, useTheme, Typography, TableBody, TableContainer, Table, TableHead, TableRow, TableCell, Select, MenuItem, Button} from '@mui/material'
import { useRouteLoaderData, useLoaderData, useOutletContext } from 'react-router'
import {useState, useContext} from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { regionalNameDisplayOpts, originRegionalNameDisplayOpts, altFormNameDisplayOpts } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import userSettingsBackendRequest from '../../../../utils/functions/backendrequests/users/settings'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'
import NameSettingsModal from './components/namesettingsmodal'

export default function Display({}) {
    const theme = useTheme()
    const user = useRouteLoaderData("userSettings")
    
    const revalidate = useOutletContext()
    const pokemonNameDisplays = user.settings.display.pokemonNames
    const [displayTentativeChanges, setDisplayTentativeChanges] = useState({
        general: {regionalForms: pokemonNameDisplays.general.regionalForms, originRegionalForms: pokemonNameDisplays.general.originRegionalForms, alternateForms: pokemonNameDisplays.general.alternateForms},
        modal: {open: false},
        specific: pokemonNameDisplays.specific
    })

    const noNameDisplayChanges = (pokemonNameDisplays.general.regionalForms === displayTentativeChanges.general.regionalForms && pokemonNameDisplays.general.originRegionalForms === displayTentativeChanges.general.originRegionalForms && pokemonNameDisplays.general.alternateForms === displayTentativeChanges.general.alternateForms) &&
        !Object.keys(displayTentativeChanges.specific).map(p => pokemonNameDisplays.specific[p] !== undefined && pokemonNameDisplays.specific[p] === displayTentativeChanges.specific[p]).includes(false) && Object.keys(displayTentativeChanges.specific).length === Object.keys(pokemonNameDisplays.specific).length
    const noTotalChanges = noNameDisplayChanges

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

    const saveChanges = () => {
        if (noTotalChanges) {
            addAlert({severity: 'error', message: 'No changes were made!', timeout: 3})
        }
        else {
            const newDisplaySettings = {pokemonNames: {general: displayTentativeChanges.general, specific: displayTentativeChanges.specific}}
            const backendFunc = async() => await userSettingsBackendRequest('display', newDisplaySettings, user.username)
            const successFunc = () => {
                // revalidator.revalidate()
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