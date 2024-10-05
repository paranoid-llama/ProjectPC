import {Box} from '@mui/material'
import { useState } from 'react'
import Header from '../../../titlecomponents/subcomponents/header'
import CollectionTypeCard from './collectiontypecard'
import { collectionTypes, collectionSubTypes } from '../../../../../common/infoconstants/miscconstants.mjs'
import './collectiontypeselection.css'

export default function CollectionTypeSelection({handleChange, cssClass, userData, demo}) {
    const [subTypeSelection, setSubTypeSelection] = useState({screenOpen: Array.from(Array(collectionTypes.length), () => 'firstRender'), addHeight: 'firstRender'}) //whether subtype selection screen is open
    // const [addHeight, setAddHeight] = useState('firstRender')
    const heightClass = subTypeSelection.addHeight === true ? 'add-collection-creation-card-height' : subTypeSelection.addHeight === false ? 'shrink-collection-creation-card-height' : 'none'

    const slideClasses = subTypeSelection.screenOpen.map((screen) => screen === true ? 'sub-type-selection-slide-out' : screen === false ? 'sub-type-selection-slide-in' : 'none')

    const handleSubTypeSelection = (e, idx) => {
        if (subTypeSelection.screenOpen[idx] === 'firstRender') {
            if (!subTypeSelection.screenOpen.includes(true)) {
                const heightState = {addHeight: true}
                const newState = subTypeSelection.screenOpen.map((item, i) => i === idx ? true : item)
                setSubTypeSelection({screenOpen: newState, ...heightState})
            } else{
                const newState = subTypeSelection.screenOpen.map((item, i) => i === idx ? true : item)
                setSubTypeSelection({screenOpen: newState, addHeight: subTypeSelection.addHeight})
            }
        }
        else {
            if (subTypeSelection.screenOpen[idx] === false && !subTypeSelection.screenOpen.includes(true)) { //changing to true (add height)
                const heightState = {addHeight: true}
                const newState = subTypeSelection.screenOpen.map((item, i) => i === idx ? !item : item)
                setSubTypeSelection({screenOpen: newState, ...heightState})
            } else {
                if (subTypeSelection.screenOpen[idx] === true && !subTypeSelection.screenOpen.filter((i, id) => id !== idx).includes(true)) { //changing to false (shrink height)
                    const heightState = {addHeight: false}
                    const newState = subTypeSelection.screenOpen.map((item, i) => i === idx ? !item : item)
                    setSubTypeSelection({screenOpen: newState, ...heightState})
                } 
                else {
                    const newState = subTypeSelection.screenOpen.map((item, i) => i === idx ? !item : item)
                    setSubTypeSelection({screenOpen: newState, addHeight: subTypeSelection.addHeight})
                }
            }
        }
    }

    // const handleAddHeight = () => {
    //     if (addHeight === 'firstRender') {
    //         setAddHeight(true)
    //     }
    //     else {
    //         setAddHeight(!addHeight)
    //     }
    // }

    

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 2}} className={cssClass}>
            <Header additionalStyles={{color: 'black'}}>Select a Collection Type</Header>
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px'}}>
            {collectionTypes.map((type, idx) => {
                const subTypesArr = collectionSubTypes[type].display
                const subTypeValues = collectionSubTypes[type].value
                return (
                    <CollectionTypeCard 
                        key={`${type}-collection-type-card`}
                        collectionType={type}
                        idx={idx} 
                        subTypes={subTypesArr} 
                        subTypeValues={subTypeValues}
                        handleSubTypeScreen={handleSubTypeSelection} 
                        slideClass={(cssClass === 'creation-step-slide-left-exit' && subTypeSelection.screenOpen[idx] === true) ? 'transition-slide-in-subtype' : slideClasses[idx]} 
                        userData={userData}
                        handleChange={handleChange}
                        demo={demo}
                    />
                )
            })}
            </Box>
            <Box sx={{width: '100%'}} className={cssClass === 'creation-step-slide-left-exit' ? 'transition-shrink-card-height' : heightClass}></Box>
        </Box>
    )
}