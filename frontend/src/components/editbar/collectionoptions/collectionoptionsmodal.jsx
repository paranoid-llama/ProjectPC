import {Box, Typography, Modal, Fade, Backdrop} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { useSelector, useDispatch } from 'react-redux'
import { changeModalState } from '../../../app/slices/editmode'
import OptionsMain from './optionsmain'
import OptionsSub from './optionssub'
import PokemonScope from './scopeoptions/pokemonscope'
import BallScope from './scopeoptions/ballscope'
import BallCombosScope from './scopeoptions/ballcombosscope'
import CollectionSortingOptions from './sortingoptions/collectionsortingoptions'
import OnHandSortingOptions from './sortingoptions/onhandsortingoptions'
import CustomSortingOptions from './sortingoptions/customsortingoptions'
import TradePreferenceOptions from './preferenceoptions/tradepreferenceoptions'
import RateOptions from './preferenceoptions/rateoptions'
import ItemOptions from './preferenceoptions/itemoptions'
import OtherOptions from './otheroptions'

export default function CollectionOptionsModal({collectionGen, collectionId}) {
    const dispatch = useDispatch()
    const modalState = useSelector((state) => state.editmode.collectionOptionsModal)
    const elementBg = modalStyles.onhand.modalElementBg
    const isOptionsSubScreen = modalState.screen === 'changeScope' || modalState.screen === 'sorting' || modalState.screen === 'tradePreferences'
    const modalHeight = (
        modalState.screen === 'main' || 
        isOptionsSubScreen || 
        modalState.screen === 'ballScope' || 
        modalState.screen === 'collectionSort' || 
        modalState.screen === 'preferences' || 
        modalState.screen === 'other') ? 
            '450px' : 
        modalState.screen === 'pokemonScope' ? '730px' : '700px'
    const makeChangesScreens = modalState.screen === 'pokemonScope' || modalState.screen === 'ballScope' || modalState.screen === 'excludedCombos' ||
        modalState.screen === 'collectionSort' || modalState.screen === 'onhandSort' || modalState.screen === 'customSort' || modalState.screen === 'preferences'

    const collectionTypeText = typeof collectionGen === 'string' ? `${collectionGen.toUpperCase()} Aprimon Collection` : `Gen ${collectionGen} Aprimon Collection`

    return (
        <Modal 
            aria-labelledby='collection-options'
            aria-describedby="change collection options"
            open={modalState.open}
            onClose={makeChangesScreens ? null : () => dispatch(changeModalState({open: false}))}
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
                <Box sx={{...modalStyles.onhand.modalContainer, height: modalHeight, width: '70%', minWidth: '575px', maxWidth: '850px', display: 'flex', alignItems: 'center'}}>
                    {modalState.screen === 'main' && <OptionsMain elementBg={elementBg}/>}
                    {isOptionsSubScreen && <OptionsSub elementBg={elementBg} screenType={modalState.screen} collectionGen={collectionGen}/>}
                    {modalState.screen === 'pokemonScope' && <PokemonScope elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'ballScope' && <BallScope elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'excludedCombos' && <BallCombosScope elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'collectionSort' && <CollectionSortingOptions elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'onhandSort' && <OnHandSortingOptions elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'customSort' && <CustomSortingOptions elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'preferences' && <TradePreferenceOptions elementBg={elementBg} collectionId={collectionId}/>}
                    {modalState.screen === 'rates' && <RateOptions elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'items' && <ItemOptions elementBg={elementBg} collectionGen={collectionGen} collectionId={collectionId}/>}
                    {modalState.screen === 'other' && <OtherOptions elementBg={elementBg} collectionId={collectionId} collectionType={collectionTypeText}/>}
               </Box>
            </Fade>
        </Modal>
    )
}