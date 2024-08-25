import {Grid, styled, Paper, Typography, Modal, Backdrop, Fade, Box, Tabs, Tab, Button} from '@mui/material'
import { useState } from 'react'
import { pokemonGroups, pokemonSubGroups } from '../../../../../../common/infoconstants/pokemonconstants.mjs'
// import PokemonGroupDisplay from './pokemongroupdisplay'
import PokemonGroupModalContents from './pokemongroupmodalcontents'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import { getScopePeripheralInfo } from '../../../../../../utils/functions/scope/getperipheralinfo'
// import PokemonGroupCard from './pokemongroupcard'

export default function PokemonGroupCardArea({typeTotalMons, formData, ballScope, groupKeys, handleChange, handleMassChange, tyroguePresent}) {
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

    const scopePeripheryInfo = getScopePeripheralInfo(modalState, groupKeys, formData, typeTotalMons)

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

    

    return (
        <>
        <Grid container spacing={gridSpecs.spacing} sx={{display: 'flex', justifyContent: 'center'}}>
            {groupKeys.map((gK, idx) => {
                const gridNum = idx+1
                const groupInfo = pokemonGroups.filter((group) => group.key === gK)[0]
                const totalMonsGroupLength = gK === 'alternateForms' ? Object.values(typeTotalMons[gK]).flat().filter(mon => mon.name.includes('(')).length : Object.values(typeTotalMons[gK]).flat().length
                const formDataGroupLength = gK === 'alternateForms' ? Object.values(formData[gK]).flat().filter(mon => mon.name.includes('(')).length : Object.values(formData[gK]).flat().length
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
                    <PokemonGroupModalContents 
                        elementBg={modalStyles.onhand.modalElementBg}
                        modalState={modalState}
                        groupKeys={groupKeys}
                        ballScope={ballScope}
                        changeGroup={changeGroup} 
                        changeSubGroup={changeSubGroup}
                        scopePeripheryInfo={scopePeripheryInfo}
                        handleChange={handleChange} 
                        handleMassChange={handleMassChange} 
                        tyroguePresent={tyroguePresent}
                    />
                </Box>
            </Fade>
        </Modal>
        </>
    )
}