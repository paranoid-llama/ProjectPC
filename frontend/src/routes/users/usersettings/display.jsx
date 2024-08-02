import {Box, useTheme, Typography, TableBody, TableContainer, Table, TableHead, TableRow, TableCell, Select, MenuItem} from '@mui/material'
import { useRouteLoaderData, useLoaderData } from 'react-router'
import {useState, useContext} from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { regionalNameDisplayOpts, originRegionalNameDisplayOpts, altFormNameDisplayOpts } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay'

export default function Display({}) {
    const theme = useTheme()
    const user = useRouteLoaderData("userSettings")
    const pokemonNameDisplays = user.settings.display.pokemonNames
    const [displayTentativeChanges, setDisplayTentativeChanges] = useState({
        general: {regionalForms: pokemonNameDisplays.general.regionalForms, originRegionalForms: pokemonNameDisplays.general.originRegionalForms, alternateForms: pokemonNameDisplays.general.alternateForms},
        specific: pokemonNameDisplays.specific
    })
    const {addAlert} = useContext(AlertsContext)
    const {handleError} = useContext(ErrorContext)

    const makeGeneralNameDisplayChanges = (group, newVal) => {
        setDisplayTentativeChanges({...displayTentativeChanges, general: {...displayTentativeChanges.general, [group]: newVal}})
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

    return (
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: '100%', margin: 2, position: 'relative'}}>
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
            </Box>
        </Box>
    )
}