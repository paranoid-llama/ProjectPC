import {Box, Typography, useTheme, Select, MenuItem, Button} from '@mui/material'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RenderOnHandEdit from './renderonhandedit'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import hexToRgba from 'hex-to-rgba'
import { useRouteLoaderData } from 'react-router'
import { addOnHandPokemonToListByPokemon } from '../../../../app/slices/collectionstate'
import ImgData from '../../../collectiontable/tabledata/imgdata'
import EmTooltipWrapper from '../../../collectiontable/tabledata/emtooltipwrapper'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import newObjectId from '../../../../../utils/functions/newobjectid'
import DeleteOnHandConfirm from '../../editsectioncomponents/onhandeditonly/deleteonhandconfirmmodal'

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

export default function ByPokemonEdit({collectionId, ownerId, ohPokemonObj, allEggMoves, isHomeCollection, colBallInfo, demo, possibleGender}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const userNameDisplaySettings = demo ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    
    const [selectedOhP, setSelectedOhP] = useState(ohPokemonObj.init)
    const [deleteModal, setDeleteModal] = useState(false)

    const selectedPokemon = ohPokemonObj.list.filter(p => p._id === selectedOhP)[0]
    const idxOfPokemon = useSelector((state) => state.collectionState.onhand.indexOf(selectedPokemon))

    const addOnhandOfBall = () => {
        const newOnhandData = {
            _id: newObjectId(),
            name: selectedPokemon.name,
            natDexNum: selectedPokemon.natDexNum,
            imgLink: selectedPokemon.imgLink,
            ball: selectedPokemon.ball,
            gender: possibleGender === 'both' ? 'unknown' : possibleGender,
            isHA: colBallInfo.isHA,
            emCount: colBallInfo.emCount,
            EMs: colBallInfo.EMs,
            qty: 1
        }
        dispatch(addOnHandPokemonToListByPokemon(newOnhandData))
        setSelectedOhP(newOnhandData._id)
    }

    const TBDPokemon = selectedPokemon
    const TBDData = {
        pokemonName: TBDPokemon.name,
        dexNum: TBDPokemon.natDexNum,
        ball: TBDPokemon.ball,
        imgLink: TBDPokemon.imgLink,
        isHA: TBDPokemon.isHA,
        emCount: TBDPokemon.emCount,
        gender: TBDPokemon.gender,
        isMaxEMs: TBDPokemon.emCount !== 0,
        pokemonId: TBDPokemon._id,
    }

    return (
        <>
        <RenderOnHandEdit 
            disableSpeciesEdit 
            collectionId={collectionId} 
            ownerId={ownerId} 
            pokemon={selectedPokemon} 
            idxOfPokemon={idxOfPokemon} 
            allEggMoves={allEggMoves} 
            isHomeCollection={isHomeCollection} 
            demo={demo}
            setSelectedBall={true}
        />
        <Select value={selectedOhP} onChange={(e, i) => i.props.value === '' ? null : setSelectedOhP(i.props.value)} sx={{position: 'absolute', top: '100%', right: '10%', width: '485px', backgroundColor: theme.palette.color1.main, color: 'white'}} MenuProps={{MenuListProps: {sx: {maxHeight: '200px', overflowY: 'scroll', py: 0, ...scrollerStyles}}}}>
            {ohPokemonObj.list.map((ohP, idx) => {
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
        <Box sx={{...theme.components.box.fullCenterCol, position: 'absolute', left: '90%', top: '100%', width: '22%', height: '65px', backgroundColor: '#e3e5e6', borderTop: '1px solid black'}}>
            <Button onClick={() => setDeleteModal(!deleteModal)} variant='contained' size='medium' sx={{backgroundColor: 'rgb(200, 40, 40)', ':hover': {backgroundColor: 'rgba(200, 40, 40, 0.75)'}}}>
                Remove
            </Button>
        </Box>
        <DeleteOnHandConfirm
            open={deleteModal}
            handleClose={() => setDeleteModal(!deleteModal)}
            {...TBDData}
            collectionID={collectionId}
            additionalDispatchProps={{byPAddon: `${TBDData.imgLink} ${TBDData.ball}`}}
            demo={demo}
        />
        </>
    )
}