import {Box, Typography, useTheme, Tabs, Tab, ToggleButton, Button, Select, MenuItem} from '@mui/material'
import { regionalFormRegions, alolanFormMons, galarianFormMons, hisuianFormMons, paldeanFormMons, multipleRegionalFormMons, altFormNameDisplayOpts } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import { allAltFormMons } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import { regionIdentifiers } from '../../../../../common/infoconstants/miscconstants.mjs'
import ModalWrapper from '../../../../components/partials/modalwrapper'
import Header from '../../../../components/titlecomponents/subcomponents/header'
import ImgData from '../../../../components/collectiontable/tabledata/imgdata'
import modalStyles from '../../../../../utils/styles/componentstyles/modalstyles'
import { TableVirtuoso } from 'react-virtuoso'
import { getNameOptions } from './namesettinggeneration'
import { nameSettingRowContent, nameSettingTableHeader, nameSettingVirtuosoTableComponents } from './namesettingstablecomponents'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'

const originRegionalFormPokemon = alolanFormMons.concat(galarianFormMons, hisuianFormMons, paldeanFormMons)
// const regionalFormPokemon = originRegionalFormPokemon.map((poke, idx) => {
//     const isMultipleRegionalFormMon = multipleRegionalFormMons.includes(poke) //currently only applies to Meowth
//     if (isMultipleRegionalFormMon && (originRegionalFormPokemon.indexOf(poke) !== idx)) {
//         const latestRegionStep = regionIdentifiers.map((regionSuffix, idx) => eval(`${regionSuffix.toLowerCase()}FormMons`).includes(poke))
//         const latestRegion = regionIdentifiers.filter((region, idx) => latestRegionStep[idx] && latestRegionStep.indexOf(true) !== idx)[0]
//         return `${latestRegion} ${poke}`
//     }
//     const region = regionIdentifiers.filter(region => eval(`${region.toLowerCase()}FormMons`).includes(poke))[0]
//     return `${region} ${poke}`
// })

const genderAltFormOpts = [
    {value: 'default-symbol', display: 'Gender Symbol after Name'},
    {value: 'brackets-symbol-out', display: 'Gender Symbol in Brackets after Name'},
    {value: 'brackets-symbol-in', display: 'Gender Symbol in Brackets before Name'},
    {value: 'dash-symbol-out', display: 'Gender Symbol with Dash after Name'}, 
    {value: 'dash-symbol-in', display: 'Gender Symbol with Dash before Name'}, 
]

const specificNameDisplayOpts = {
    'Paldean Tauros (Combat)': altFormNameDisplayOpts,
    'Paldean Tauros (Aqua/Blaze)': [{value: 'sub', display: 'Show Fire/Water instead of Blaze/Aqua'}],
    'Nidoran': genderAltFormOpts,
    'Indeedee': genderAltFormOpts,
    'Rockruff (Dusk)': [{value: 'ability', display: 'Show Ability Name (Own Tempo) instead of Form Name (Dusk)'}]
}
const selectStyles = {
    width: '100%', 
    height: '50%', 
    '&.MuiInputBase-root': {
        width: '90%',
        border: '1px solid white',
        textOverflow: 'ellipsis',
        color: 'white'
    },
    '& .MuiSelect-select': {
        padding: 3,
    },
    fontSize: '12px'
}

