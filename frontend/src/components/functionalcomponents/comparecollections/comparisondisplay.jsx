import {Box, Typography, useTheme, Tabs, Tab, styled, Paper, Button, Grid, Tooltip} from '@mui/material'
import { useState, forwardRef } from 'react'
import { useNavigate, useRouteLoaderData } from 'react-router'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import { reFormatToIndividual, reFormatIndividualRow } from '../../../../utils/functions/comparecollections/comparison'
import hexToRgba from 'hex-to-rgba'
import { compareDisplayGridComponents, listCompareDisplayIndividual, listCompareDisplayPokemon } from './comparedisplaygridcomponents'



export default function ComparisonDisplay({userCollectionDisplay, userColId, ownerCollectionDisplay, ownerColId, comparisonData, ownerUsername, oneHomeCollection, goBackScreen, ownerTradeStatus, ownerBlockedUsers, ownerTradesDisabled, isTradePage, closeModal}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const loggedInUserData = useRouteLoaderData("root")
    const [list, setList] = useState('canOffer')
    const [displayType, setDisplayType] = useState('byIndividual')
    const canOfferAmount = comparisonData.canOffer.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const canReceiveAmount = comparisonData.canReceive.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)

    // console.log(comparisonData)

    const changeDisplayType = (displayType) => {setDisplayType(displayType)}
    const formattedComparisonData = displayType === 'byIndividual' ? reFormatToIndividual(comparisonData) : comparisonData
    const listContentFunc = displayType === 'byIndividual' ? listCompareDisplayIndividual : listCompareDisplayPokemon
    const useGridComponents = displayType === 'byIndividual' ? {components: compareDisplayGridComponents} : {}
    const ListComponent = displayType === 'byIndividual' ? VirtuosoGrid : Virtuoso
    const aprimonCount = comparisonData[list].map(p => p.balls.filter(ballData => ballData.onhandId === undefined)).flat()
    const onhandCount = comparisonData[list].map(p => p.balls.filter(ballData => ballData.onhandId !== undefined)).flat()
    const canGoNextScreen = (isTradePage || (canOfferAmount !== 0 || canReceiveAmount !== 0) || ownerTradeStatus !== 'open')
    const userNameDisplaySettings = loggedInUserData.loggedIn ? loggedInUserData.user.settings.display.pokemonNames : undefined

    const navigateOpts = {
        state: {
            compareWith: userColId,
            comparisonData: {...comparisonData, comparedWith: userColId}
        }
    }

    return (
        <>
        <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '6%'}}>
            <Typography sx={{...modalStyles.onhand.modalTitle, width: '100%', textAlign: 'center', mt: 1, fontSize: '20px'}}>Your {userCollectionDisplay} Collection and their {ownerCollectionDisplay} Collection</Typography>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '72%', my: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography sx={{height: '45px', textAlign: 'center', mt: 1}}>
                You can offer <b>{canOfferAmount}</b> aprimon they don't own, while {ownerUsername} can offer you <b>{canReceiveAmount}</b> aprimon you don't own.
            </Typography>
            <Tabs value={list} onChange={(e, newVal) => setList(newVal)} sx={{'&.MuiTabs-root': {height: '25px', minHeight: '0px'}, '& .MuiTab-root': {py: 0, minHeight: '12px', color: 'rgba(255, 255, 255, 0.8)'}}}>
                <Tab value='canOffer' label='What you can offer' sx={{py: 0.5}}/>
                <Tab value='canReceive' label='What they can offer you' sx={{py: 0.5}}/>
            </Tabs>
            <Box sx={{width: '100%', height: '90%', ...theme.components.box.fullCenterRow}}>
                {formattedComparisonData[list].length !== 0 ?
                <ListComponent
                    totalCount={formattedComparisonData[list].length}
                    {...useGridComponents}
                    style={{width: '99%', height: '95%', border: '1px solid white', borderRadius: '10px'}}
                    itemContent={(idx) => listContentFunc(formattedComparisonData[list][idx], oneHomeCollection, theme, list.slice(3, list.length).toLowerCase(), undefined, undefined, undefined, userNameDisplaySettings)}
                /> : 
                <Box sx={{width: '99%', height: '95%', border: '1px solid white', borderRadius: '10px', ...theme.components.box.fullCenterCol}}>
                    <Typography sx={{fontSize: '20px', color: 'grey'}}>
                        <i>{list === 'canOffer' ? 'You' : 'They'} can't offer anything!</i>
                    </Typography>
                </Box>
                }
            </Box>
            <Button onClick={() => changeDisplayType(displayType === 'byPokemon' ? 'byIndividual' : 'byPokemon')} sx={{color: 'white'}}>{displayType === 'byPokemon' ? 'Group Individually' : 'Group by Pokemon'}</Button>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box sx={{...theme.components.box.fullCenterRow, mt: 1}}>
            <Typography>
                {aprimonCount.length} Aprimon: {aprimonCount.filter(count => count.isHA === true).length} w/ HA, {aprimonCount.filter(count => count.isHA === undefined).length} 
            </Typography>
            <Tooltip title="Non-HA refers to pokemon who do not have hidden abilites, or cannot have them in that ball combination."><Typography sx={{cursor: 'pointer', color: 'turquoise', textAlign: 'center', mx: 0.5}}> Non-HA.</Typography></Tooltip>
            </Box>
            <Typography>
                {onhandCount.length} On-Hand Aprimon: {onhandCount.filter(count => count.isHA === true).length} w/ HA, {onhandCount.filter(count => count.isHA === undefined).length} Non-HA.
            </Typography>
            <Box sx={{...theme.components.box.fullCenterRow, height: '60%', alignItems: 'end'}}>
                <Button variant='contained' sx={{mr: 10}} onClick={goBackScreen}>Compare another collection</Button>
                {(!canGoNextScreen) ?
                <Tooltip title={ownerTradeStatus !== 'open' ? 'This collection is not accepting trade offers' : 'One side cannot offer anything!'}>
                    <Box sx={{'&:hover': {cursor: 'pointer'}}}>
                    <Button variant='contained' sx={{'&.Mui-disabled': {opacity: 0.5, backgroundColor: theme.palette.primary.main, color: 'white'}}} disabled>Offer Trade</Button>
                    </Box>
                </Tooltip> : 
                <Button 
                    disabled={!isTradePage && ((loggedInUserData.loggedIn && ownerBlockedUsers.includes(loggedInUserData.user.username) || ownerTradesDisabled))} 
                    variant='contained' 
                    onClick={isTradePage ? closeModal : () => navigate(`/collections/${ownerColId}/trade`, navigateOpts)}
                >
                    {isTradePage ? 'Next' : 'Offer Trade'}
                </Button>
                }
            </Box>
        </Box>
        </>
    )
}