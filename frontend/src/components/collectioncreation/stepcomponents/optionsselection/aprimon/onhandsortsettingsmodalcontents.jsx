import {Box, Typography, Select, MenuItem, ToggleButton, Button, useTheme, Grid} from '@mui/material'
import { useState } from 'react'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { sortOnHandList } from '../../../../../../common/sortingfunctions/onhandsorting.mjs'
import Header from '../../../../titlecomponents/subcomponents/header'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import SmallWidthModalWrapper from '../../../../partials/wrappers/smallwidthmodalwrapper'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

export default function OnHandSortSettingsModalContents({elementBg, onhandSortSettings, totalBalls, tentativeBallOrder, handleChange, handleBallOrderChange, changingOptions, changeOptionsSave, renderReorder, saveErrorNoticeShow, reorderActive, sw}) {
    const [seePreview, setSeePreview] = useState(false)
    const theme = useTheme()

    const totalBallsIncludesBall = (ball) => {
        return totalBalls.includes(ball) ? ball : totalBalls[Math.floor(Math.random()*totalBalls.length)-1]
    }

    const exampleList = [
        {name: 'Bulbasaur', natDexNum: 1, imgLink: '001', ball: totalBallsIncludesBall('moon')},
        {name: 'Bulbasaur', natDexNum: 1, imgLink: '001', ball: totalBallsIncludesBall('dream')},
        {name: 'Rattata', natDexNum: 19, imgLink: '019', ball: totalBallsIncludesBall('safari')},
        {name: 'Galarian Ponyta', natDexNum: 77, imgLink: '077-g', ball: totalBallsIncludesBall('dream')},
        {name: 'Tauros', natDexNum: 128, imgLink: '128', ball: totalBallsIncludesBall('sport')},
        {name: 'Paldean Tauros', natDexNum: 128, imgLink: '128-p', ball: totalBallsIncludesBall('sport')},
        {name: 'Lapras', natDexNum: 131, imgLink: '131', ball: totalBallsIncludesBall('moon')},
        {name: 'Aipom', natDexNum: 190, imgLink: '190', ball: totalBallsIncludesBall('fast')},
        {name: 'Roselia', natDexNum: 315, imgLink: '315', ball: totalBallsIncludesBall('lure')},
        {name: 'Piplup', natDexNum: 393, imgLink: '393', ball: totalBallsIncludesBall('love')},
        {name: 'Zorua', natDexNum: 570, imgLink: '570', ball: totalBallsIncludesBall('level')},
        {name: 'Hisuian Zorua', natDexNum: 570, imgLink: '570-h', ball: totalBallsIncludesBall('friend')},
        {name: 'Flabébé (Red)', natDexNum: 669, imgLink: '669-r', ball: totalBallsIncludesBall('friend')},
        {name: 'Inkay', natDexNum: 686, imgLink: '686', ball: totalBallsIncludesBall('love')},
        {name: 'Litten', natDexNum: 725, imgLink: '725', ball: totalBallsIncludesBall('friend')},
        {name: 'Wimpod', natDexNum: 767, imgLink: '767', ball: totalBallsIncludesBall('beast')},
        {name: 'Milcery', natDexNum: 868, imgLink: '868', ball: totalBallsIncludesBall('heavy')},
        {name: 'Milcery', natDexNum: 868, imgLink: '868', ball: totalBallsIncludesBall('beast')},
        {name: 'Milcery', natDexNum: 868, imgLink: '868', ball: totalBallsIncludesBall('safari')},
        {name: 'Milcery', natDexNum: 868, imgLink: '868', ball: totalBallsIncludesBall('lure')},
    ]
    const sortedExampleList = sortOnHandList(onhandSortSettings.sortFirstBy, onhandSortSettings.default, tentativeBallOrder, exampleList)
    const listPokemonSelect = (index) => {
        const pokemon = sortedExampleList[index]
        return (
            <>
            <Box 
                sx={{
                    display: 'flex',  
                    alignItems: 'center', 
                    backgroundColor: '#283f57',
                    borderRadius: '10px', 
                    marginBottom: '3px', 
                    marginTop: '3px'
                }}
            >
                <Box sx={{height: '100%', width: sw ? '9%' : '7%', mx: 1}}>
                    <ImgData linkKey={pokemon.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: sw ? '11%' : '8%'}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemon.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: sw ? '40%' : '35%'}}>
                    <Typography sx={{fontSize: '12px'}}>{pokemon.name}</Typography>
                </Box>
                <Box sx={{height: '100%', width: sw ? '20%' : '40%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: sw ? 2 : 4}}>
                    <ImgData type='ball' linkKey={pokemon.ball}/>
                    <Typography sx={{fontSize: '12px', width: '20%', ml: 2}}>{capitalizeFirstLetter(pokemon.ball)}</Typography>
                </Box>
            </Box> 
            </>
        )
    }

    const disabledSelections = reorderActive === false ? {pointerEvents: 'none', opacity: 0.5} : {}
    const totalBallsFirstHalf = sw && totalBalls.filter((b, idx) => idx <= totalBalls.length/2)
    const totalBallsSecondHalf = sw && totalBalls.filter((b, idx) => idx > totalBalls.length/2)
    const sortingDisplays = {
        'NatDexNumL2H': 'Dex # - Lowest to Highest',
        'NatDexNumH2L': 'Dex # - Highest to Lowest',
        'A2Z': 'Name - A to Z',
        'Z2A': 'Name - Z to A'
    }

    return (
        <>
        {changingOptions && 
            <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
                <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'main')}>Collection Options</Button>
                <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
                <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'sorting')}>Sorting Options</Button>
                <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
                <Typography sx={{color: 'white', fontWeight: 700, mx: 1, textAlign: 'center'}}>On-Hand Sorting</Typography>
            </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: changingOptions ? '5%' : '9%'}}>
            <Header additionalStyles={changingOptions ? {py: 0.5, fontSize: sw ? '20px' : '24px'} : {fontSize: sw ? '20px' : '24px'}}>On-Hand Sorting Settings</Header>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: sw ? '50%' : changingOptions ? '35%' : '31%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {changingOptions &&
                renderReorder()
            }
            <Box sx={{width: '90%', height: '35%', display: 'flex', flexDirection: 'row', ...disabledSelections}}>
                <Box sx={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                    <Typography sx={{fontSize: '14px', marginRight: 2}}>Sort Pokemon By:</Typography>
                    <Select 
                        value={onhandSortSettings.default}
                        sx={{'&.MuiInputBase-root': {width: sw ? '95%' : '70%'}, '& .MuiSelect-select': {fontSize: '12px', color: 'white'}}}
                        size='small'
                        onChange={(e, newVal) => handleChange('default', newVal.props.value, 'onhand')}
                    >
                        <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                        <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                        <MenuItem value='A2Z'>Name - A to Z</MenuItem>
                        <MenuItem value='Z2A'>Name - Z to A</MenuItem>
                    </Select>
                </Box>
                <Box sx={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                    <Typography sx={{fontSize: '14px', marginRight: 2}}>Sort First By:</Typography>
                    <Select 
                        value={onhandSortSettings.sortFirstBy}
                        sx={{'&.MuiInputBase-root': {width: sw ? '90%' : '70%'}, '& .MuiSelect-select': {fontSize: '12px', color: 'white'}}}
                        size='small'
                        onChange={(e, newVal) => handleChange('sortFirstBy', newVal.props.value, 'onhand')}
                    >
                        <MenuItem value='pokemon'>Pokemon</MenuItem>
                        <MenuItem value='ball'>Ball</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Box sx={{width: '90%', height: sw ? '85%' : '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0.5, ...disabledSelections}}>
                <Box sx={{width: '40%', height: '15%', display: 'flex', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '14px'}}>Sort Ball Order:</Typography>
                </Box>
                <Box sx={{width: sw ? '80%' : '60%', height: sw ? '85%' : '100%', display: 'flex', justifyContent: 'center', flexDirection: sw ? 'column' : 'row', gap: sw ? 1 : 0}}>
                    {!sw && totalBalls.map((ball) => {
                        return (
                            <ToggleButton 
                                key={`onhand-sort-order-select-${ball}-ball`} 
                                value={ball}
                                selected={onhandSortSettings.ballOrder.includes(ball)}
                                onChange={(e, newBall) => handleBallOrderChange(newBall)}
                                sx={{padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'end', mx: 0.2, position: 'relative', textTransform: 'none', '&.Mui-selected': {backgroundColor: 'rgb(40, 63, 87)'}}}
                            >
                                {onhandSortSettings.ballOrder.includes(ball) && 
                                <Typography 
                                    sx={{
                                        fontSize: '14px', 
                                        position: 'absolute',
                                        top: '-3px', 
                                        fontWeight: 700,
                                        color: 'white'
                                    }}
                                    >
                                        {onhandSortSettings.ballOrder.indexOf(ball) + 1}
                                </Typography>
                                }
                                <Typography 
                                    sx={{
                                        fontSize: '10px', 
                                        position: 'absolute',
                                        top: '15px',
                                        color: 'white'
                                    }}
                                    >
                                    {capitalizeFirstLetter(ball)}
                                </Typography>
                                <ImgData type='ball' linkKey={ball}/>
                            </ToggleButton>
                        )
                    })}
                    {sw && 
                    <>
                        <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50%'}}>
                        {totalBallsFirstHalf.map((ball) => {
                        return (
                            <ToggleButton 
                                key={`onhand-sort-order-select-${ball}-ball`} 
                                value={ball}
                                selected={onhandSortSettings.ballOrder.includes(ball)}
                                onChange={(e, newBall) => handleBallOrderChange(newBall)}
                                sx={{padding: 0, px: '3%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', mx: 0.2, position: 'relative', textTransform: 'none', '&.Mui-selected': {backgroundColor: 'rgb(40, 63, 87)'}}}
                            >
                                {onhandSortSettings.ballOrder.includes(ball) && 
                                <Typography 
                                    sx={{
                                        fontSize: '14px', 
                                        position: 'absolute',
                                        top: '-3px', 
                                        fontWeight: 700,
                                        color: 'white'
                                    }}
                                    >
                                        {onhandSortSettings.ballOrder.indexOf(ball) + 1}
                                </Typography>
                                }
                                <Typography 
                                    sx={{
                                        fontSize: '10px', 
                                        position: 'absolute',
                                        top: '15px',
                                        color: 'white'
                                    }}
                                    >
                                    {capitalizeFirstLetter(ball)}
                                </Typography>
                                <ImgData type='ball' linkKey={ball}/>
                            </ToggleButton>
                        )
                        })}
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50%'}}>
                            {totalBallsSecondHalf.map((ball) => {
                                return (
                                    <ToggleButton 
                                        key={`onhand-sort-order-select-${ball}-ball`} 
                                        value={ball}
                                        selected={onhandSortSettings.ballOrder.includes(ball)}
                                        onChange={(e, newBall) => handleBallOrderChange(newBall)}
                                        sx={{padding: 0, px: '3%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'end', mx: 0.2, position: 'relative', textTransform: 'none', '&.Mui-selected': {backgroundColor: 'rgb(40, 63, 87)'}}}
                                    >
                                        {onhandSortSettings.ballOrder.includes(ball) && 
                                        <Typography 
                                            sx={{
                                                fontSize: '14px', 
                                                position: 'absolute',
                                                top: '-3px', 
                                                fontWeight: 700,
                                                color: 'white'
                                            }}
                                            >
                                                {onhandSortSettings.ballOrder.indexOf(ball) + 1}
                                        </Typography>
                                        }
                                        <Typography 
                                            sx={{
                                                fontSize: '10px', 
                                                position: 'absolute',
                                                top: '15px',
                                                color: 'white'
                                            }}
                                            >
                                            {capitalizeFirstLetter(ball)}
                                        </Typography>
                                        <ImgData type='ball' linkKey={ball}/>
                                    </ToggleButton>
                                )
                            })}
                        </Box>
                    </>
                    }
                </Box>
                <Box sx={{width: '80%', height: '25%', display: 'flex', justifyContent: 'center', ...disabledSelections}}>
                    <Typography sx={{fontSize: sw ? '11px' : '12px', textAlign: 'center'}}>Note: Unselected balls will be ordered the way above from left to right</Typography>
                </Box>
            </Box>
        </Box>
        {sw ? 
        <Box sx={{...elementBg, width: '95%', height: '30%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <Button variant='contained' size='large' sx={{mt: 1, ...disabledSelections}} onClick={() => setSeePreview(!seePreview)}>See Preview</Button>
            <Typography sx={{textAlign: 'center', fontSize: '11px', ...disabledSelections}}>Previews give you an idea of how a list of on-hands will look like with your chosen settings. It is just an example; it is not your on-hand list, nor does it necessarily follow the gen's legality.</Typography>
        </Box> : 
        <Box sx={{...elementBg, width: '95%', height: '50%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography sx={{fontSize: '20px', fontWeight: 700, ...disabledSelections}}>Live Preview:</Typography>
            <Typography sx={{fontSize: '12px', textAlign: 'center', ...disabledSelections}}>See a preview of how the sorting settings would sort the list. This is just an example; it is not your on-hand list, nor does it necessarily follow the gen's legality.</Typography>
            <SpeciesSelect
                listItemContent={listPokemonSelect}
                totalCount={sortedExampleList.length}
                height='80%'
                onlyList={true}
                otherStyles={{width: '95%', mt: 1, ...disabledSelections}}
                customScroller={false}
            />
        </Box>}
        {changingOptions &&
            <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
                <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeOptionsSave(false, 'exit')}>Exit</Button>
                </Box>
                <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeOptionsSave(true, 'sorting')}>Save</Button>
                </Box>
                {saveErrorNoticeShow && 
                <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                    <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                        No changes were made!
                    </Typography>
                </Box>
                }
            </Box>
        }
        {sw &&
        <SmallWidthModalWrapper
            ariaLabel={'on-hand sorting preview'}
            ariaDescribe={'see a preview of your chosen on=hand sorting settings'}
            open={seePreview}
            handleClose={() => setSeePreview(!seePreview)}
            buttonSx={{zIndex: 5}}
        >
            <Box sx={{...elementBg, width: '95%', height: '90%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '5%', mt: 4}}>
                    <Typography sx={{mr: 3, width: '40%', textAlign: 'end', fontSize: '12px'}}>Sort Pokemon By:</Typography>
                    <Typography sx={{width: '60%', fontSize: '12px'}}>{sortingDisplays[onhandSortSettings.default]}</Typography>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '5%', mb: 1}}>
                    <Typography sx={{mr: 3, width: '40%', textAlign: 'end', fontSize: '12px'}}>Sort First By:</Typography>
                    <Typography sx={{width: '60%', fontSize: '12px'}}>{onhandSortSettings.sortFirstBy === 'pokemon' ? 'Pokemon' : 'Ball'}</Typography>    
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '25%', mb: 1}}>
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}>Ball Sort Order:</Typography>
                    <Grid container sx={{...theme.components.box.fullCenterRow}}>
                        {tentativeBallOrder.map(ball => {
                            return (
                                <Grid
                                    item
                                    xs={1.5}
                                    key={`onhand-sort-order-select-${ball}-ball-preview`} 
                                    sx={{...theme.components.box.fullCenterCol, height: '60px', justifyContent: 'end', mx: 0.2, my: 0.25, position: 'relative', textTransform: 'none', border: '1px solid white', borderRadius: '10px'}}
                                >
                                    <Typography 
                                        sx={{
                                            fontSize: '14px', 
                                            position: 'absolute',
                                            top: '-3px', 
                                            fontWeight: 700,
                                            color: 'white'
                                        }}
                                        >
                                            {tentativeBallOrder.indexOf(ball) + 1}
                                    </Typography>
                                    <Typography 
                                        sx={{
                                            fontSize: '10px', 
                                            position: 'absolute',
                                            top: '15px',
                                            color: 'white'
                                        }}
                                        >
                                        {capitalizeFirstLetter(ball)}
                                    </Typography>
                                    <ImgData type='ball' linkKey={ball}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Box>
                <SpeciesSelect
                    listItemContent={listPokemonSelect}
                    totalCount={sortedExampleList.length}
                    height='60%'
                    onlyList={true}
                    otherStyles={{width: '95%', mt: 1, ...disabledSelections}}
                    customScroller={false}
                />
            </Box>
            <Box sx={{...elementBg, width: '95%', height: '8%', my: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <Button onClick={() => setSeePreview(!seePreview)}><KeyboardBackspaceIcon/> Go Back</Button>
            </Box>
        </SmallWidthModalWrapper>
        }
        </>
    )
}