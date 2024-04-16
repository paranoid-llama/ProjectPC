import {Grid, styled, Paper, Typography, Modal, Backdrop, Fade, Box, Tabs, Tab, Button} from '@mui/material'
import { useState } from 'react'
import { pokemonGroups, pokemonSubGroups } from '../../../../../infoconstants'
import PokemonGroupDisplay from './pokemongroupdisplay'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
// import PokemonGroupCard from './pokemongroupcard'

export default function PokemonGroupCardArea({typeTotalMons, formData, ballScope, groupKeys, handleChange, handleMassChange}) {
    //only 6 possible groups (with their own sub groups) available.
    const groupKeysWithSubGroups = groupKeys.filter((groupKey) => !Array.isArray(typeTotalMons[groupKey]))
    const subGroupModalInit = {subGroup: {}}

    for (let gK of groupKeysWithSubGroups) {
        if (gK === 'babyAdultMons') {
            subGroupModalInit.subGroup[gK] = 'regular'
        } else {
            subGroupModalInit.subGroup[gK] = Object.keys(typeTotalMons[gK])[0]
        }
    }
    const [modalState, setModalState] = useState({open: false, group: groupKeys[0], ...subGroupModalInit})

    const toggleModal = () => {
        setModalState({...modalState, open: !modalState.open})
    }

    const changeGroup = (e, groupKey) => {
        setModalState({...modalState, group: groupKey})
    }

    const changeSubGroup = (e, subGroupKey) => {
        setModalState({...modalState, subGroup: {...modalState.subGroup, [modalState.group]: subGroupKey}})
    }

    const openGroupModal = (e, groupKey) => {
        setModalState({...modalState, open: true, group: groupKey})
    }

    const groupTotal = groupKeys.length
    const gridSpecs = {}
    const activeGroup = modalState.group
    const activeSubGroupKey = modalState.subGroup[activeGroup]
    const hasSubGroups = groupKeysWithSubGroups.includes(modalState.group)
    const groupInfo = {group: modalState.group, subGroup: modalState.subGroup[modalState.group]}
    
    const babyAdultMonGroupActive = activeGroup === 'babyAdultMons'
    const interchangeableAltFormGroupActive = activeGroup === 'alternateForms' && activeSubGroupKey === 'interchangeable'

    // console.log(typeTotalMons)
    // console.log(formData)
    // console.log(activeGroup)
    // console.log(activeSubGroupKey)
    
    const groupLabels = groupKeys.map(grpKey => pokemonGroups.filter(grp => grp.key === grpKey)[0].display)
    const activeSubGroups = hasSubGroups && pokemonSubGroups[activeGroup].filter(subGroup => Object.keys(typeTotalMons[activeGroup]).includes(subGroup.key) || Object.keys(typeTotalMons[activeGroup]).map(sGK => subGroup.key.includes(sGK)).includes(true))
    const activeSubGroup = hasSubGroups && activeSubGroups.filter((sG) => babyAdultMonGroupActive ? sG.display.toLowerCase() === activeSubGroupKey : sG.key === activeSubGroupKey)[0]
    
    const totalPokemonInGroup = hasSubGroups ?
        (babyAdultMonGroupActive) ? {babies: typeTotalMons.babyAdultMons[`${activeSubGroupKey}Babies`], adults: typeTotalMons.babyAdultMons[`${activeSubGroupKey}Adults`]} : 
        typeTotalMons[activeGroup][activeSubGroupKey] : typeTotalMons[activeGroup]

    const selectedPokemonInGroup = hasSubGroups ? 
        (babyAdultMonGroupActive) ? {babies: formData.babyAdultMons[`${activeSubGroupKey}Babies`], adults: formData.babyAdultMons[`${activeSubGroupKey}Adults`]} : 
        formData[activeGroup][activeSubGroupKey] : formData[activeGroup]

    const totalMonsActiveSubGroupLength = Object.values(totalPokemonInGroup).flat().length
    const formDataActiveSubGroupLength = Object.values(selectedPokemonInGroup).flat().length

    const amountIncluded = totalMonsActiveSubGroupLength === formDataActiveSubGroupLength || 
        (interchangeableAltFormGroupActive && (
            typeTotalMons.alternateForms.interchangeable.filter(mon => mon.imgLink.includes('-')).length === formData.alternateForms.interchangeable.filter(imgLink => imgLink.includes('-')).length)) ? 'All' :
        formDataActiveSubGroupLength === 0 ? 'None' : 'Some'

    // const activeSubGroupLabels = (hasSubGroups && !babyAdultMonGroupActive) ? 
    //     pokemonSubGroups[activeGroup].filter(subGroup => Object.keys(typeTotalMons[activeGroup]).includes(subGroup.key)).map(subGroup => subGroup.display) : 
    //     hasSubGroups && ['Regular', 'Incense']

    // const subGroupDesc = hasSubGroups && pokemonSubGroups[activeGroup].filter((subGroup) => subGroup.key === modalState.subGroup[activeGroup] || (activeGroup === 'babyAdultMons' && subGroup.key.includes(modalState.subGroup[activeGroup])))[0].desc
    
    // console.log(groupKeysWithSubGroups)
    // console.log(activeGroup)
    // console.log(activeSubGroups)

    // console.log(activeSubGroups)
    // console.log(activeSubGroupLabels)

    const Item = styled(Paper)(() => ({
        backgroundColor:'#222222',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '8px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
      }));
      
    const getGridConfig = () => {
        if (groupKeys.length === 4) {
            gridSpecs.spacing = 1
        } else {
            gridSpecs.spacing = 2
        }
        groupKeys.forEach((gK, idx) => {
            const gridNum = idx+1
            const gridKey = `grid${gridNum}`
            if (groupTotal !== 4) {
                gridSpecs[gridKey] = 4
            } if (groupTotal === 4) {
                gridSpecs[gridKey] = 3
            } 
            // if (groupTotal === 5) {
            //     if (gridNum > 3) {
            //         gridSpecs[gridKey] = 
            //     }
            // }
        })
    }
    getGridConfig()

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
        <Grid container spacing={gridSpecs.spacing} sx={{display: 'flex', justifyContent: 'center'}}>
            {groupKeys.map((gK, idx) => {
                const gridNum = idx+1
                const groupInfo = pokemonGroups.filter((group) => group.key === gK)[0]
                const totalMonsGroupLength = Object.values(typeTotalMons[gK]).flat().length
                const formDataGroupLength = Object.values(formData[gK]).flat().length
                const amount = totalMonsGroupLength === formDataGroupLength ? 'All' :
                    formDataGroupLength === 0 ? 'None' : 'Some'
                return (
                    <Grid key={`${gK}-group-button`} item xs={gridSpecs[gridNum]}>
                        <Button sx={{padding: 0, margin: 0, textTransform: 'none'}} onClick={(e) => openGroupModal(e, gK)}>
                            <Item>
                                <Typography>{groupInfo.display}</Typography>
                                <Typography sx={{fontSize: '11px'}}>Including {amount}</Typography>
                            </Item>
                        </Button>
                    </Grid>
                )
            })}
        </Grid>
        <Modal
            aria-labelledby='pokemon-groups-info'
            aria-describedby='check the details of pokemon groups'
            open={modalState.open}
            onClose={() => toggleModal()}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={modalState.open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: hasSubGroups ? '25%' : '35%'}}>
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
                        <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '8%', mt: 1, display: 'flex', justifyContent: 'center'}}>
                            <Tabs sx={{width: '90%'}} onChange={(e, value) => changeSubGroup(e, value)} value={modalState.subGroup[activeGroup]}>
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
                    
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: hasSubGroups ? '65%' : '75%', mt: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
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
                        />
                    </Box>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}