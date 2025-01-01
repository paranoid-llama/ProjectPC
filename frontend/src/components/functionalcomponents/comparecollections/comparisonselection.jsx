import {Box, Typography, useTheme, ToggleButton, Checkbox, Button, CircularProgress, Tooltip} from '@mui/material'
import modalStyles from '../../../../utils/styles/componentstyles/modalstyles'
import HelpIcon from '@mui/icons-material/Help';
import hexToRgba from 'hex-to-rgba'
import { useSelector } from 'react-redux';
import { selectScreenBreakpoint } from '../../../app/selectors/windowsizeselectors';

export default function ComparisonSelection({dataState, changeCollection, changeOption, tradeableCollections, collectionOwnerUsername, oneHomeCollection, changeScreen, isPending, optionType, changeOptionType, externalSelectedCol, extCantChangeSelected, sw}) {
    const theme = useTheme()
    const trueSelectedCol = externalSelectedCol !== undefined ? externalSelectedCol : dataState.selectedCol
    const compBp = useSelector(state => selectScreenBreakpoint(state, 'compareDisplayMod'))

    const disabledEMs = oneHomeCollection
    const disabledStyles = disabledEMs ? {opacity: 0.5, pointerEvents: 'none'} : {}

    return (
        <>
        <Box sx={{...modalStyles.onhand.modalElementBg, height: '8%', width: '95%', mt: sw ? 0.5 : 0}}>
            <Typography sx={{...modalStyles.onhand.modalTitle, width: '100%', textAlign: 'center', mt: 1}}>Compare Collections</Typography>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, height: '42%', width: '95%', mt: 1, ...theme.components.box.fullCenterCol}}>
            <Typography sx={{fontWeight: 700, fontSize: '14px', mb: 1, textAlign: 'center'}}>Select which of your collections you want to compare with:</Typography>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: sw ? '90%' : '80%', height: '80%', gap: 0.5}}>
                {tradeableCollections.map((col) => {
                    const subType = isNaN(parseInt(col.gen)) ? col.gen.toUpperCase() : `Gen ${col.gen}`
                    const disabledButton = extCantChangeSelected && !(trueSelectedCol === col._id)
                    return (
                        <ToggleButton 
                            key={`visitor-user-${subType}-collection-selection`}
                            value={col._id} 
                            onChange={extCantChangeSelected ? null : (e, newVal) => changeCollection(newVal)}
                            selected={trueSelectedCol === col._id} 
                            disabled={disabledButton}
                            sx={{
                                width: sw ? '90%' : '80%', 
                                color: 'white', 
                                '&.MuiButtonBase-root': {
                                    borderColor: theme.palette.color3.main
                                },
                                '&.Mui-selected': {
                                    color: 'white',
                                    backgroundColor: theme.palette.color1.main,
                                    '&:hover': {
                                        backgroundColor: hexToRgba(theme.palette.color1.main, 0.8)
                                    }
                                }
                            }}
                        >
                            {subType} {col.type} Collection
                        </ToggleButton>
                    )
                })}
            </Box>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, height: '40%', width: '95%', mt: 1, ...theme.components.box.fullCenterCol, position: 'relative'}}>
            <Typography sx={{fontWeight: 700, fontSize: '14px', mb: 1}}>Comparison Options</Typography>
            {optionType === 'basic' &&
            <>
            <Typography sx={{fontSize: '12px', mb: 1}}>Only compare the pokemon in the list with:</Typography>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: sw ? '100%' : '80%', height: '75%', gap: 0.5}}>
                <Box sx={{...theme.components.box.fullCenterRow, borderBottom: '1px solid white', height: '25%', width: '100%'}}>
                    <Box sx={{width: '40%', height: '100%', borderRight: '1px solid white'}}></Box>
                    <Box sx={{width: '25%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Typography sx={{textAlign: 'center'}}>Your List</Typography></Box>
                    <Box sx={{width: '35%', height: '100%', ...theme.components.box.fullCenterCol}}><Typography sx={{textAlign: 'center'}}>{collectionOwnerUsername}'s List</Typography></Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, borderBottom: '1px solid white', height: '25%', width: '100%'}}>
                    <Box sx={{width: '40%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Typography sx={{textAlign: 'center'}}>Hidden Abilities<br/>(if applicable)</Typography></Box>
                    <Box sx={{width: '25%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={dataState.options.userList.ha} onChange={() => changeOption('userList', 'ha')}/></Box>
                    <Box sx={{width: '35%', height: '100%', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={dataState.options.ownerList.ha} onChange={() => changeOption('ownerList', 'ha')}/></Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, borderBottom: disabledEMs ? '' : '1px solid white', height: '25%', width: '100%', ...disabledStyles}}>
                    <Box sx={{width: '40%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Typography sx={{textAlign: 'center'}}>Max Egg Moves<br/>(if applicable)</Typography></Box>
                    <Box sx={{width: '25%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={disabledEMs ? false : dataState.options.userList.em} onChange={() => changeOption('userList', 'em')}/></Box>
                    <Box sx={{width: '35%', height: '100%', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={disabledEMs ? false : dataState.options.ownerList.em} onChange={() => changeOption('ownerList', 'em')}/></Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, height: '25%', width: '100%', borderTop: disabledEMs ? '1px solid white' : ''}}>
                    <Box sx={{width: '40%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Typography sx={{textAlign: 'center'}}>On-Hand Pokemon</Typography></Box>
                    <Box sx={{width: '25%', height: '100%', borderRight: '1px solid white', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={dataState.options.userList.onhand} onChange={() => changeOption('userList', 'onhand')}/></Box>
                    <Box sx={{width: '35%', height: '100%', ...theme.components.box.fullCenterCol}}><Checkbox sx={{color: 'white'}} checked={dataState.options.ownerList.onhand} onChange={() => changeOption('ownerList', 'onhand')}/></Box>
                </Box>
            </Box>
            </>}
            {optionType === 'advanced' &&
                <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: sw ? '100%' : '70%', height: '75%', gap: 0.5}}>
                    <Box sx={{...theme.components.box.fullCenterRow, height: '100%', width: '90%', gap: 0.5}}>
                        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: sw ? compBp === 'md' ? '71%' : compBp === 'sm' ? '85%' : '50%' : '100%', height: '100%', gap: 0.5}}>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '20%', width: '100%'}}>
                                <Box sx={{position: 'relative'}}>
                                    <Typography sx={{fontSize: sw ? '14px' : '16px'}}>Equalize baby/adult pokemon:</Typography>
                                    <Tooltip title='This compares babies to their adult versions if the baby is available in one collection and the adult in the other.'>
                                        <Box sx={{position: 'absolute', bottom: '50%', left: '99%', cursor: 'pointer'}}>
                                            <HelpIcon sx={{fontSize: '12px'}}/>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '20%', width: '100%'}}><Typography sx={{fontSize: sw ? '14px' : '16px'}}>Include Legendary Pokemon:</Typography></Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '20%', width: '100%'}}><Typography sx={{fontSize: sw ? '14px' : '16px'}}>Include Non-Breedable Pokemon:</Typography></Box>
                            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', height: '20%', width: '100%'}}><Typography sx={{fontSize: sw ? '14px' : '16px'}}>Include Evolved Regional Pokemon:</Typography></Box>
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: sw ? '10%' : '30%', height: '100%', gap: 0.5}}>
                            <Checkbox checked={dataState.advancedOptions.equalizeBabyAdults} onChange={() => changeOption('adv', 'equalizeBabyAdults')} sx={{height: '20%', color: 'white', ml: 2}}/>
                            <Checkbox checked={dataState.advancedOptions.legendary} onChange={() => changeOption('adv', 'legendary')} sx={{height: '20%', color: 'white', ml: 2}}/>
                            <Checkbox checked={dataState.advancedOptions.nonBreedable} onChange={() => changeOption('adv', 'nonBreedable')} sx={{height: '20%', color: 'white', ml: 2}}/>
                            <Checkbox checked={dataState.advancedOptions.evolvedRegional} onChange={() => changeOption('adv', 'evolvedRegional')} sx={{height: '20%', color: 'white', ml: 2}}/>
                        </Box>
                    </Box>
                </Box>
            }
            <Button onClick={changeOptionType} sx={{position: 'absolute', top: '2px', right: '2px', fontSize: sw ? '11px' : '12px', width: sw ? '75px' : 'auto'}} size='small'>{optionType === 'basic' ? 'Advanced' : 'Basic'} Options</Button>
        </Box>
        <Box sx={{...modalStyles.onhand.modalElementBg, height: '6%', width: '95%', mb: sw ? 0.5 : 0, mt: 1, ...theme.components.box.fullCenterCol}}>
            <Button variant='contained' size='small' onClick={isPending ? null : () => changeScreen('comparison')}>{isPending ? <CircularProgress sx={{color: 'white'}} size='24px'/> : 'Compare Collections'}</Button>
        </Box>
        </>
    )
}