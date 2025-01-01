import {Typography, Box, Tabs, Tab, Button, useTheme, Select, MenuItem} from '@mui/material'
import { useState } from 'react'
import PokemonGroupDisplay from './pokemongroupdisplay'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { getScopePeripheralInfo } from '../../../../../../utils/functions/scope/getperipheralinfo'
import { pokemonGroups } from '../../../../../../common/infoconstants/pokemonconstants.mjs'
import hexToRgba from 'hex-to-rgba'
import SmallWidthModalWrapper from '../../../../partials/wrappers/smallwidthmodalwrapper'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const scrollerStyles = {
    '&::-webkit-scrollbar': {
        width: '6px'
    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'black',
        borderRadius: '5px'
    },
}

export default function PokemonGroupModalContents({elementBg, modalState, groupKeys, ballScope, changeGroup, changeSubGroup, handleChange, handleMassChange, scopePeripheryInfo, tyroguePresent, changingScope=false, changeScopeSave={}, saveErrorNoticeShow=false, sw=false}) {
    const theme = useTheme()
    const [seePokemon, setSeePokemon] = useState(false)
    const {groupTotal, activeSubGroupKey, hasSubGroups, groupInfo, babyAdultMonGroupActive, interchangeableAltFormGroupActive, 
        groupLabels, activeSubGroups, activeSubGroup, totalPokemonInGroup, selectedPokemonInGroup, amountIncluded
    } = scopePeripheryInfo

    const generateButtons = () => {
        return babyAdultMonGroupActive ? 
            <>
               <Button onClick={(e) => handleMassChange(e, groupInfo, 'Babies')}>
                    Include All Babies
                </Button>
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'none')}>
                    Include None
                </Button> 
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'Adults')}>
                    Include All Adults
                </Button>
            </> : 
            interchangeableAltFormGroupActive ? 
            <>
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'any')} size='small'>
                    Include Any Forms
                </Button>
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'none')} size='small'>
                    Include None
                </Button> 
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'allForms')} size='small'>
                    Include All Forms
                </Button>
            </> :
            <>
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'all')}>
                    Include All
                </Button>
                <Button onClick={(e) => handleMassChange(e, groupInfo, 'none')}>
                    Include None
                </Button>
            </>
    }

    const selectWrapperSx = sw ? {...theme.components.box.fullCenterCol} : {}

    return (
        <>
        {changingScope && 
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeScopeSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeScopeSave(false, 'changeScope')}>Change Scope</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1, textAlign: 'center'}}>Pokemon Scope</Typography>
        </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: sw ? '35%' : hasSubGroups ? '25%' : '35%', ...selectWrapperSx}}>
            {sw && 
            <Typography sx={{mb: 2, fontWeight: 700}}>Select Pokemon Group:</Typography>
            }
            {sw ? 
            <Select value={modalState.group} onChange={(e, newVal) => changeGroup(e, newVal.props.value)} sx={{width: '80%', height: '20%', '&.MuiInputBase-root': {border: '1px solid white', color: 'white'}}} MenuProps={{MenuListProps: {sx: {maxHeight: '200px', overflowY: 'scroll', py: 0, ...scrollerStyles}}}}>
                {groupLabels.map((label, idx) => {
                    const styles = {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.99), color: theme.palette.color3.main, '&.Mui-selected': {backgroundColor: theme.palette.color3.main, color: theme.palette.color1.main, ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.5)}}, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.75)}} 
                    return (
                        <MenuItem
                            key={`${label}-group-modal-tab`}
                            value={groupKeys[idx]}
                            sx={{...styles, fontSize: '12px', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}
                        >
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', gap: 2}}>
                                {label}
                            </Box>
                        </MenuItem>
                    )
                })}
            </Select> : 
            <Tabs sx={{color: 'white'}} onChange={(e, value) => changeGroup(e, value)} value={modalState.group}>
                {groupLabels.map((label, idx) => {
                    return (
                        <Tab 
                            key={`${label}-group-modal-tab`}
                            label={label} 
                            value={groupKeys[idx]} 
                            sx={{color: '#d3d3d3', fontSize: '12px', paddingX: 2, paddingY: 1, width: `${(100/groupTotal)+1}%`}}
                        />
                    )
                })}
            </Tabs>
            }
            <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: 2}}>{pokemonGroups.filter(grp => grp.key === modalState.group)[0].display}</Typography>
            <Typography align='center' sx={{paddingTop: '10px', fontSize: '16px', fontWeight: 400, mb: 3}}>{pokemonGroups.filter(grp => grp.key === modalState.group)[0].desc}</Typography>
        </Box>
        {(hasSubGroups && !sw) && 
            <Box sx={{...elementBg, width: '95%', height: sw ? '6%' : '8%', mt: 1, display: 'flex', justifyContent: 'center'}}>
                <Tabs sx={{width: '90%'}} onChange={(e, value) => changeSubGroup(e, value)} value={modalState.subGroup[groupInfo.group]}>
                    {activeSubGroups.map((group, idx) => {
                        const actualValue = babyAdultMonGroupActive ? group.display.toLowerCase() : group.key
                        return (
                            <Tab 
                                key={`${group.display}-group-modal-tab`}
                                label={group.display} 
                                value={actualValue} 
                                sx={{color: '#d3d3d3', fontSize: '12px', paddingX: 2, paddingY: 1, width: `${(100/activeSubGroups.length)/2}%`}}
                            />
                        )
                    })}
                </Tabs>
            </Box>
        }
        
        <Box sx={{...elementBg, width: '95%', height: sw ? '40%' : hasSubGroups ? '65%' : '75%', mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            {sw ? 
                <>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '60%'}}>
                    {hasSubGroups ?
                    <>
                    <Typography sx={{mb: 2, fontWeight: 700}}>Select Sub-Group:</Typography>
                    <Select value={modalState.subGroup[groupInfo.group]} onChange={(e, newVal) => changeSubGroup(e, newVal.props.value)} sx={{width: '80%', height: '20%', '&.MuiInputBase-root': {border: '1px solid white', color: 'white'}}} MenuProps={{MenuListProps: {sx: {maxHeight: '200px', overflowY: 'scroll', py: 0, ...scrollerStyles}}}}>
                        {activeSubGroups.map(group => {
                            const actualValue = babyAdultMonGroupActive ? group.display.toLowerCase() : group.key
                            const styles = {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.99), color: theme.palette.color3.main, '&.Mui-selected': {backgroundColor: theme.palette.color3.main, color: theme.palette.color1.main, ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.5)}}, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.75)}} 
                            return (
                                <MenuItem
                                    key={`${group.display}-group-modal-tab`}
                                    value={actualValue}
                                    sx={{...styles, fontSize: '12px', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}
                                >
                                    <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', gap: 2}}>
                                        {group.display}
                                    </Box>
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <Typography align='center' sx={{paddingTop: '10px', fontSize: '12px', fontWeight: 400, my: 1.5}}>
                        {activeSubGroup.desc}
                    </Typography>
                    </> : 
                    <Typography sx={{mb: 2, fontWeight: 700, color: 'grey'}}><i>No Sub-Groups</i></Typography>
                    } 
                </Box>
                <Button variant='contained' onClick={() => setSeePokemon(!seePokemon)}>See/Edit Pokemon</Button>
                <Typography sx={{fontSize: '11px', mt: 1}}>Including {amountIncluded}</Typography>
                </> : 
                <>
                {hasSubGroups &&
                    <Typography align='center' sx={{paddingTop: '10px', fontSize: '12px', fontWeight: 400, mb: 3}}>
                        {activeSubGroup.desc}
                    </Typography> 
                    }
                    <Typography sx={{position: 'absolute', top: '1%', right: '5%', fontSize: '12px'}}>
                        Including {amountIncluded}
                    </Typography>
                    <Box sx={{height: '5%', width: (babyAdultMonGroupActive || interchangeableAltFormGroupActive) ? '100%' : '70%', mb: 1, display: 'flex', gap: babyAdultMonGroupActive ? 3 : 5, justifyContent: 'center'}}>
                        {generateButtons()}
                    </Box>
                    <PokemonGroupDisplay 
                        totalPokemon={totalPokemonInGroup} 
                        activePokemon={selectedPokemonInGroup}  
                        ballScope={ballScope}
                        isInterchangeableAltFormSelection={activeSubGroupKey === 'interchangeable'}
                        groupInfo={groupInfo}
                        handleChange={handleChange}
                        tyroguePresent={tyroguePresent}
                        sw={sw}
                    />
                </>
            }
            
        </Box>
        {changingScope && 
        <Box sx={{mt: 1, height: sw ? '50px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeScopeSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeScopeSave(true, 'changeScope')}>Save</Button>
            </Box>
            {saveErrorNoticeShow && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        }
        {sw && 
        <SmallWidthModalWrapper
            ariaLabel={'show pokemon group'}
            ariaDescribe={'show and edit the pokemon scope of a group'}
            open={seePokemon}
            handleClose={() => setSeePokemon(!seePokemon)}
            buttonSx={{zIndex: 5}}
        >
            <Box sx={{...elementBg, width: '95%', height: '90%', mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '5%'}}>
                    <Typography sx={{mr: 3, width: '30%', textAlign: 'end', fontSize: '14px'}}>Group:</Typography>
                    <Typography sx={{width: '70%'}}>{pokemonGroups.filter(grp => grp.key === modalState.group)[0].display}</Typography>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '5%', mb: 1}}>
                    {hasSubGroups ? 
                        <>
                        <Typography sx={{mr: 3, width: '30%', textAlign: 'end', fontSize: '14px'}}>Sub-Group:</Typography>
                        <Typography sx={{width: '70%'}}>{activeSubGroups.filter(grp => babyAdultMonGroupActive ? grp.display.toLowerCase() === modalState.subGroup[groupInfo.group] : grp.key === modalState.subGroup[groupInfo.group])[0].display}</Typography>
                        </> : 
                        <Typography sx={{color: 'grey'}}><i>No Sub-Groups</i></Typography>
                    }
                    
                </Box>
                <Typography sx={{position: 'absolute', top: '1%', left: '5%', fontSize: '12px'}}>
                    Including {amountIncluded}
                </Typography>
                <Box sx={{height: '10%', width: (babyAdultMonGroupActive || interchangeableAltFormGroupActive) ? '100%' : '70%', mb: 1, display: 'flex', gap: babyAdultMonGroupActive ? 3 : 5, justifyContent: 'center'}}>
                    {generateButtons()}
                </Box>
                <PokemonGroupDisplay 
                    totalPokemon={totalPokemonInGroup} 
                    activePokemon={selectedPokemonInGroup}  
                    ballScope={ballScope}
                    isInterchangeableAltFormSelection={activeSubGroupKey === 'interchangeable'}
                    groupInfo={groupInfo}
                    handleChange={handleChange}
                    tyroguePresent={tyroguePresent}
                    sw={sw}
                    height='70%'
                />
            </Box>
            <Box sx={{...elementBg, width: '95%', height: '8%', mt: 1, ...theme.components.box.fullCenterRow}}>
                <Button onClick={() => setSeePokemon(!seePokemon)}><KeyboardBackspaceIcon/> Go Back</Button>
            </Box>
            
        </SmallWidthModalWrapper>
        }
        </>
    )
}