export default function NameSettingsModal({open, toggleModal, nameSettingsState, changeSpecificSetting, currNameSettings}) {
    const theme = useTheme()

    return (
        <ModalWrapper
            height='700px'
            width='70%'
            sx={{maxWidth: '800px'}}
            ariaLabel='set specific name formats'
            ariaDescribe= "set name formats for specific regional/alternate form pokemon"
            open={open}
            handleClose={toggleModal}
        >
            <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '10%', ...theme.components.box.fullCenterCol}}>
                <Header>Specific Name Display Settings</Header>
            </Box>
            <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '10%', mt: 1, ...theme.components.box.fullCenterCol}}>
                <Typography sx={{fontSize: '18px', textAlign: 'center'}}>Set the name format for pokemon with specific formats here.</Typography>
            </Box>
            <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '70%', mt: 1, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Nidoran</Typography>
                        <Box sx={{...theme.components.box.fullCenterRow}}>
                            <ImgData linkKey='032' />
                            <ImgData linkKey='029' />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Nidoran', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Nidoran'] === undefined ? 'n/a' : nameSettingsState.specific['Nidoran']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            {specificNameDisplayOpts['Nidoran'].map(opt => {
                                return (
                                    <MenuItem
                                        key={`Nidoran-naming-option-${opt.value}`} 
                                        value={opt.value}
                                    >
                                        {opt.display}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Nidoran♀')}</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '11px', textAlign: 'center'}}>Shellos</Typography>
                        <Box sx={{...theme.components.box.fullCenterRow}}>
                            <ImgData linkKey='422-e' />
                            <ImgData linkKey='422-w' />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Shellos', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Shellos'] === undefined ? 'n/a' : nameSettingsState.specific['Shellos']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            <MenuItem value='sub'>Show Blue/Pink instead of East/West</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Shellos (East)')}</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '10px', textAlign: 'center'}}>Paldean Tauros (Combat)</Typography>
                        <Box sx={{...theme.components.box.fullCenterRow}}>
                            <ImgData linkKey='128-p' />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Paldean Tauros (Combat)', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Paldean Tauros (Combat)'] === undefined ? 'n/a' : nameSettingsState.specific['Paldean Tauros (Combat)']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            {specificNameDisplayOpts['Paldean Tauros (Combat)'].map(opt => {
                                return (
                                    <MenuItem 
                                        key={`Paldean-Tauros-Combat-naming-option-${opt.value}`} 
                                        value={opt.value}
                                    >
                                        {opt.display}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Paldean Tauros')}</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '10px', textAlign: 'center'}}>Paldean Tauros (Aqua/Blaze)</Typography>
                        <Box sx={{...theme.components.box.fullCenterRow}}>
                            <ImgData linkKey='128-p-a' />
                            <ImgData linkKey='128-p-b' />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Paldean Tauros (Aqua/Blaze)', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Paldean Tauros (Aqua/Blaze)'] === undefined ? 'n/a' : nameSettingsState.specific['Paldean Tauros (Aqua/Blaze)']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            <MenuItem value='sub'>Show Fire/Water instead of Blaze/Aqua</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Paldean Tauros (Aqua)')}</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Rockruff (Dusk)</Typography>
                        <ImgData linkKey='744-d' />
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Rockruff (Dusk)', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Rockruff (Dusk)'] === undefined ? 'n/a' : nameSettingsState.specific['Rockruff (Dusk)']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            <MenuItem value='ability'>Show Ability Name (Own Tempo) instead of Form Name (Dusk)</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Rockruff (Dusk)')}</Typography>
                    </Box>
                </Box>
                
                <Box sx={{...theme.components.box.fullCenterRow, backgroundColor: theme.palette.color1.main, borderRadius: '10px', mt: 1, width: '95%', height: '70px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Indeedee</Typography>
                        <Box sx={{...theme.components.box.fullCenterRow}}>
                            <ImgData linkKey='876-m' />
                            <ImgData linkKey='876-f' />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '70%', height: '100%'}}>
                        <Select
                            onChange={(e, newVal) => changeSpecificSetting('Indeedee', newVal.props.value)}
                            sx={selectStyles}
                            value={nameSettingsState.specific['Indeedee'] === undefined ? 'n/a' : nameSettingsState.specific['Indeedee']}
                        >
                            <MenuItem value='n/a'>Follow General Format</MenuItem>
                            {specificNameDisplayOpts['Indeedee'].map(opt => {
                                return (
                                    <MenuItem
                                        key={`Indeedee-naming-option-${opt.value}`} 
                                        value={opt.value}
                                    >
                                        {opt.display}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '15%', height: '100%'}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700, textAlign: 'center', my: 0.5}}>Example:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{getNameDisplay(nameSettingsState, 'Indeedee (Male)')}</Typography>
                    </Box>
                </Box>
            </Box>
            <Button variant='contained' onClick={toggleModal} sx={{mt: 1}}>Close</Button>
        </ModalWrapper>
    )
}