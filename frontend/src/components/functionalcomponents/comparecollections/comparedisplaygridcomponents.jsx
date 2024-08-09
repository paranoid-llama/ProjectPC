import {Box, Typography, Grid, Tooltip, Paper, styled, ToggleButton, useTheme} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { setPokemon } from '../../../app/slices/tradeoffer';
import { selectIfPokemonIsSelected } from '../../../app/selectors/tradeselectors';
import { forwardRef } from 'react';
import ImgData from '../../collectiontable/tabledata/imgdata'
import hexToRgba from 'hex-to-rgba';
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay';

const Item = styled(Paper)(() => ({
    backgroundColor: 'transparent',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    textAlign: 'center',
    color: 'inherit',
    fontFamily: 'Arial',
    padding: '5%'
}));

const togglePokemonStyles = {
    justifyContent: 'start', 
    width: '100%', 
    height: '100%', 
    textTransform: 'none', 
    color: 'inherit',
    padding: 0, 
    paddingTop: '3px',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
}

const togglePokemonThemeDepStyles = (theme, noBorder=false) => {
    return {
        border: noBorder ? 'none' : `0.25px solid ${hexToRgba(theme.palette.color1.light, 0.3)}`, 
        '&.Mui-selected': {
            boxShadow: '0px 5px 4px -4px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 5px 7px 0px rgba(0,0,0,0.12)',
            color: 'inherit',
            backgroundColor: theme.palette.color1.dark,
            ':hover': {
                backgroundColor: hexToRgba(theme.palette.color1.dark, 0.5)
            }
        },
        ':hover': {
            backgroundColor: hexToRgba(theme.palette.color1.dark, 0.75)
        }
    }
}

export const compareDisplayGridComponents = {
    List: forwardRef(({children, ...props}, ref) => (
        <Grid {...props} container ref={ref} spacing={0.5} rowSpacing={1} sx={{width: '100%'}}>
            {children}
        </Grid>
    )),
    Item: forwardRef(({children, ...props}, ref) => (
        <Grid item {...props} xs={2} ref={ref} sx={{}}>
            {children}
        </Grid>
    ))
}

const listCompareDisplayPokemonBallComp = (p, theme, oneHomeCollection, ballData, showHAEMArea, displayHA, displayEM, showIsOnhandArea) => {
    return (
        <>
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
        </>
    )
}

const listCompareDisplayIndividualComp = (p, theme, oneHomeCollection, showHAEMArea, displayHA, displayEM, displayName, nameSize, imgAreaMargin, selected=false, list) => {
    return (
        <>
            <Box sx={{...theme.components.box.fullCenterCol, height: '70%', width: '100%', justifyContent: 'start'}}>
                <Typography sx={{fontSize: '10px'}}>#{p.natDexNum}</Typography>
                <Typography sx={{...nameSize}}>{displayName}</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, ...imgAreaMargin}}>
                    <ImgData type='ball' linkKey={p.ball} size='24px'/>
                    <ImgData type='poke' linkKey={p.id} size='28px'/>
                </Box>
            </Box>
            
            {(showHAEMArea) && 
            <Box sx={{...theme.components.box.fullCenterCol, height: '25%', width: '100%', justifyContent: 'end'}}>
                {showHAEMArea && 
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', borderTop: '1px solid rgba(255,255,255, 0.3)'}}>
                    {p.isHA !== undefined && <Typography sx={{fontSize: '12px', opacity: p.isHA ? 1 : 0.5, fontWeight: p.isHA ? 700 : 400}}>HA</Typography>}
                    {(displayHA && displayEM) &&
                        <Box sx={{width: '20%'}}></Box>
                    }
                    {(!oneHomeCollection && p.emCount !== undefined) && <Typography sx={{fontSize: '12px', opacity: p.emCount === 0 ? 0.5 : 1, fontWeight: p.isMaxEMs ? 700 : 400}}>{p.emCount}EM</Typography>}
                </Box>}
            </Box>}
            {p.onhandId && 
                <Box sx={{position: 'relative', width: '100%', height: 0}}>
                    <Box sx={{position: 'absolute', width: '100%', ...theme.components.box.fullCenterRow, top: '-2px'}}>
                        <Typography sx={{fontSize: '9px'}}>On-Hand</Typography>
                    </Box>
                </Box>
            }
            
            {(p.wanted && !selected) && 
                <Tooltip title={`This is marked as 'Highly Wanted' in ${list === 'offer' ? 'their' : 'your'} collection.`}>
                    <Box sx={{position: 'absolute', top: '2px', right: '2px'}}>
                        <Typography sx={{fontSize: '9px', cursor: 'pointer'}}>WANT</Typography>
                    </Box>
                </Tooltip>
            }
            {p.for && 
                <Tooltip title={`This is an equivalent pokemon. ${list === 'offer' ? 'They' : 'You'} are looking for ${p.for}`}>
                    <Box sx={{position: 'absolute', top: '2px', left: '2px'}}>
                        <Typography sx={{fontSize: '9px', cursor: 'pointer'}}>EQ</Typography>
                    </Box>
                </Tooltip>
            }
        </>
    )
}


