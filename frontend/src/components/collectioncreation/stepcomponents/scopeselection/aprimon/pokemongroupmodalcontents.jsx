import {Typography, Box, Tabs, Tab, Button} from '@mui/material'
import PokemonGroupDisplay from './pokemongroupdisplay'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { getScopePeripheralInfo } from '../../../../../../utils/functions/scope/getperipheralinfo'
import { pokemonGroups } from '../../../../../../../common/infoconstants/pokemonconstants.mjs'

export default function PokemonGroupModalContents({elementBg, modalState, groupKeys, ballScope, changeGroup, changeSubGroup, handleChange, handleMassChange, scopePeripheryInfo, tyroguePresent, changingScope=false, changeScopeSave={}, saveErrorNoticeShow=false}) {

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



    return (
        <>
        {changingScope && 
        <Box sx={{...elementBg, width: '95%', height: '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeScopeSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeScopeSave(false, 'changeScope')}>Change Scope</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Pokemon Scope</Typography>
        </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: hasSubGroups ? '25%' : '35%'}}>
            <Tabs sx={{color: 'white', }} onChange={(e, value) => changeGroup(e, value)} value={modalState.group}>
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
            <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: 2}}>{pokemonGroups.filter(grp => grp.key === modalState.group)[0].display}</Typography>
            <Typography align='center' sx={{paddingTop: '10px', fontSize: '16px', fontWeight: 400, mb: 3}}>{pokemonGroups.filter(grp => grp.key === modalState.group)[0].desc}</Typography>
        </Box>
        {hasSubGroups && 
            <Box sx={{...elementBg, width: '95%', height: '8%', mt: 1, display: 'flex', justifyContent: 'center'}}>
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
        
        <Box sx={{...elementBg, width: '95%', height: hasSubGroups ? '65%' : '75%', mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
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
            />
        </Box>
        {changingScope && 
        <Box sx={{mt: 1, height: '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeScopeSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeScopeSave(true, 'changeScope')}>Save</Button>
            </Box>
            {saveErrorNoticeShow && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        }
        </>
    )
}