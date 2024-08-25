import {Box, Typography, Modal, Fade, Backdrop, Button, Tooltip, Grid, ToggleButton} from '@mui/material'
import { useState, useEffect } from 'react'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import Header from '../../../../titlecomponents/subcomponents/header'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ListSearch from '../../../../functionalcomponents/listsearch'
import Selection from '../../../../collectiontable/selection'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import {useDebouncedCallback} from 'use-debounce'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import PokemonBallCombosModalContents from './pokemonballcombosmodalcontents'
import './pokemonballcombosmodal.css'

export default function PokemonBallCombosModal({isOpen, totalList, selectedMon, ballComboData, formData, ballScope, allPossibleBalls, toggleModal, changePokemonSelection, handleChange}) {

    return (
        <Modal
            aria-labelledby='select-pokemon-ball-combos'
            aria-describedby='exclude specific unwanted pokemon/ball combinations'
            open={isOpen}
            onClose={toggleModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={isOpen}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <PokemonBallCombosModalContents 
                        elementBg={modalStyles.onhand.modalElementBg}
                        selectedMon={selectedMon}
                        totalList={totalList}
                        ballComboData={ballComboData}
                        pokemonScopeData={formData}
                        ballScope={ballScope}
                        changePokemonSelection={changePokemonSelection}
                        allPossibleBalls={allPossibleBalls}
                        handleChange={handleChange}
                    />
                </Box>
            </Fade>
        </Modal>
    )
}