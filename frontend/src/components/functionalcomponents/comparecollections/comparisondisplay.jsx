import {Box, Typography, useTheme, Tabs, Tab, styled, Paper, Button, Grid, Tooltip} from '@mui/material'
import { useState, forwardRef } from 'react'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import SpeciesSelect from '../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { reFormatToIndividual } from '../../../../utils/functions/comparecollections/comparison'
import hexToRgba from 'hex-to-rgba'

const Item = styled(Paper)(() => ({
    backgroundColor: 'transparent',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    textAlign: 'center',
    color: 'inherit',
    fontFamily: 'Arial',
}));

const gridComponents = {
    List: forwardRef(({children, ...props}, ref) => (
        <Grid {...props} container ref={ref} spacing={0.5} sx={{width: '100%'}}>
            {children}
        </Grid>
    )),
    Item: forwardRef(({children, ...props}, ref) => (
        <Grid item {...props} xs={2} ref={ref} sx={{minHeight: '120px'}}>
            {children}
        </Grid>
    ))
}

export default function ComparisonDisplay({userCollectionDisplay, ownerCollectionDisplay, comparisonData, ownerUsername, oneHomeCollection, goBackScreen, ownerTradeStatus}) {
    const theme = useTheme()
    const [list, setList] = useState('canOffer')
    const [displayType, setDisplayType] = useState('byIndividual')
    const canOfferAmount = comparisonData.canOffer.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
    const canReceiveAmount = comparisonData.canReceive.map((p) => p.balls.length).reduce((accumulator, currentValue) => accumulator+currentValue, 0)

    // console.log(comparisonData)

    const listItemContent = (p) => {
        const amountOfBalls = p.balls.length
        return (
            <>
            <Box 
                sx={{display: 'flex', alignItems: 'center', backgroundColor: '#283f57', borderRadius: '10px', my: 0.5, height: '25px', width: '100%', ...theme.components.box.fullCenterRow}}
            >
                <Box sx={{display: 'flex', alignItems: 'center', width: '100%', height: '100%'}}>
                    <Box sx={{height: '100%', width: '30px', mx: 0.25, pointerEvents: 'none', ...theme.components.box.fullCenterRow}}>
                        <ImgData linkKey={p.id}/>
                    </Box>
                    <Box sx={{height: '100%', width: '45px', mx: 0.5, pointerEvents: 'none', ...theme.components.box.fullCenterRow}}>
                        <Typography sx={{fontSize: '12px'}}>#{p.natDexNum}</Typography>
                    </Box>
                    <Box sx={{height: '100%', width: '40%', mx: 0.5, pointerEvents: 'none', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{p.name}</Typography>
                    </Box>
                    {p.for !== undefined &&
                    <Box sx={{height: '100%', width: '43%', mx: 0.5, pointerEvents: 'none', ...theme.components.box.fullCenterRow, justifyContent: 'end'}}>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>For: {p.for}</Typography>
                    </Box>}
                </Box>
            </Box>
            <Box 
                sx={{display: 'flex', alignItems: 'center', backgroundColor: '#283f57', borderRadius: '10px', my: 0.5, height: '100px', width: '100%', ...theme.components.box.fullCenterRow}}
            >
                <Grid container sx={{height: '80%', width: '100%', pointerEvents: 'none', mt: 1, ...theme.components.box.fullCenterRow}} gap={0.6}>
                    {p.balls.map((ballData) => {
                        const showHAEMArea = (oneHomeCollection && ballData.isHA !== undefined) || (!oneHomeCollection && (ballData.isHA !== undefined || ballData.emCount !== undefined))
                        const displayHA = ballData.isHA !== undefined
                        const displayEM = (!oneHomeCollection && ballData.emCount !== undefined)
                        const showIsOnhandArea = ballData.onhand === true
                        
                        return (
                            <Grid item key={`${list}-pokemon-${p.id}-${ballData.ball}`} sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', height: '100%', width: `${100/amountOfBalls}%`, maxWidth: '8%'}}>
                                <Typography sx={{fontSize: '12px'}}>{capitalizeFirstLetter(ballData.ball)}</Typography>
                                <ImgData type='ball' linkKey={ballData.ball} size='28px'/>
                                {showHAEMArea && 
                                <Box sx={{...theme.components.box.fullCenterRow, borderTop: '1px solid rgba(255,255,255, 0.3)', width: '95%'}}>
                                    {ballData.isHA !== undefined && <Typography sx={{fontSize: '10px', opacity: ballData.isHA ? 1 : 0.5, fontWeight: ballData.isHA ? 700 : 400}}>HA</Typography>}
                                    {(displayHA && displayEM) &&
                                        <Box sx={{width: '10%'}}></Box>
                                    }
                                    {(!oneHomeCollection && ballData.emCount !== undefined) && <Typography sx={{fontSize: '10px', opacity: ballData.emCount === 0 ? 0.5 : 1, fontWeight: ballData.isMaxEMs ? 700 : 400}}>{ballData.emCount}EM</Typography>}
                                </Box>}
                                {showIsOnhandArea && 
                                    <Box sx={{...theme.components.box.fullCenterRow, borderTop: '1px solid rgba(255,255,255, 0.3)'}}>
                                        <Typography sx={{fontSize: '10px'}}>On-Hand</Typography>
                                    </Box>
                                }
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
            </>
        )
    }

    const listItemContentByIndividual = (p) => {
        const showHAEMArea = (oneHomeCollection && p.isHA !== undefined) || (!oneHomeCollection && (p.isHA !== undefined || p.emCount !== undefined))
        const displayHA = p.isHA !== undefined
        const displayEM = (!oneHomeCollection && p.emCount !== undefined)
        const showIsOnhandArea = p.onhand === true
        return (
            <Item sx={{padding: '5%', width: '85%', backgroundColor: '#283f57', position: 'relative'}}>
                <Typography sx={{fontSize: '10px'}}>#{p.natDexNum}</Typography>
                <Typography sx={{fontSize: '12px'}}>{capitalizeFirstLetter(p.ball)} {p.name}</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, my: 1}}>
                    <ImgData type='ball' linkKey={p.ball}/>
                    <ImgData type='poke' linkKey={p.id}/>
                </Box>
                {showHAEMArea && 
                <Box sx={{...theme.components.box.fullCenterRow, borderTop: '1px solid rgba(255,255,255, 0.3)'}}>
                    {p.isHA !== undefined && <Typography sx={{fontSize: '13px', opacity: p.isHA ? 1 : 0.5, fontWeight: p.isHA ? 700 : 400}}>HA</Typography>}
                    {(displayHA && displayEM) &&
                        <Box sx={{width: '20%'}}></Box>
                    }
                    {(!oneHomeCollection && p.emCount !== undefined) && <Typography sx={{fontSize: '13px', opacity: p.emCount === 0 ? 0.5 : 1, fontWeight: p.isMaxEMs ? 700 : 400}}>{p.emCount}EM</Typography>}
                </Box>}
                {showIsOnhandArea && 
                    <Box sx={{...theme.components.box.fullCenterRow, borderTop: '1px solid rgba(255,255,255, 0.3)'}}>
                        <Typography sx={{fontSize: '12px'}}>On-Hand</Typography>
                    </Box>
                }
                {p.wanted && 
                    <Tooltip title={`This is marked as 'Highly Wanted' in ${list === 'canOffer' ? 'their' : 'your'} collection.`}>
                        <Box sx={{position: 'absolute', top: '2px', right: '2px'}}>
                            <Typography sx={{fontSize: '9px', cursor: 'pointer'}}>WANT</Typography>
                        </Box>
                    </Tooltip>
                }
                {p.for && 
                    <Tooltip title={`This is an equivalent pokemon. ${list === 'canOffer' ? 'They' : 'You'} are looking for ${p.for}`}>
                        <Box sx={{position: 'absolute', top: '2px', left: '2px'}}>
                            <Typography sx={{fontSize: '9px', cursor: 'pointer'}}>EQ</Typography>
                        </Box>
                    </Tooltip>
                }
            </Item>
        )
    }

    const changeDisplayType = (displayType) => {setDisplayType(displayType)}
    const formattedComparisonData = displayType === 'byIndividual' ? reFormatToIndividual(comparisonData) : comparisonData
    const listContentFunc = displayType === 'byIndividual' ? listItemContentByIndividual : listItemContent
    const useGridComponents = displayType === 'byIndividual' ? {components: gridComponents} : {}
    const ListComponent = displayType === 'byIndividual' ? VirtuosoGrid : Virtuoso
    const aprimonCount = comparisonData[list].map(p => p.balls.filter(ballData => ballData.onhand !== true)).flat()
    const onhandCount = comparisonData[list].map(p => p.balls.filter(ballData => ballData.onhand === true)).flat()

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
                    itemContent={(idx) => listContentFunc(formattedComparisonData[list][idx])}
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
            <Tooltip title="Non-HA refers to pokemon who do not have hidden abilites."><Typography sx={{cursor: 'pointer', color: 'turquoise', textAlign: 'center', mx: 0.5}}> Non-HA.</Typography></Tooltip>
            </Box>
            <Typography>
                {onhandCount.length} On-Hand Aprimon: {onhandCount.filter(count => count.isHA === true).length} w/ HA, {onhandCount.filter(count => count.isHA === undefined).length} Non-HA.
            </Typography>
            <Box sx={{...theme.components.box.fullCenterRow, height: '60%', alignItems: 'end'}}>
                <Button variant='contained' sx={{mr: 10}} onClick={goBackScreen}>Compare another collection</Button>
                {((canOfferAmount === 0 || canReceiveAmount === 0) || ownerTradeStatus !== 'open') ?
                <Tooltip title={ownerTradeStatus !== 'open' ? 'This collection is not accepting trade offers' : 'One side cannot offer anything!'}>
                    <Box sx={{'&:hover': {cursor: 'pointer'}}}>
                    <Button variant='contained' sx={{'&.Mui-disabled': {opacity: 0.5, backgroundColor: theme.palette.primary.main, color: 'white'}}} disabled>Offer Trade</Button>
                    </Box>
                </Tooltip> : 
                <Button variant='contained'>Offer Trade</Button>
                }
            </Box>
        </Box>
        </>
    )
}