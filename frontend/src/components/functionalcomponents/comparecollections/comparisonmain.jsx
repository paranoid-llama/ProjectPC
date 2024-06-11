import {Box, Modal, Fade, Backdrop, Typography, useTheme, CircularProgress} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { useState, useTransition } from 'react'
import hexToRgba from 'hex-to-rgba'
import ComparisonSelection from './comparisonselection'
import ComparisonDisplay from './comparisondisplay'
import getUserCollectionData from '../../../../utils/functions/backendrequests/getusercollectiondata'
import { compareCollections } from '../../../../utils/functions/comparecollections/comparison'

export default function ComparisonMain({open, toggleModal, tradeableCollections, collectionData}) {
    const theme = useTheme()
    const [comparisonData, setComparisonData] = useState({screen: 'selection', selectedCol: tradeableCollections[0]._id, optionType: 'basic', options: {userList: {ha: true, em: false, onhand: false}, ownerList: {ha: true, em: false, onhand: false}}, advancedOptions: {equalizeBabyAdults: false, legendary: false, nonBreedable: false, evolvedRegional: false}, pendingTransition: false})
    // console.log(tradeableCollections)

    const changeSelectedCol = (newId) => {
        setComparisonData({...comparisonData, selectedCol: newId})
    }

    const changeOptionType = () => {
        setComparisonData({...comparisonData, optionType: comparisonData.optionType === 'basic' ? 'advanced' : 'basic'})
    }

    const changeOption = (listType, option) => {
        const newVal = listType === 'adv' ? !comparisonData.advancedOptions[option] : !comparisonData.options[listType][option]
        const stateChanges = listType === 'adv' ? {advancedOptions: {...comparisonData.advancedOptions, [option]: newVal}} : {options: {...comparisonData.options, [listType]: {...comparisonData.options[listType], [option]: newVal}}}
        setComparisonData({...comparisonData, ...stateChanges})
    } 

    const changeScreen = (newScreen) => {
        if (newScreen === 'comparison') {
            setComparisonData({...comparisonData, pendingTransition: true})
            startComparison(comparisonData.selectedCol, comparisonData.options, comparisonData.advancedOptions)
        } else {setComparisonData({...comparisonData, screen: newScreen})}
    }

    const startComparison = async(selectedColId, opts, advOpts) => {
        const fullUserCollectionData = await getUserCollectionData(selectedColId)
        const userEMInfo = fullUserCollectionData.eggMoveInfo === undefined ? {} : fullUserCollectionData.eggMoveInfo
        const ownerEMInfo = collectionData.eggMoveInfo === undefined ? {} : collectionData.eggMoveInfo
        const ignoreEMs = fullUserCollectionData.gen === 'home' || collectionData.gen === 'home'
        const comparisonResult = compareCollections(fullUserCollectionData, collectionData, opts, advOpts, userEMInfo, ownerEMInfo, ignoreEMs)
        setTimeout(() => {
            setComparisonData({...comparisonData, screen: 'comparison', data: comparisonResult, pendingTransition: false})
        }, 1000)
    }

    const selectedCollectionData = tradeableCollections.filter(col => col._id === comparisonData.selectedCol)[0]
    const oneHomeCollection = selectedCollectionData.gen === 'home' || collectionData.gen === 'home'

    const modalScaling = (comparisonData.screen === 'selection') ? {height: '665px', width: '70%', maxWidth: '800px'} : {height: '80%', minHeight: '700px', width: '85%', maxWidth: '1000px'}

    return (
        <Modal
            aria-labelledby='compare-collections'
            aria-describedby="compare your collection to another user's collection of the same type"
            open={open}
            onClose={toggleModal}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, ...modalScaling, display: 'flex', alignItems: 'center'}}>
                    {(comparisonData.screen === 'selection') && 
                        <ComparisonSelection 
                            dataState={comparisonData} 
                            changeCollection={changeSelectedCol} 
                            changeOption={changeOption} 
                            collectionOwnerUsername={collectionData.owner.username} 
                            tradeableCollections={tradeableCollections} 
                            collectionGen={collectionData.gen} 
                            userCollectionGen={selectedCollectionData.gen} 
                            changeScreen={changeScreen} 
                            isPending={comparisonData.pendingTransition}
                            optionType={comparisonData.optionType}
                            changeOptionType={changeOptionType}
                        />
                    }
                    {/* {true && 
                        <Box sx={{...modalStyles.onhand.modalElementBg, height: '100%', width: '95%', ...theme.components.box.fullCenterCol}}>
                            <Typography sx={{fontSize: '36px', mb: 5}}>Comparing Collections...</Typography>
                            <CircularProgress />
                        </Box>
                    } */}
                    {(comparisonData.screen === 'comparison') && 
                        <ComparisonDisplay 
                            userCollectionDisplay={isNaN(parseInt(selectedCollectionData.gen)) ? selectedCollectionData.gen.toUpperCase() : `Gen ${selectedCollectionData.gen}`}
                            ownerCollectionDisplay={isNaN(parseInt(collectionData.gen)) ? collectionData.gen.toUpperCase() : `Gen ${collectionData.gen}`}
                            comparisonData={comparisonData.data} 
                            ownerUsername={collectionData.owner.username} 
                            oneHomeCollection={oneHomeCollection}
                            goBackScreen={() => changeScreen('selection')}
                            ownerTradeStatus={collectionData.options.tradePreferences.status}
                        />
                    }
                </Box>
            </Fade>
        </Modal>
    )
}