import {Box, Typography, Modal, Fade, Backdrop} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalState } from '../../../app/slices/editmode'
import OptionsMain from './optionsmain'
import OptionsSub from './optionssub'
import PokemonScope from './scopeoptions/pokemonscope'
import BallScope from './scopeoptions/ballscope'

export default function CollectionOptionsModal({collectionGen, collectionId}) {
    const dispatch = useDispatch()
    const modalState = useSelector((state) => state.editmode.collectionOptionsModal)
    const elementBg = modalStyles.onhand.modalElementBg
    const isOptionsSubScreen = modalState.screen === 'changeScope' || modalState.screen === 'sorting' || modalState.screen === 'tradePreferences'
    const modalHeight = (modalState.screen === 'main' || isOptionsSubScreen || modalState.screen === 'ballScope') ? '450px' : modalState.screen === 'pokemonScope' ? '730px' : '700px'

    return (
        <Modal 
            aria-labelledby='collection-options'
            aria-describedby="change collection options"
            open={modalState.open}
            onClose={modalState.screen === 'pokemonScope' ? null : () => dispatch(changeModalState({open: false}))}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={modalState.open}>
                {/* height is normally 665px in scope selection */}
                <Box sx={{...modalStyles.onhand.modalContainer, height: modalHeight, width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    {modalState.screen === 'main' && <OptionsMain elementBg={elementBg}/>}
                    {isOptionsSubScreen && <OptionsSub elementBg={elementBg} screenType={modalState.screen} collectionGen={collectionGen}/>}
                    {modalState.screen === 'pokemonScope' && <PokemonScope elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'ballScope' && <BallScope elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                </Box>
            </Fade>
        </Modal>
    )
}