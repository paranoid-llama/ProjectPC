import {Box, Modal, Fade, Backdrop, Typography, useTheme, CircularProgress} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { useState, useContext, useTransition } from 'react'
import {ErrorContext} from '../../../app/contexts/errorcontext.jsx'
import getUserCollectionData from '../../../../utils/functions/backendrequests/getusercollectiondata.js'
import hexToRgba from 'hex-to-rgba'
import ComparisonSelection from './comparisonselection'
import ComparisonDisplay from './comparisondisplay'
import startComparison from '../../../../utils/functions/comparecollections/componentfunction'
import SmallWidthModalWrapper from '../../partials/wrappers/smallwidthmodalwrapper.jsx'

export default function ComparisonMain({open, toggleModal, tradeableCollections, collectionData, userData, isTradePage=false, externalSelectedCol=undefined, externalChangeSelectedCol=undefined, externalComparisonData=undefined, extSetComparisonData=undefined, extSelectedColData=undefined, extCantChangeSelected=false, sw}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const [comparisonData, setComparisonData] = useState({screen: 'selection', selectedCol: tradeableCollections[0]._id, optionType: 'basic', options: {userList: {ha: true, em: false, onhand: false}, ownerList: {ha: true, em: false, onhand: false}}, advancedOptions: {equalizeBabyAdults: false, legendary: false, nonBreedable: false, evolvedRegional: false}, pendingTransition: false})
    // console.log(tradeableCollections)


    const trueSelectedCol = externalSelectedCol !== undefined ? externalSelectedCol : comparisonData.selectedCol
    const trueComparisonData = externalComparisonData !== undefined ? externalComparisonData : comparisonData.data

    const changeSelectedCol = (newId) => {
        if (externalChangeSelectedCol !== undefined) {
            externalChangeSelectedCol(newId)
        } else {
            setComparisonData({...comparisonData, selectedCol: newId})
        }
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
            compareData(trueSelectedCol, comparisonData.options, comparisonData.advancedOptions)
        } else {setComparisonData({...comparisonData, screen: newScreen})}
    }

    const compareData = async(selectedColId, opts, advOpts) => {
        const backendFunc = async() => await getUserCollectionData(selectedColId)
        const successFunc = (userCollectionData) => {
            const result = startComparison(userCollectionData, collectionData, opts, advOpts, extSelectedColData)
            setTimeout(() => {
                if (externalComparisonData !== undefined) {
                    extSetComparisonData(result)
                    setComparisonData({...comparisonData, screen: 'comparison', pendingTransition: false})
                } else {
                    setComparisonData({...comparisonData, screen: 'comparison', data: result, pendingTransition: false})
                }
            }, 1000)
        }
        handleError(backendFunc, false, successFunc, () => {})  
    }

    const selectedCollectionData = tradeableCollections.filter(col => col._id === trueSelectedCol)[0]
    const oneHomeCollection = trueSelectedCol !== '' && (selectedCollectionData.gen === 'home' || collectionData.gen === 'home')

    const modalScaling = (comparisonData.screen === 'selection') ? {height: '665px', width: '70%', maxWidth: '800px'} : {height: '80%', minHeight: '700px', width: '85%', maxWidth: '1000px'}

    const userCollectionDisplayType = isTradePage ? tradeableCollections.filter(col => col._id === trueComparisonData.comparedWith)[0] : selectedCollectionData

    const ModalWrapper = sw ? SmallWidthModalWrapper : Modal
    const modalProps = sw ? {
        ariaLabel: 'compare-collections', 
        ariaDescribe: "compare your collection to another user's collection of the same type",
        open,
        handleClose: toggleModal
    } : {
        'aria-labelledby': 'compare-collections', 
        'aria-describedby': "compare your collection to another user's collection of the same type", 
        open,
        onClose: toggleModal,
        closeAfterTransition: true,
        slots: {backdrop: Backdrop},
        slotProps: {
            backdrop: {
                timeout: 500
            }
        }
    }

    const renderContents = () => (
        (comparisonData.screen === 'selection') ?
            <ComparisonSelection 
                dataState={comparisonData} 
                externalSelectedCol={externalSelectedCol}
                extCantChangeSelected={extCantChangeSelected}
                changeCollection={changeSelectedCol} 
                changeOption={changeOption} 
                collectionOwnerUsername={collectionData.owner.username} 
                tradeableCollections={tradeableCollections} 
                oneHomeCollection={oneHomeCollection}
                changeScreen={changeScreen} 
                isPending={comparisonData.pendingTransition}
                optionType={comparisonData.optionType}
                changeOptionType={changeOptionType}
                sw={sw}
            /> : 
        // {true && 
        //     <Box sx={{...modalStyles.onhand.modalElementBg, height: '100%', width: '95%', ...theme.components.box.fullCenterCol}}>
        //         <Typography sx={{fontSize: '36px', mb: 5}}>Comparing Collections...</Typography>
        //         <CircularProgress />
        //     </Box>
        // } 
        (comparisonData.screen === 'comparison') && 
            <ComparisonDisplay 
                userCollectionDisplay={isNaN(parseInt(userCollectionDisplayType.gen)) ? userCollectionDisplayType.gen.toUpperCase() : `Gen ${userCollectionDisplayType.gen}`}
                ownerCollectionDisplay={isNaN(parseInt(collectionData.gen)) ? collectionData.gen.toUpperCase() : `Gen ${collectionData.gen}`}
                userColId={trueSelectedCol}
                ownerColId={collectionData._id}
                comparisonData={trueComparisonData} 
                ownerUsername={collectionData.owner.username} 
                oneHomeCollection={oneHomeCollection}
                goBackScreen={() => changeScreen('selection')}
                ownerTradeStatus={collectionData.options.tradePreferences.status}
                ownerTradesDisabled={collectionData.owner.settings.privacy.disabledTrades}
                ownerBlockedUsers={collectionData.owner.settings.privacy.blockedUsers}
                isTradePage={isTradePage}
                closeModal={toggleModal}
                userData={userData}
                sw={sw}
            />
    )

    const renderTotal = () => (
        <ModalWrapper {...modalProps}>
            {!sw ?
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, ...modalScaling, display: 'flex', alignItems: 'center'}}>
                    {renderContents()}
                </Box>
            </Fade> : 
            renderContents()
            }
        </ModalWrapper>
    )
    return (
        // <Modal
        //     aria-labelledby='compare-collections'
        //     aria-describedby="compare your collection to another user's collection of the same type"
        //     open={open}
        //     onClose={toggleModal}
        //     closeAfterTransition
        //     slots={{backdrop: Backdrop}}
        //     slotProps={{
        //         backdrop: {
        //             timeout: 500
        //         }
        //     }}
        // >
        //     <Fade in={open}>
        //         <Box sx={{...modalStyles.onhand.modalContainer, ...modalScaling, display: 'flex', alignItems: 'center'}}>
        //             {(comparisonData.screen === 'selection') && 
        //                 <ComparisonSelection 
        //                     dataState={comparisonData} 
        //                     externalSelectedCol={externalSelectedCol}
        //                     extCantChangeSelected={extCantChangeSelected}
        //                     changeCollection={changeSelectedCol} 
        //                     changeOption={changeOption} 
        //                     collectionOwnerUsername={collectionData.owner.username} 
        //                     tradeableCollections={tradeableCollections} 
        //                     oneHomeCollection={oneHomeCollection}
        //                     changeScreen={changeScreen} 
        //                     isPending={comparisonData.pendingTransition}
        //                     optionType={comparisonData.optionType}
        //                     changeOptionType={changeOptionType}
        //                 />
        //             }
        //             {/* {true && 
        //                 <Box sx={{...modalStyles.onhand.modalElementBg, height: '100%', width: '95%', ...theme.components.box.fullCenterCol}}>
        //                     <Typography sx={{fontSize: '36px', mb: 5}}>Comparing Collections...</Typography>
        //                     <CircularProgress />
        //                 </Box>
        //             } */}
        //             {(comparisonData.screen === 'comparison') && 
        //                 <ComparisonDisplay 
        //                     userCollectionDisplay={isNaN(parseInt(userCollectionDisplayType.gen)) ? userCollectionDisplayType.gen.toUpperCase() : `Gen ${userCollectionDisplayType.gen}`}
        //                     ownerCollectionDisplay={isNaN(parseInt(collectionData.gen)) ? collectionData.gen.toUpperCase() : `Gen ${collectionData.gen}`}
        //                     userColId={trueSelectedCol}
        //                     ownerColId={collectionData._id}
        //                     comparisonData={trueComparisonData} 
        //                     ownerUsername={collectionData.owner.username} 
        //                     oneHomeCollection={oneHomeCollection}
        //                     goBackScreen={() => changeScreen('selection')}
        //                     ownerTradeStatus={collectionData.options.tradePreferences.status}
        //                     ownerTradesDisabled={collectionData.owner.settings.privacy.disabledTrades}
        //                     ownerBlockedUsers={collectionData.owner.settings.privacy.blockedUsers}
        //                     isTradePage={isTradePage}
        //                     closeModal={toggleModal}
        //                     userData={userData}
        //                 />
        //             }
        //         </Box>
        //     </Fade>
        // </Modal>
        renderTotal()
    )
}