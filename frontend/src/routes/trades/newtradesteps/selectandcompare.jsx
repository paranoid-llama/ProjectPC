import {Box, Typography, useTheme, Select, MenuItem, Button, Tooltip} from '@mui/material'
import ComparisonMain from '../../../components/functionalcomponents/comparecollections/comparisonmain'
import hexToRgba from 'hex-to-rgba'
import { useState } from 'react'

export default function SelectAndCompare({selectedCol, userCollections, ownerCollection, comparisonData, changeSelectedCol, setComparisonData, selectedColData, isCounteroffer, previousOfferData}) {
    const theme = useTheme()
    const [modalState, setModalState] = useState(false)
    const toggleModalState = () => {
        setModalState(!modalState)
    }
    const noComparisonData = Object.keys(comparisonData).length === 0
    const aprimonCounts = !noComparisonData && {
        canOfferAprimon: comparisonData.canOffer.map(p => p.balls.filter(ballData => ballData.onhandId === undefined)).flat(),
        canOfferAprimonOnhand: comparisonData.canOffer.map(p => p.balls.filter(ballData => ballData.onhandId !== undefined)).flat(),
        canReceiveAprimon: comparisonData.canReceive.map(p => p.balls.filter(ballData => ballData.onhandId === undefined)).flat(),
        canReceiveAprimonOnhand: comparisonData.canReceive.map(p => p.balls.filter(ballData => ballData.onhandId !== undefined)).flat()
    }

    const styledSelect = {
        '&.MuiInputBase-root': {
            width: '60%',
            color: 'white'
        },
        '& .MuiSelect-select': {
            py: 1,
            textAlign: 'start',
            border: '1px solid rgba(255, 255, 255, 0.5)'
        }
    }

    return (
        <>
        <Box sx={{width: '100%', height: '100%', overflow: 'hidden', ...theme.components.box.fullCenterCol}}>
            <Box sx={{...theme.components.box.fullCenterCol, width: '80%', height: '40%'}}>
                <Box sx={{width: '100%', height: '90%', ...theme.components.box.fullCenterRow}}>
                    <Typography sx={{fontWeight: 700, mr: isCounteroffer ? 1 : 2}}>Trade With Your: </Typography>
                    {isCounteroffer ? 
                    <Typography sx={{fontWeight: 700}}>{isNaN(parseInt(selectedColData.gen)) ? `${selectedColData.gen.toUpperCase()} Aprimon Collection` : `Gen ${selectedColData.gen} Aprimon Collection`}</Typography> :
                    <Select value={selectedCol} onChange={(e, newVal) => changeSelectedCol(newVal.props.value)} sx={styledSelect}>
                        {userCollections.map(userCol => {
                            const display = isNaN(parseInt(userCol.gen)) ? `${userCol.gen.toUpperCase()} Aprimon Collection` : `Gen ${userCol.gen} Aprimon Collection`
                            return (
                                <MenuItem 
                                    value={userCol._id}
                                    key={`compare-collection-${userCol._id}-selection`}
                                >
                                    {display}
                                </MenuItem>
                            )
                        })}
                    </Select>}
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, width: '90%', height: '60%'}}>
                <Box sx={{width: '35%', height: '100%', position: 'relative', ...theme.components.box.fullCenterCol}}>
                    <Typography sx={{position: 'absolute', bottom: '6px', fontSize: '12px', opacity: 0.5}}>(Optional)</Typography>
                    <Button size='medium' variant='contained' disabled={selectedCol === ''} onClick={toggleModalState}>Compare Collections</Button>
                </Box>
                <Box sx={{width: '65%', height: '90%', border: `1px solid ${theme.palette.color3.dark}`, borderRadius: '10px', backgroundColor: hexToRgba(theme.palette.color3.main, 0.3), ...theme.components.box.fullCenterCol}}>
                    {(noComparisonData || comparisonData.comparedWith !== selectedCol) ? 
                        <Typography sx={{color: 'rgb(50, 50, 50)', fontSize: '20px'}}>
                            <i>No comparison data</i>
                        </Typography> :
                        <Box sx={{...theme.components.box.fullCenterCol, width: '90%'}}>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%', height: '50%', borderBottom: `1px solid ${theme.palette.color3.dark}`}}>
                                <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'end', width: '30%', height: '100%'}}>
                                    <Typography>You can offer:</Typography>
                                </Box>
                                <Box sx={{...theme.components.box.fullCenterCol, ml: 1, width: '65%', height: '100%'}}>
                                    <Box sx={{...theme.components.box.fullCenterRow}}>
                                        <Typography sx={{fontSize: '12px'}}>
                                            {aprimonCounts.canOfferAprimon.length} Aprimon: {aprimonCounts.canOfferAprimon.filter(count => count.isHA === true).length} with HA, {aprimonCounts.canOfferAprimon.filter(count => count.isHA === undefined).length} 
                                        </Typography>
                                        <Tooltip title="Non-HA refers to pokemon who do not have hidden abilites, or cannot have them in that ball combination."><Typography sx={{cursor: 'pointer', color: 'turquoise', textAlign: 'center', mx: 0.5, fontSize: '12px'}}> Non-HA.</Typography></Tooltip>
                                    </Box>
                                    <Typography sx={{fontSize: '12px'}}>
                                        {aprimonCounts.canOfferAprimonOnhand.length} On-Hand Aprimon: {aprimonCounts.canOfferAprimonOnhand.filter(count => count.isHA === true).length} with HA, {aprimonCounts.canOfferAprimonOnhand.filter(count => count.isHA === undefined).length} Non-HA.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%', height: '50%'}}>
                                <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'end', width: '30%', height: '100%'}}>
                                    <Typography>They can offer:</Typography>
                                </Box>
                                <Box sx={{...theme.components.box.fullCenterCol, ml: 1, width: '65%', height: '100%'}}>
                                    <Typography sx={{fontSize: '12px'}}>
                                        {aprimonCounts.canReceiveAprimon.length} Aprimon: {aprimonCounts.canReceiveAprimon.filter(count => count.isHA === true).length} with HA, {aprimonCounts.canReceiveAprimon.filter(count => count.isHA === undefined).length} Non-HA.
                                    </Typography>
                                    <Typography sx={{fontSize: '12px'}}>
                                        {aprimonCounts.canReceiveAprimonOnhand.length} On-Hand Aprimon: {aprimonCounts.canReceiveAprimonOnhand.filter(count => count.isHA === true).length} with HA, {aprimonCounts.canReceiveAprimonOnhand.filter(count => count.isHA === undefined).length} Non-HA.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
        <ComparisonMain 
            open={modalState}
            toggleModal={toggleModalState}
            tradeableCollections={userCollections}
            collectionData={ownerCollection}
            isTradePage={true}
            externalSelectedCol={selectedCol}
            externalChangeSelectedCol={changeSelectedCol}
            externalComparisonData={comparisonData}
            extSetComparisonData={setComparisonData}
            extSelectedColData={selectedColData}
            extCantChangeSelected={isCounteroffer}
        />
        </>
    )
}