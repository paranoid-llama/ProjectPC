import { forwardRef } from 'react';
import {Box, Typography, Grid, Paper, styled, Tooltip} from '@mui/material'
import { apriballLiterals } from '../../../../../infoconstants';
import MuiToggleButton from '@mui/material/ToggleButton'
import ImgData from '../../../../collectiontable/tabledata/imgdata';
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso';
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc';

const ToggleButton = styled(MuiToggleButton)({
    '&.MuiToggleButton-root': {
        // backgroundColor: '#283f57',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textTransform: 'none',
        color: 'white',
        border: 'none',
        padding: 0
    },
    '&.Mui-selected': {
        backgroundColor: 'transparent',
        boxShadow: '0px 5px 4px -4px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 5px 7px 0px rgba(0,0,0,0.12)',
        color: 'turquoise'
    }
})

const Item = styled(Paper)(() => ({
    backgroundColor: 'transparent',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    textAlign: 'center',
    color: 'inherit',
    fontFamily: 'Arial',
    
}));

const gridComponents = {
    List: forwardRef(({children, ...props}, ref) => (
        <Grid {...props} container ref={ref} spacing={1} sx={{width: '99%'}}>
            {children}
        </Grid>
    )),
    Item: forwardRef(({children, ...props}, ref) => (
        <Grid item {...props} xs={2} ref={ref}>
            {children}
        </Grid>
    ))
}

