import {Box, Typography, Modal, Fade, Backdrop, Select, MenuItem, ToggleButton} from '@mui/material'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'
import Header from '../../../../titlecomponents/subcomponents/header'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import { apriballs, getBallsInGen } from '../../../../../infoconstants'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import { sortByDexNum, sortByName, sortOnHandList } from '../../../../../../utils/functions/sortfilterfunctions/sortingfunctions'

export default function OnHandSortSettingsModal({onhandSortSettings, open, closeModal, handleBallOrderChange, totalBalls, tentativeBallOrder, handleChange}) {

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
                <Box sx={{height: '100%', width: '7%', mx: 1}}>
                    <ImgData linkKey={pokemon.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: '8%'}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemon.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '35%'}}>
                    <Typography sx={{fontSize: '12px'}}>{pokemon.name}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '40%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: 4}}>
                    <ImgData type='ball' linkKey={pokemon.ball}/>
                    <Typography sx={{fontSize: '12px', width: '20%', ml: 2}}>{capitalizeFirstLetter(pokemon.ball)}</Typography>
                </Box>
            </Box> 
            </>
        )
    }

    return (
        <Modal 
            aria-labelledby='on-hand-sort-settings'
            aria-describedby="select the autosort settings for the onhand list"
            open={open}
            onClose={() => closeModal('onhandSortSettings')}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '9%'}}>
                        <Header>On-Hand Sorting Settings</Header>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '31%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Box sx={{width: '90%', height: '35%', display: 'flex', flexDirection: 'row'}}>
                            <Box sx={{width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                                <Typography sx={{fontSize: '14px', marginRight: 2}}>Sort Pokemon By:</Typography>
                                <Select 
                                    value={onhandSortSettings.default}
                                    sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px', color: 'white'}}}
                                    size='small'
                                    onChange={(e, newVal) => handleChange(e, 'onhand', 'default', newVal.props.value)}
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
                                    sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px', color: 'white'}}}
                                    size='small'
                                    onChange={(e, newVal) => handleChange(e, 'onhand', 'sortFirstBy', newVal.props.value)}
                                >
                                    <MenuItem value='pokemon'>Pokemon</MenuItem>
                                    <MenuItem value='ball'>Ball</MenuItem>
                                </Select>
                            </Box>
                        </Box>
                        <Box sx={{width: '90%', height: '65%', display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0.5}}>
                            <Box sx={{width: '40%', height: '15%', display: 'flex', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '14px'}}>Sort Ball Order:</Typography>
                            </Box>
                            <Box sx={{width: '80%', height: '50%', display: 'flex', justifyContent: 'center'}}>
                                {totalBalls.map((ball) => {
                                    return (
                                        <ToggleButton 
                                            key={`onhand-sort-order-select-${ball}-ball`} 
                                            value={ball}
                                            selected={onhandSortSettings.ballOrder.includes(ball)}
                                            onChange={(e, newBall) => handleBallOrderChange(e, newBall)}
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
                            </Box>
                            <Box sx={{width: '80%', height: '25%', display: 'flex', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '12px'}}>Note: Unselected balls will be ordered the way above from left to right</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '50%', mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Typography sx={{fontSize: '20px', fontWeight: 700}}>Live Preview:</Typography>
                        <Typography sx={{fontSize: '12px', textAlign: 'center'}}>See a preview of how the sorting settings would sort the list. This is just an example; it is not your on-hand list, nor does it necessarily follow the gen's legality.</Typography>
                        <SpeciesSelect
                            listItemContent={listPokemonSelect}
                            totalCount={sortedExampleList.length}
                            height='80%'
                            onlyList={true}
                            otherStyles={{width: '95%', mt: 1}}
                        />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}