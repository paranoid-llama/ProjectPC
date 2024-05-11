import {Modal, Backdrop, Fade, Typography, Box, Button, CircularProgress} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import PokemonScopeSave from './scopeoptions/savechangesconfirmbodies/pokemonscopesave'
import BallScopeSave from './scopeoptions/savechangesconfirmbodies/ballscopesave'
import ExcludedComboSave from './scopeoptions/savechangesconfirmbodies/excludedcombossave'

export default function SaveChangesConfirmModal({open, modalScreen, saveButtonSelected, nextScreen, pokemonScopeData={}, ballScopeData={}, excludedCombosData={}, sortingOptionData={}, handleChange, closeModal, saving}) {

    //below variable is just used for the aria label
    const screenType = modalScreen === 'pokemonScope' ? 'pokemon scope' : 
        modalScreen === 'ballScope' ? 'ball scope' : 
        modalScreen === 'excludedCombos' ? 'excluded ball combos' : 
        modalScreen === 'collectionSort' ? 'collection auto-sort options' :
        modalScreen === 'onhandSort' ? 'on-hand auto-sort options' : 
        modalScreen === 'customSort' ? 'custom sort options' :
        modalScreen === 'preferences' ? 'trade preferences' : 
        modalScreen === 'rates' ? 'trade rates' : 
        modalScreen === 'items' ? 'item trading options' : 
        modalScreen === 'other' && 'other options'

    const noChangesSection = modalScreen === 'collectionSort' ||
        modalScreen === 'onhandSort' || modalScreen === 'customSort' || 
        modalScreen === 'preferences' || modalScreen === 'rates' || modalScreen === 'items' || modalScreen === 'other'
    const {addedPokemon, removedPokemon, collectionAutoSort, collectionSortOrder} = pokemonScopeData
    const {addedBalls, removedBalls, newBallScope, fullBalls, removedPokemonBallScope} = ballScopeData
    const {addedPokemonCombos, removedPokemonCombos, ballChanges} = excludedCombosData
    const {reSortWillHappen} = sortingOptionData

    return (
        <Modal 
            aria-labelledby={`confirm ${screenType} changes`}
            aria-describedby={`confirm the changes made to your collection's ${screenType}`}
            open={open}
            onClose={saving ? null : closeModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
             <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: modalScreen === 'ballScope' ? '700px' : noChangesSection ? '300px' : '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: noChangesSection ? '80%' : '95%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: noChangesSection ? 'center' : 'start', mb: 1}}>
                        <Typography variant='h4' sx={{color: 'white', mt: 1, fontWeight: 700}}>{saveButtonSelected ? 'Confirm Changes' : 'Unsaved Changes'}</Typography>
                        <Box sx={{width: '100%', height: noChangesSection ? '30%' : '10%', justifyContent: 'center', display: 'flex'}}>
                            <Typography sx={{color: 'white', mt: 3, fontSize: '16px'}}>
                                {saveButtonSelected ? 
                                    `Would you like to confirm ${noChangesSection ? 'your' : 'these'} changes?` :
                                    'You have some unsaved changes. Would you like to confirm them?'
                                }
                            </Typography>
                        </Box>
                        {modalScreen === 'pokemonScope' && <PokemonScopeSave addedPokemon={addedPokemon} removedPokemon={removedPokemon} collectionAutoSort={collectionAutoSort} collectionSortOrder={collectionSortOrder}/>}
                        {modalScreen === 'ballScope' && <BallScopeSave addedBalls={addedBalls} removedBalls={removedBalls} newBallScope={newBallScope} fullBalls={fullBalls} removedPokemon={removedPokemonBallScope}/>}
                        {modalScreen === 'excludedCombos' && <ExcludedComboSave addedPokemon={addedPokemonCombos} removedPokemon={removedPokemonCombos} ballChanges={ballChanges}/>}
                        {reSortWillHappen === true && <Typography>The list will immediately auto-sort to the chosen settings!</Typography>}
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: noChangesSection ? '15%' : '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 1}}>
                        <Box sx={{width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button 
                                size='medium' 
                                variant='contained' 
                                onClick={() => handleChange(true, 'changeScope')} 
                                sx={{pointerEvents: saving ? 'none' : 'auto', opacity: saving ? 0.5 : 1}}
                            >
                                {saving ? <CircularProgress sx={{color: '#1e2f41'}} size={24}/>: 'Save'}
                            </Button>
                        </Box>
                        <Box sx={{width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button 
                                size='medium' 
                                variant='contained' 
                                onClick={() => handleChange(false, 'goBack')} 
                                sx={{pointerEvents: saving ? 'none' : 'auto', opacity: saving ? 0.5 : 1}}
                            >
                                Go Back
                            </Button>
                        </Box>
                        <Box sx={{width: '40%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 5}}>
                            <Button 
                                size='medium' 
                                variant='contained'
                                onClick={() => handleChange(false, nextScreen)} 
                                sx={{pointerEvents: saving ? 'none' : 'auto', opacity: saving ? 0.5 : 1}}
                            >
                                Exit Without Saving
                            </Button>
                        </Box>
                    </Box>
                </Box>
             </Fade>
        </Modal>
    )
}