const generateOneOrOtherContent = (option1, option2, activePokemon, handleChange, isBabyAdultSelection, groupInfo, ballScope) => {
    const multipleOption2 = Array.isArray(option2)
    const noLegalBalls = !option1.legalBalls.map(ball => (
        ball === 'apriball' ?
        apriballLiterals.map(b => ballScope.includes(b)).includes(true) : 
        ballScope.includes(ball)
    )).includes(true)
    return (
        <Item sx={{width: '95%', mb: 1, display: 'flex', flexDirection: 'row', padding: '8px', backgroundColor: '#283f57'}}>
            <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', width: '50%'}}>
                {noLegalBalls ? 
                <Tooltip 
                    title={
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>The currently selected ball scope leaves no legal ball combinations for this pokemon.</Typography>
                            <Typography sx={{fontSize: '12px', textAlign: 'center', my: 1.5}}>
                                {
                                `Legal Ball Combinations: 
                                    ${option1.legalBalls.map((ball, idx) => 
                                        ball === 'apriball' ? 
                                        idx === 0 ? 'Apriballs' : ' Apriballs' : 
                                        idx === 0 ? capitalizeFirstLetter(ball) : ` ${capitalizeFirstLetter(ball)}`)
                                    }
                                `
                                }
                            </Typography>
                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Enable any of these balls to include this pokemon</Typography>
                        </Box>
                    } 
                    describeChild 
                    placement='top' 
                    arrow
                >
                    <Item sx={{padding: '5%', width: '50%', backgroundColor: '#283f57', position: 'relative', ':hover': {cursor: 'pointer'}, opacity: 0.5}}>
                        <Typography sx={{fontSize: '10px'}}>#{option1.natDexNum}</Typography>
                        <Typography sx={{fontSize: '12px'}}>{option1.name}</Typography>
                        <ImgData type='poke' linkKey={option1.imgLink}/>
                        <Box sx={{position: 'absolute', top: '80%', display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                            <Typography sx={{fontSize: '10px'}}>
                                No Legal Balls
                            </Typography>
                        </Box>
                    </Item>
                </Tooltip> :
                <ToggleButton 
                    sx={{width: '50%'}} 
                    value={option1.imgLink} 
                    selected={activePokemon.includes(option1.imgLink)}
                    onChange={(e) => handleChange(e, isBabyAdultSelection ? {...groupInfo, subGroup: `${groupInfo.subGroup}Babies`} : groupInfo, option1.imgLink, option1.name, option1.natDexNum)}
                >
                    <Item sx={{boxShadow: 'none'}}>
                        <Typography sx={{fontSize: '10px'}}>#{option1.natDexNum}</Typography>
                        <Typography sx={{fontSize: '12px'}}>{option1.name} {multipleOption2 && '(Any)'}</Typography>
                        <ImgData type='poke' linkKey={option1.imgLink}/>
                        {activePokemon.includes(option1.imgLink) &&
                        <Box sx={{position: 'absolute', top: '1%', left: '80%'}}>
                            <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                        </Box>
                        }
                    </Item>
                </ToggleButton>
                }
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'end', width: '50%', gap: 1, alignItems: 'center'}}>
                {multipleOption2 ?
                option2.map((option) => (
                    noLegalBalls ? 
                    <Tooltip 
                        title={
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>The currently selected ball scope leaves no legal ball combinations for this pokemon.</Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center', my: 1.5}}>
                                    {
                                    `Legal Ball Combinations: 
                                        ${option.legalBalls.map((ball, idx) => 
                                            ball === 'apriball' ? 
                                            idx === 0 ? 'Apriballs' : ' Apriballs' : 
                                            idx === 0 ? capitalizeFirstLetter(ball) : ` ${capitalizeFirstLetter(ball)}`)
                                        }
                                    `
                                    }
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Enable any of these balls to include this pokemon</Typography>
                            </Box>
                        } 
                        describeChild 
                        placement='top' 
                        arrow
                        key={`${option.imgLink}-selection`}
                    >
                        <Item sx={{padding: '5%', width: '90%',  height: '90%', backgroundColor: '#283f57', position: 'relative', ':hover': {cursor: 'pointer'}, opacity: 0.5}}>
                            <Typography sx={{fontSize: '10px'}}>#{option.natDexNum}</Typography>
                            <Typography sx={{fontSize: '12px'}}>{option.name}</Typography>
                            <ImgData type='poke' linkKey={option.imgLink}/>
                            <Box sx={{position: 'absolute', top: '80%', display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '10px'}}>
                                    No Legal Balls
                                </Typography>
                            </Box>
                        </Item>
                    </Tooltip> :
                    <ToggleButton 
                        key={`${option.imgLink}-selection`}
                        value={option.imgLink} 
                        selected={activePokemon.includes(option.imgLink)}
                        onChange={(e) => handleChange(e, groupInfo, option.imgLink, option.name, option.natDexNum)}
                    >
                        <Item sx={{boxShadow: 'none'}}>
                            <Typography sx={{fontSize: '10px'}}>#{option.natDexNum}</Typography>
                            <Typography sx={{fontSize: '12px'}}>{option.name}</Typography>
                            <ImgData type='poke' linkKey={option.imgLink}/>
                            {activePokemon.includes(option.imgLink) &&
                            <Box sx={{position: 'absolute', top: '0%', left: '80%'}}>
                                <ImgData type='icons' linkKey='greencheckmark' size='12px'/>
                            </Box>
                            }
                        </Item>
                    </ToggleButton>
                )) :
                noLegalBalls ?
                <Tooltip 
                    title={
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>The currently selected ball scope leaves no legal ball combinations for this pokemon.</Typography>
                            <Typography sx={{fontSize: '12px', textAlign: 'center', my: 1.5}}>
                                {
                                `Legal Ball Combinations: 
                                    ${option2.legalBalls.map((ball, idx) => 
                                        ball === 'apriball' ? 
                                        idx === 0 ? 'Apriballs' : ' Apriballs' : 
                                        idx === 0 ? capitalizeFirstLetter(ball) : ` ${capitalizeFirstLetter(ball)}`)
                                    }
                                `
                                }
                            </Typography>
                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Enable any of these balls to include this pokemon</Typography>
                        </Box>
                    } 
                    describeChild 
                    placement='top' 
                    arrow
                >
                    <Item sx={{padding: '5%', width: '50%', backgroundColor: '#283f57', position: 'relative', ':hover': {cursor: 'pointer'}, opacity: 0.5}}>
                        <Typography sx={{fontSize: '10px'}}>#{option2.natDexNum}</Typography>
                        <Typography sx={{fontSize: '12px'}}>{option2.name}</Typography>
                        <ImgData type='poke' linkKey={option2.imgLink}/>
                        <Box sx={{position: 'absolute', top: '80%', display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                            <Typography sx={{fontSize: '10px'}}>
                                No Legal Balls
                            </Typography>
                        </Box>
                    </Item>
                </Tooltip> :
                <ToggleButton 
                    sx={{width: '50%'}} 
                    value={option2.imgLink} 
                    selected={activePokemon.includes(option2.imgLink)}
                    onChange={(e) => handleChange(e, isBabyAdultSelection ? {...groupInfo, subGroup: `${groupInfo.subGroup}Adults`} : groupInfo, option2.imgLink, option2.name, option2.natDexNum)}
                >
                    <Item sx={{boxShadow: 'none'}}>
                        <Typography sx={{fontSize: '10px'}}>#{option2.natDexNum}</Typography>
                        <Typography sx={{fontSize: '12px'}}>{option2.name}</Typography>
                        <ImgData type='poke' linkKey={option2.imgLink}/>
                        {activePokemon.includes(option2.imgLink) &&
                        <Box sx={{position: 'absolute', top: '1%', left: '80%'}}>
                            <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                        </Box>
                        }
                    </Item>
                </ToggleButton>
                }
            </Box>
        </Item>
    )
}

export default function PokemonGroupDisplay({totalPokemon, activePokemon, ballScope, isInterchangeableAltFormSelection, groupInfo, handleChange}) {
    const isBabyAdultSelection = !Array.isArray(totalPokemon)
    const fullBabyData = isBabyAdultSelection && {
        total: totalPokemon.babies,
        active: activePokemon.babies
    }
    const fullAdultData = isBabyAdultSelection && {
        total: totalPokemon.adults,
        active: activePokemon.adults
    }

    const reOrderedInterchangeableSel = isInterchangeableAltFormSelection && totalPokemon.filter((mon) => !(mon.name.includes('(')))

    const interchangeableOtherOpts = {}
    if (isInterchangeableAltFormSelection) {
        reOrderedInterchangeableSel.forEach(uniqueMon => {
            const otherOpts = totalPokemon.filter(mon => (mon.imgLink.includes(uniqueMon.imgLink)) && mon.imgLink !== uniqueMon.imgLink)
            interchangeableOtherOpts[uniqueMon.imgLink] = otherOpts
        })
    }
   
    // const setItemContent = ()

    return (
        (isBabyAdultSelection || isInterchangeableAltFormSelection) ? 
        <Virtuoso
            style={{height: '300px', width: '100%', display: 'flex', alignItems: 'center'}}
            totalCount={isBabyAdultSelection ? totalPokemon.babies.length : reOrderedInterchangeableSel.length}
            itemContent={(index) => 
                isBabyAdultSelection ? 
                generateOneOrOtherContent(totalPokemon.babies[index], totalPokemon.adults[index], [...fullBabyData.active, ...fullAdultData.active], handleChange, true, groupInfo, ballScope) : 
                generateOneOrOtherContent(reOrderedInterchangeableSel[index], interchangeableOtherOpts[reOrderedInterchangeableSel[index].imgLink], activePokemon, handleChange, false, groupInfo, ballScope)}
        /> :
        <VirtuosoGrid
            style={{ height: '300px', width: '100%', overflowY: 'scroll' }}
            totalCount={totalPokemon.length}
            components={gridComponents}
            itemContent={(index) => {
                const noLegalBalls = !totalPokemon[index].legalBalls.map(ball => (
                    ball === 'apriball' ?
                    apriballLiterals.map(b => ballScope.includes(b)).includes(true) : 
                    ballScope.includes(ball)
                )).includes(true)
                return (
                    <>
                    {noLegalBalls ? 
                    <Tooltip 
                        title={
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>The currently selected ball scope leaves no legal ball combinations for this pokemon.</Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center', my: 1.5}}>
                                    {
                                    `Legal Ball Combinations: 
                                        ${totalPokemon[index].legalBalls.map((ball, idx) => 
                                            ball === 'apriball' ? 
                                            idx === 0 ? 'Apriballs' : ' Apriballs' : 
                                            idx === 0 ? capitalizeFirstLetter(ball) : ` ${capitalizeFirstLetter(ball)}`)
                                        }
                                    `
                                    }
                                </Typography>
                                <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Enable any of these balls to include this pokemon</Typography>
                            </Box>
                        } 
                        describeChild 
                        placement='top' 
                        arrow
                    >
                        <Item sx={{padding: '5%', width: '90%',  height: '90%', backgroundColor: '#283f57', position: 'relative', ':hover': {cursor: 'pointer'}, opacity: 0.5}}>
                            <Typography sx={{fontSize: '10px'}}>#{totalPokemon[index].natDexNum}</Typography>
                            <Typography sx={{fontSize: '12px'}}>{totalPokemon[index].name}</Typography>
                            <ImgData type='poke' linkKey={totalPokemon[index].imgLink}/>
                            <Box sx={{position: 'absolute', top: '80%', display: 'flex', flexDirection: 'row', width: '90%', alignItems: 'center', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '10px'}}>
                                    No Legal Balls
                                </Typography>
                            </Box>
                        </Item>
                    </Tooltip> :
                    <ToggleButton 
                        sx={{width: '100%', zIndex: 100, position: 'relative'}} 
                        value={totalPokemon[index].imgLink} 
                        selected={activePokemon.includes(totalPokemon[index].imgLink)} 
                        onChange={(e) => handleChange(e, groupInfo, totalPokemon[index].imgLink, totalPokemon[index].name, totalPokemon[index].natDexNum)}
                    >
                            <Item sx={{padding: '5%', width: '90%', backgroundColor: '#283f57', position: 'relative', zIndex: -1}}>
                                <Typography sx={{fontSize: '10px'}}>#{totalPokemon[index].natDexNum}</Typography>
                                <Typography sx={{fontSize: '12px'}}>{totalPokemon[index].name}</Typography>
                                <ImgData type='poke' linkKey={totalPokemon[index].imgLink}/>
                                {activePokemon.includes(totalPokemon[index].imgLink) &&
                                <Box sx={{position: 'absolute', top: '1%', left: '80%'}}>
                                    <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                                </Box>
                                }
                            </Item>
                    </ToggleButton>
                    }
                    </>
                )
            }}
        />
        // <></>
    )
}