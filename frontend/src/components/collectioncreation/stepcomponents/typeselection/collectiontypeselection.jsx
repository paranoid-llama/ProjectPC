import {Box, Typography, Button, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, CardActionArea} from '@mui/material'
import { useState } from 'react'
import Header from '../../../titlecomponents/subcomponents/header'
import CollectionTypeCard from './collectiontypecard'
import { collectionTypes, collectionSubTypes } from '../../../../infoconstants'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import TextSpaceDouble from '../../../titlecomponents/subcomponents/textspacedouble'
import './collectiontypeselection.css'

export default function CollectionTypeSelection({collectionType}) {
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

    const defaultType = collectionType === undefined && 'aprimon' //this is just to make the key for subtype rendering make sense. delete this when you have mo

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Header additionalStyles={{color: 'black', marginTop: 2}}>Select a Collection Type</Header>
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px'}}>
            {collectionTypes.map((type, idx) => {
                const subTypesArr = collectionSubTypes[type]
                return (
                    <CollectionTypeCard 
                        key={`${type}-collection-type-card`}
                        collectionType={type} idx={idx} 
                        subTypes={subTypesArr} 
                        handleSubTypeScreen={handleSubTypeSelection} 
                        slideClass={slideClasses[idx]} 
                    />
                )
            })}
            </Box>
            <Box sx={{width: '100%'}} className={heightClass}></Box>
        </Box>
    )
}