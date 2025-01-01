import {Box, Typography, useTheme, Grid, Button, Modal} from '@mui/material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ModalWrapper from '../../../../partials/modalwrapper'
import listStyles from '../../../../../../utils/styles/componentstyles/liststyles'
import RenderPossibleEggMoves from '../../../editsectioncomponents/eggmovecomponents/renderpossibleeggmoves'
import RenderEggMoves from '../../../editsectioncomponents/shared/rendereggmoves';
import { useSelector } from 'react-redux'

export default function SWEditEggMovesForm({EMs, maxEms, emCount, possibleEggMoves, idxOfSelectedEM, toggleClass, toggleScreen, handleEMChange}) {
    const theme = useTheme()
    const listType = useSelector((state) => state.editmode.listType)
    return (
        <>
        <style>{`
            @keyframes open-sw-egg-move-selection {
                0% {
                    right: -105%
                }
                100% {
                    right: 0px
                }
            }
            @keyframes close-sw-egg-move-selection {
                0% {
                    right: 0px
                }
                100% {
                    right: -105%
                }
            }
            .open-sw-em-selection {
                animation: 0.5s ease-out 0s 1 open-sw-egg-move-selection;
                animation-fill-mode: forwards;
            }
            .close-sw-em-selection {
                animation: 0.5s ease-in 0s 1 close-sw-egg-move-selection;
                animation-fill-mode: forwards;
            }
            .pEmClasses {
                position: absolute;
                top: 0px;
                ${toggleClass === '' ? 'right: -105%;' : ''}
            }
        `}</style>
        <Box className={`${toggleClass} pEmClasses`}>
            <Box sx={{width: '303px', height: '360px', ...theme.components.box.fullCenterRow, backgroundColor: 'rgb(150, 150, 150)', borderLeft: '1px solid black'}}>
                <Box sx={{width: '15%', height: '100%', ...theme.components.box.fullCenterCol, ':hover': {backgroundColor: 'rgb(120, 120, 120)', cursor: 'pointer'}}} onClick={() => toggleScreen('close')}>
                    <KeyboardArrowRightIcon sx={{fontSize: '60px'}}/>
                </Box>
                <Box sx={{width: '85%', height: '100%', ...theme.components.box.fullCenterCol}}>
                    <RenderPossibleEggMoves 
                        possibleEggMoves={possibleEggMoves}
                        EMs={EMs}
                        handleEMChange={handleEMChange}
                        maxEMs={maxEms}
                        isOnHandEdit={listType === 'onhand'}
                        customXs={4}
                        customSx={{my: 1}}
                    />
                    <Box sx={{width: '90%', height: '30%', py: 1, borderTop: '1px solid black', ...theme.components.box.fullCenterRow}}>
                        <RenderEggMoves emCount={emCount} EMs={EMs} maxEms={maxEms} idxOfSelectedEM={idxOfSelectedEM} changeEMScreen={true} toggleScreen={toggleScreen} handleEMChange={handleEMChange}/>
                    </Box>
                </Box>
                
            </Box>
        </Box>
        </>
    )
}