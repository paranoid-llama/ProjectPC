import {Box, Typography, useTheme, Button, LinearProgress, Select, MenuItem} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import SWBallSelection from './swballselection'
import ByPokemonQtyEditor from '../../onhandlist/bypokemonqtyeditor'
import SWOnhandEditor from './swonhandeditor'
import EmTooltipWrapper from '../../../../collectiontable/tabledata/emtooltipwrapper'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import hexToRgba from 'hex-to-rgba'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import { setUnsavedChanges, toggleEditScreenState } from '../../../../../app/slices/editmode'
import newObjectId from '../../../../../../utils/functions/newobjectid'
import { addOnHandPokemonToListByPokemon } from '../../../../../app/slices/collectionstate'
import { selectAllOnHandsOfPokemon, selectOnHandPokemonByPokemon, selectOnHandPokemonIdx, selectOwnedBallsAndHangingOnHandBallsList } from '../../../../../app/selectors/selectors'
import { useRouteLoaderData } from 'react-router'
import { selectPokeIdMatches } from '../../../../../app/selectors/selectpokeidmatches'

const scrollerStyles = {
    '&::-webkit-scrollbar': {
        width: '6px'
    },
    '&::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'black',
        borderRadius: '5px'
    },
}

export default function SWOnhandByPokemonEditor({collectionID, demo, ohByPSWShowEditScreen, pokemon, baseImgWidth, baseGapWidth, isHomeCollection, otherOnhandReqData, ohByPSESData={list: [], init: '000'}}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const ball = useSelector(state => state.editmode.selectedBall)
    const userNameDisplaySettings = demo ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    // const ohByPSWShowEditScreen = useSelector((state) => state.editmode.ohByPSWShowEditScreen)
    const pData = useSelector((state) => ohByPSWShowEditScreen ? undefined : selectOnHandPokemonByPokemon(state, pokemon.imgLink))
    const allowedBalls = useSelector((state) => selectOwnedBallsAndHangingOnHandBallsList(state, pokemon.imgLink))
    
    const [selectedMon, setSelectedMon] = useState(ohByPSESData === undefined ? '000' : ohByPSESData.init)

    const changeSelectedMon = (pId) => setSelectedMon(pId)

    const ohEditData = ohByPSWShowEditScreen ? ohByPSESData === undefined ? undefined : ohByPSESData.list.filter(p => p._id === selectedMon)[0] : undefined
    const idxOfPokemon = useSelector((state) => selectOnHandPokemonIdx(state, selectedMon === undefined ? '000' : selectedMon))
    const colBallInfo = useSelector((state) => state.collectionState.collection.filter(p => selectPokeIdMatches(p.imgLink, pokemon.imgLink, p.disabled))[0].balls)
    // console.log(colBallInfo)

    const addOnhandOfBall = () => {
        const newOnhandData = {
            _id: newObjectId(),
            name: ohEditData.name,
            natDexNum: ohEditData.natDexNum,
            imgLink: ohEditData.imgLink,
            ball: ohEditData.ball,
            gender: otherOnhandReqData.possibleGender === 'both' ? 'unknown' : otherOnhandReqData.possibleGender,
            isHA: colBallInfo[ball].isHA,
            emCount: colBallInfo[ball].emCount,
            EMs: colBallInfo[ball].EMs,
            qty: 1
        }
        dispatch(addOnHandPokemonToListByPokemon(newOnhandData))
        dispatch(setUnsavedChanges('onhand'))
        changeSelectedMon(newOnhandData._id)
    }

    useEffect(() => {
        if (ohByPSWShowEditScreen && ohEditData === undefined) {
            setSelectedMon(ohByPSESData.init)
        }
    }, [ohByPSESData.init, pokemon.imgLink])
    //for whatever reason, theres a bit of lag between switching from basic to detailed edit and it causes "ohEditData" to be undefined, 
    //which causes issues, hence the ternaries on all the detailed edit sections. Not sure why its the case.

    return (
        <>
        {!(ohByPSWShowEditScreen && ohEditData === undefined) && 
        <SWBallSelection 
            allowedBalls={allowedBalls}
            ohBall={ohByPSWShowEditScreen ? ohEditData.ball : ''}
            isCollectionList={true}
            baseImgWidth={baseImgWidth}
            baseGapWidth={baseGapWidth}
            pokemonId={pokemon.imgLink}
            pokemonIdx={idxOfPokemon}
            useSetAllData={ohByPSWShowEditScreen ? true : false}
        />
        }
        {/* {(ohByPSWShowEditScreen && ohEditData === undefined) && 
        
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '100%', height: '80%'}}>
            <Typography>Loading Data</Typography>
            <LinearProgress/>
        </Box>
        } */}
        {!ohByPSWShowEditScreen ? 
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '100%', height: '80%'}}>
            <ByPokemonQtyEditor 
                qtyData={pData.idSetsAndNums[ball]}
                fullIdSetsAndNums={pData.idSetsAndNums}
                pokeId={pData.imgLink}
                ball={ball}
                width={'70%'}
                height={'50%'}
                separationFactor={5}
                otherNumsOffset={10}
                otherNumsSx={{fontSize: '11px'}}
                wrapperStyles={{ml: 0}}
                smScreen={true}
            />
            <Box sx={{height: '20%', width: '80%', ...theme.components.box.fullCenterRow, mt: 4}}>
                <Button 
                    disabled={pData.idSetsAndNums[ball] === undefined || pData.idSetsAndNums[ball].numTotal === 0} 
                    size='large' 
                    sx={{width: '50%', height: '100%'}} 
                    onClick={() => dispatch(toggleEditScreenState({setOhByPSWState: true}))}
                >
                    Detailed Edit
                </Button>
            </Box>
        </Box> : 
        <>
        {!(ohByPSWShowEditScreen && ohEditData === undefined) && 
        <>
        <SWOnhandEditor 
            collectionID={collectionID}
            demo={demo}
            pokemonId={selectedMon}
            allowedBalls={allowedBalls}
            noSpeciesEdit={true}
            idxOfPokemon={idxOfPokemon}
            isHomeCollection={isHomeCollection}
            possibleGender={otherOnhandReqData.possibleGender}
            noHA={otherOnhandReqData.noHA}
            noEMs={otherOnhandReqData.noEMs}
            otherCustomButton={() => 
                <Button
                    size='small'
                    sx={{
                        mt: 2,
                        
                    }}
                    onClick={() => dispatch(toggleEditScreenState({setOhByPSWState: true}))}
                >
                    Basic Edit
                </Button>
            }
            additionalDeleteDispatchProps={{byPAddon: `${pokemon.imgLink} ${ball}`, noEditModeUpdates: ohByPSESData.list.length === 1 ? false : true}}
            additionalDeleteSuccessFunction={() => {
                if (ohByPSESData.list.length === 1) {
                    dispatch(toggleEditScreenState({setOhByPSWState: true}))
                } else {
                    const idxOfSelectedMon = ohByPSESData.list.findIndex(p => p._id === selectedMon)
                    setSelectedMon(ohByPSESData.list.filter((p, i) => idxOfSelectedMon === 0 ? i === 1 : i === (idxOfSelectedMon-1))[0]._id)
                }
            }}
        />
        <Box sx={{width: '100%', height: '50px', position: 'fixed', top: '64.344px', left: '0px'}}>
            <Select value={selectedMon} onChange={(e, i) => i.props.value === '' ? null : changeSelectedMon(i.props.value)} sx={{width: '100%', height: '50px', backgroundColor: theme.palette.color1.main, color: 'white'}} MenuProps={{MenuListProps: {sx: {maxHeight: '200px', overflowY: 'scroll', py: 0, ...scrollerStyles}}}}>
                {ohByPSESData.list.map((ohP, idx) => {
                    const ballDisplay = `${capitalizeFirstLetter(ohP.ball)}`
                    const monDisplay = `${getNameDisplay(userNameDisplaySettings, ohP.name, ohP.natDexNum)}`
                    const styles = {backgroundColor: hexToRgba(theme.palette.color1.darker, 0.99), color: theme.palette.color3.main, '&.Mui-selected': {backgroundColor: theme.palette.color3.main, color: theme.palette.color1.main, ':hover': {backgroundColor: hexToRgba(theme.palette.color3.main, 0.75)}}, ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.9)}} 
                    return (
                        <MenuItem
                            key={`${ballDisplay}-${monDisplay}-onhand-${idx+1}`}
                            value={ohP._id}
                            sx={{...styles, fontSize: '12px', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}
                        >
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', gap: 2, width: '100%'}}>
                                <Typography sx={{fontSize: '16px', ...theme.components.box.fullCenterRow}}>
                                    {ballDisplay} {(ohP.gender === 'male' || ohP.gender === 'female') ? <ImgData size='24px' type='gender' linkKey={ohP.gender}/> : ''} {monDisplay}
                                </Typography>
                                
                                <Box sx={{...theme.components.box.fullCenterRow}}>
                                    <ImgData type='ball' linkKey={ohP.ball} size='32px'/>
                                    <ImgData type='poke' linkKey={ohP.imgLink} size='32px'/>
                                </Box>
                                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', justifyContent: 'end', gap: 1}}>
                                    {ohP.isHA !== undefined && <Typography sx={{opacity: ohP.isHA ? 1 : 0.5, fontWeight: ohP.isHA ? 700 : 400, fontSize: ohP.isHA ? '16px' : '11px'}}>{ohP.isHA ? 'HA' : 'Non-HA'}</Typography>}
                                    {ohP.emCount !== undefined && 
                                        <EmTooltipWrapper
                                            EMs={ohP.EMs}
                                            emCount={ohP.emCount}
                                            hoverTooltipInstead={true}
                                        >
                                            <Typography sx={{}}>{ohP.emCount}EM</Typography>
                                        </EmTooltipWrapper>
                                    }
                                    <Typography sx={{ml: 1}}>x{ohP.qty}</Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                    )
                })}
                <MenuItem
                    value={''}
                    sx={{fontSize: '12px', height: '44px', backgroundColor: hexToRgba(theme.palette.color1.darker, 0.99), color: theme.palette.color3.main, ...theme.components.box.fullCenterRow, justifyContent: 'start', ':hover': {backgroundColor: hexToRgba(theme.palette.color1.main, 0.9)}, padding: 0}}
                >
                    <Button sx={{width: '100%', height: '100%'}} onClick={addOnhandOfBall}>
                        <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px dashed black', borderRadius: '5px'}}>
                            <AddCircleOutlineIcon />
                        </Box>
                    </Button>    
                </MenuItem>
            </Select>
        </Box>
        </>
        }
        </>} 
        </> 
    )
}