export function listCompareDisplayPokemon(p, oneHomeCollection, theme, list, toggle=false, randPar1, randPar2, userNameDisplaySettings) {
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
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{userNameDisplaySettings === undefined ? p.name : getNameDisplay(userNameDisplaySettings, p.name, p.natDexNum)}</Typography>
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
                    const showIsOnhandArea = ballData.onhandId !== undefined
                    return (
                        
                        <Grid 
                            item 
                            key={`pokemon-${p.id}-${ballData.ball}${ballData.onhandId === undefined ? '' : `-onhand-${ballData.onhandId}`}`} 
                            sx={{height: '100%', width: `${100/amountOfBalls}%`, maxWidth: '8%', pointerEvents: toggle ? 'auto' : 'none', position: 'relative', ...theme.components.box.fullCenterCol, justifyContent: 'start'}}
                        >
                            {toggle ? 
                            <ToggleButton 
                                sx={{...theme.components.box.fullCenterCol, ...togglePokemonStyles, ...togglePokemonThemeDepStyles(theme)}}
                                selected={pokemonBallIsSelected}
                                value={ballData.onhandId !== undefined ? ballData.onhandId : `${p.id} ${ballData.ball}`}
                                onChange={() => toggleFunc(ballData)}
                            >
                                {listCompareDisplayPokemonBallComp(p, theme, oneHomeCollection, ballData, showHAEMArea, displayHA, displayEM, showIsOnhandArea)}
                                {pokemonBallIsSelected && 
                                    <Box sx={{position: 'absolute', top: '-5px', right: '1px'}}>
                                        <ImgData type='icons' linkKey='greencheckmark' size='10px'/>
                                    </Box>
                                }
                            </ToggleButton> : 
                            listCompareDisplayPokemonBallComp(p, theme, oneHomeCollection, ballData, showHAEMArea, displayHA, displayEM, showIsOnhandArea)
                            }
                        </Grid> 
                    )
                })}
            </Grid>
        </Box>
        </>
    )
}

//this component uses a virtuoso grid. virtuoso grids bug out if every item is not the same height, which is why the height is defined.
//do not add a variable height to this component.
export function listCompareDisplayIndividual(p, oneHomeCollection, theme, list, toggle=false, isSelected, toggleFunc, userNameDisplaySettings) {
    const showHAEMArea = (oneHomeCollection && p.isHA !== undefined) || (!oneHomeCollection && (p.isHA !== undefined || p.emCount !== undefined))
    const displayHA = p.isHA !== undefined
    const displayEM = (!oneHomeCollection && p.emCount !== undefined)
    const displayName = `${capitalizeFirstLetter(p.ball)} ${userNameDisplaySettings === undefined ? p.name : getNameDisplay(userNameDisplaySettings, p.name, p.natDexNum)}`
    const sizeScaling = displayName.length >= 18 && displayName.length < 35 ? 'small' : displayName.length >= 35 ? 'smaller' : 'regular'
    const nameSizeAdjust = sizeScaling === 'small' ? {fontSize: '10px'} : sizeScaling === 'smaller' ? {fontSize: '8.5px'} : {fontSize: '12px'}
    const nameBallAreaMarge = sizeScaling === 'small' ? {mb: 0.25, mt: 0.5} : sizeScaling === 'smaller' ? {mb: 0.25, mt: 0} : {my: 0.25, mb: 1}

    return (
        <Item sx={{padding: toggle ? 0 : '5%', width: toggle ? '92%' : `87%`, height: toggle ? '115px' : '105px', backgroundColor: theme.palette.color1.main, position: 'relative'}}>
            {
            toggle ? 
            <ToggleButton 
                sx={{...theme.components.box.fullCenterCol, ...togglePokemonStyles, ...togglePokemonThemeDepStyles(theme), padding: '5%'}}
                selected={isSelected}
                value={p.onhandId !== undefined ? p.onhandId : `${p.id} ${p.ball}`}
                onChange={toggleFunc}
            >
                {listCompareDisplayIndividualComp(p, theme, oneHomeCollection, showHAEMArea, displayHA, displayEM, displayName, nameSizeAdjust, nameBallAreaMarge, isSelected, list)}
                {isSelected && 
                    <Box sx={{position: 'absolute', top: '3px', right: '3px'}}>
                        <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                    </Box>
                }
            </ToggleButton> : 
            listCompareDisplayIndividualComp(p, theme, oneHomeCollection, showHAEMArea, displayHA, displayEM, displayName, nameSizeAdjust, nameBallAreaMarge, false, list)
            }
            
        </Item>
    )
}

