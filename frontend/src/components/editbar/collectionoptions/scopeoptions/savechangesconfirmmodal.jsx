import {Modal, Backdrop, Fade, Typography, Box, Button, CircularProgress} from '@mui/material'
import modalStyles from '../../../../../utils/styles/componentstyles/modalstyles'
import PokemonScopeSave from './savechangesconfirmbodies/pokemonscopesave'
import BallScopeSave from './savechangesconfirmbodies/ballscopesave'

export default function SaveChangesConfirmModal({open, modalScreen, saveButtonSelected, nextScreen, pokemonScopeData={}, ballScopeData={}, handleChange, closeModal, saving}) {

    const screenType = modalScreen === 'pokemonScope' ? 'pokemon scope' : modalScreen === 'ballScope' ? 'ball scope' : modalScreen === 'excludedCombos' && 'excluded ball combos'
    const {addedPokemon, removedPokemon, collectionAutoSort, collectionSortOrder} = pokemonScopeData
    const {addedBalls, removedBalls, newBallScope, fullBalls, removedPokemonBallScope} = ballScopeData

    return (
        <Modal 
            aria-labelledby={`confirm ${screenType} changes`}
            aria-describedby={`confirm the changes made to your collection's ${screenType} scope`}
            open={open}
            onClose={closeModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
             <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: modalScreen === 'ballScope' ? '700px' : '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '95%', display: 'flex', alignItems: 'center', flexDirection: 'column', mb: 1}}>
                        <Typography variant='h4' sx={{color: 'white', mt: 1, fontWeight: 700}}>{saveButtonSelected ? 'Confirm Changes' : 'Unsaved Changes'}</Typography>
                        <Box sx={{width: '100%', height: '10%', justifyContent: 'center', display: 'flex'}}>
                            <Typography sx={{color: 'white', mt: 3, fontSize: '16px'}}>
                                {saveButtonSelected ? 
                                    'Would you like to confirm these changes?' :
                                    'You have some unsaved changes. Would you like to confirm them?'
                                }
                            </Typography>
                        </Box>
                        {modalScreen === 'pokemonScope' && <PokemonScopeSave addedPokemon={addedPokemon} removedPokemon={removedPokemon} collectionAutoSort={collectionAutoSort} collectionSortOrder={collectionSortOrder}/>}
                        {modalScreen === 'ballScope' && <BallScopeSave addedBalls={addedBalls} removedBalls={removedBalls} newBallScope={newBallScope} fullBalls={fullBalls} removedPokemon={removedPokemonBallScope}/>}
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 1}}>
                        <Box sx={{width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button size='medium' variant='contained' onClick={() => handleChange(true, 'changeScope')} disabled={saving}>
                                {saving ? <CircularProgress />: 'Save'}
                            </Button>
                        </Box>
                        <Box sx={{width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button size='medium' variant='contained' onClick={() => handleChange(false, 'goBack')} disabled={saving}>Go Back</Button>
                        </Box>
                        <Box sx={{width: '40%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 5}}>
                            <Button size='medium' variant='contained' onClick={() => handleChange(false, nextScreen)} disabled={saving}>Exit Without Saving</Button>
                        </Box>
                    </Box>
                </Box>
             </Fade>
        </Modal>
    )
}