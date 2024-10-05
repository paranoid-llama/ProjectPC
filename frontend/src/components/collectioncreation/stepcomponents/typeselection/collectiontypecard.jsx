import {Box, Typography, Button, Card, CardMedia, CardContent, CardActionArea} from '@mui/material'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import { collectionDescription } from '../../../../../common/infoconstants/miscconstants.mjs'
import { useState } from 'react'
import './collectiontypeselection.css'

export default function CollectionTypeCard({collectionType, idx, subTypes, subTypeValues, handleSubTypeScreen, slideClass, userData, handleChange, demo}) {
    
    const displayName = collectionType === 'living dex' ? 'Living Dex' : capitalizeFirstLetter(collectionType)
    const description = collectionDescription[idx]
    const alternateText = collectionType === 'aprimon' ? 'Apriballs in a circle' : collectionType === 'living dex' && 'A lot of pokemon'

    return (
        <Card sx={{
            maxWidth: 400, 
            marginTop: '30px', 
            position: 'relative', 
            overflow: 'visible', 
            zIndex: 100, 
            boxShadow: '3px 3px 20px 0px rgba(0,0,0,0.14)'
            }}
        >
            <CardActionArea onClick={(e) => handleSubTypeScreen(e, idx)}>
                <CardMedia
                    sx={{backgroundColor: '#283f57'}}
                    component='img'
                    height='300'
                    image={`https://res.cloudinary.com/duaf1qylo/image/upload/v1709852343/cards/${collectionType}_card.png`} 
                    alt={alternateText}
                />
                <CardContent sx={{backgroundColor: '#26BCC9'}}>
                    <Typography gutterBottom variant='h5' component='div' sx={{fontWeight: 700}}>
                        {displayName}
                    </Typography>
                    <Typography variant='body2' >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <Box 
                className={slideClass} 
                sx={{
                    position: 'absolute', 
                    zIndex: -1, 
                    width: '100%', 
                    height: '300px', 
                    top: '0px', 
                    backgroundColor: '#706d6b', 
                    borderBottomLeftRadius: '10px', 
                    borderBottomRightRadius: '10px', 
                    borderTop: '1px solid black', 
                    boxShadow: '3px 3px 20px 0px rgba(0,0,0,0.14)',
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box sx={{width: '80%', height: '10%'}}>
                    <Typography sx={{fontSize: '20px'}}>Select Sub-Type</Typography>
                </Box>
                {subTypes.map((subType, idx) => {
                    const evenIdx = idx % 2 === 0
                    const backgroundColor = evenIdx ? '#94918f' : '#545250'
                    const color = evenIdx ? 'black' : 'white'
                    const height = `${85/subTypes.length}%`
                    const adjustedSubType = subType.includes('Gen') ? subType.slice(4, subType.length) : subType.includes('/') ? subType.replace('/', '').toLowerCase() : subType.toLowerCase()
                    const disabledSelection = !demo && userData.collections.filter(col => col.gen === adjustedSubType).length !== 0
                    return (
                        <Box sx={{width: '100%', backgroundColor, height, maxHeight: '50px', display: 'flex', alignItems: 'center'}} key={`${collectionType}-subtype-${subType}-selection`}>
                            <Button 
                                sx={{width: '100%', height: '100%', color}}
                                disabled={disabledSelection}
                                onClick={(e) => handleChange(e, collectionType, subType, subTypeValues[idx])}
                            >
                                {subType}
                            </Button>
                        </Box>
                    )
                })}
                <Box sx={{width: '100%', height: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button sx={{height: '100%', width: '100%', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'}} onClick={(e) => handleSubTypeScreen(e, idx)}>    
                        <ImgData type='gender' linkKey='arrowup' size='12px'/>
                    </Button>
                </Box>
            </Box>
        </Card>
    )
}