export function IndividualCompareDisplayComponent({p, oneHomeCollection, list, userNameDisplaySettings}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const formatList = list === 'offer' ? 'offering' : 'receiving'
    const pokemonIsSelected = useSelector((state) => selectIfPokemonIsSelected(state, formatList, {name: p.name, ball: p.ball, onhandId: p.onhandId}))
    const pDataForToggle = {name: p.name, id: p.id, natDexNum: p.natDexNum}
    const ballDataForToggle = {...p}
    delete ballDataForToggle.name
    delete ballDataForToggle.id
    delete ballDataForToggle.natDexNum
    const onClickFunc = () => dispatch(setPokemon({pData: pDataForToggle, ballData: ballDataForToggle, tradeSide: formatList}))
    return (
        listCompareDisplayIndividual(p, oneHomeCollection, theme, list, true, pokemonIsSelected, onClickFunc, userNameDisplaySettings)
    )
}

export function PokemonCompareDisplayComponent({p, oneHomeCollection, list, userNameDisplaySettings}) {
    const theme = useTheme()
    const amountOfBalls = p.balls.length
    const dispatch = useDispatch()
    const selector = useSelector
    const formatList = list === 'offer' ? 'offering' : 'receiving'
    // const pokemonSelectedData = useSelector((state) => state.tradeOffer[formatList].filter(poke => poke.name === p.name))
    const pDataForToggle = {name: p.name, id: p.id, natDexNum: p.natDexNum}
    const onClickFunc = (ballData) => {
        const ballDataForToggle = {...ballData}
        if (ballDataForToggle.isMaxEMs !== undefined) {delete ballDataForToggle.isMaxEMs}
        dispatch(setPokemon({pData: pDataForToggle, ballData: ballDataForToggle, tradeSide: formatList}))
    }
    return (
        // listCompareDisplayPokemon(p, oneHomeCollection, theme, list, true, pokemonSelectedData, onClickFunc)
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
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}>{userNameDisplaySettings === undefined ? p.name : getNameDisplay(userNameDisplaySettings, p.name, p.natDexNum)}</Typography>
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
                    const showIsOnhandArea = ballData.onhandId !== undefined
                    const pokemonBallIsSelected = selector((state) => selectIfPokemonIsSelected(state, formatList, {name: p.name, ball: ballData.ball, onhandId: ballData.onhandId}))
                    return (
                        <Grid 
                            item 
                            key={`pokemon-${p.id}-${ballData.ball}${ballData.onhandId === undefined ? '' : `-onhand-${ballData.onhandId}`}`} 
                            sx={{height: '100%', width: `${100/amountOfBalls}%`, maxWidth: '8%', pointerEvents: 'auto', position: 'relative'}}
                        >
                            <ToggleButton 
                                sx={{...theme.components.box.fullCenterCol, ...togglePokemonStyles, ...togglePokemonThemeDepStyles(theme)}}
                                selected={pokemonBallIsSelected}
                                value={ballData.onhandId !== undefined ? ballData.onhandId : `${p.id} ${ballData.ball}`}
                                onChange={() => onClickFunc(ballData)}
                            >
                                {listCompareDisplayPokemonBallComp(p, theme, oneHomeCollection, ballData, showHAEMArea, displayHA, displayEM, showIsOnhandArea)}
                                {pokemonBallIsSelected && 
                                    <Box sx={{position: 'absolute', top: '-5px', right: '1px'}}>
                                        <ImgData type='icons' linkKey='greencheckmark' size='10px'/>
                                    </Box>
                                }
                            </ToggleButton> 
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
        </>
    )
}