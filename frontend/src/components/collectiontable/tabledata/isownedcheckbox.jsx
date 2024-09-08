import {useLocation} from 'react-router-dom'
import {Box, TableCell, ToggleButton, ToggleButtonGroup, styled, Typography, useTheme} from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectIfPokemonIsSelected } from '../../../app/selectors/tradeselectors'
import { setSelected } from '../../../app/slices/editmode'
import { setPokemon } from '../../../app/slices/tradeoffer'
import hexToRgba from 'hex-to-rgba'
import MuiToggleButton from '@mui/material/ToggleButton'
import Checkbox from '@mui/material/Checkbox'
import ImgData from './imgdata'
import HAIndicator from './haindicator'
import EMIndicator from './emindicator'
import { noCompareWithoutOnhand } from '../../../../common/infoconstants/pokemonconstants.mjs'
import FormControlLabel from '@mui/material/FormControlLabel'
import './../../../../utils/styles/componentstyles/checkboxindicators.css'

export default function IsOwnedCheckbox({ballInfo, id, handleEditBallInfo, pokeName, ball, collectionId, ownerId, styles, isEditMode, isSelectedEditPage, isHomeCollection, isTradePage=false, tradeSide=null, tradeDispData}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const disabled = !isEditMode
    const enableSelecting = isTradePage && ballInfo[ball].isOwned === true && !noCompareWithoutOnhand.includes(pokeName)

    const idData = isTradePage && {name: pokeName, ball, onhandId: undefined}
    const isSelectedTradePage = isTradePage && useSelector((state) => selectIfPokemonIsSelected(state, tradeSide, idData))
    const tradeHoverStyles = {
        position: 'relative',
        ':hover': {
            cursor: 'pointer',
            border: `1px solid ${hexToRgba(theme.palette.color1.light, 0.75)}`
        }
    }
    const tradeSelectedStyles = (isSelectedTradePage) ? {
        backgroundColor: theme.palette.color2.darker
    } : {}
    if (isTradePage) {
        delete tradeDispData.ballData.isOwned
    }
    const localHandleChangeFunc = (enableSelecting) ? {
        onClick: () => dispatch(setPokemon({pData: tradeDispData.pData, ballData: tradeDispData.ballData, tradeSide}))
    } : {}
    const onClickFunc = isEditMode && !enableSelecting ? {
        onClick: () => dispatch(setSelected({selected: id, selectedBall: ball}))
    } : {}
    
    const hoverStyle = (enableSelecting || (isEditMode && !enableSelecting)) ? {':hover': {cursor: 'pointer'}} : {}

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: 'none'
        }
    })
    const isOwned = ballInfo[ball].isOwned 
    const hasHiddenAbility = ballInfo[ball].isHA !== undefined 
    // const haActive = hasHiddenAbility && 
    const hasEggMoves = ballInfo[ball].emCount !== undefined
    const noTopRowHAInd = isHomeCollection //home collections have egg moves disabled, which is the only reason HA would be moved to the top
    const handleHAChangeFunc = (e) => {
        handleEditBallInfo(e, 'isHA', pokeName, ball, collectionId, ownerId)
    }
    const handleEMCountChangeFunc = (e) => {
        handleEditBallInfo(e, 'emCount', pokeName, ball, collectionId, ownerId)
    }

    const renderTagIndicator = (tagType) => {
        return (
            <Typography
                sx={{
                    color: theme.palette.color3.light,
                    border: 'none',
                    position: 'absolute',
                    margin: 0,
                    padding: '2px',
                    fontWeight: 700,
                    opacity: tagType === 'highlyWanted' ? 1 : 0.5,
                    top: '-23px',
                    fontSize: '12px'
                }}
            >
                {tagType === 'highlyWanted' ? 'WANT' : 'PEND'}
            </Typography>
        )
    }

    return (
        <>
        
        <TableCell 
            padding='none' 
            sx={enableSelecting ? {...styles.tableCell, ...tradeHoverStyles, position: 'relative'} : (isTradePage && (ballInfo[ball].isOwned === false || !enableSelecting)) ? {...styles.tableCell, opacity: 0.5, position: 'relative'} : {...styles.tableCell, position: 'relative', zIndex: isSelectedEditPage ? 1 : '', ...hoverStyle}}
            {...localHandleChangeFunc}
            {...onClickFunc}
        >
            {isOwned && 
            <Box sx={styles.indicators.indicatorRowTop}>
                {/* {ballInfo[ball].isHA !== undefined && ((isTradePage && !isHomeCollection) ? 
                    <Typography sx={{position: 'absolute', color: 'white', opacity: ballInfo[ball].isHA ? 1 : 0.5, fontWeight: ballInfo[ball].isHA ? 700 : 400}}>HA</Typography> : 
                    renderHAIndicator('Top', isHomeCollection, ballInfo, ball, isEditMode, pokeName, collectionId, ownerId, disabled, handleEditBallInfo, styles))
                } */}
                {(hasHiddenAbility && !noTopRowHAInd) && 
                    <HAIndicator 
                        textOnly={isTradePage}
                        topPosition={true}
                        isEditMode={isEditMode}
                        isHAActive={ballInfo[ball].isHA}
                        handleChange={handleHAChangeFunc}
                    />
                }
            </Box>
            }
            <Box sx={{...styles.alignment.checkboxAlignment, ...styles.bodyColor, ...tradeSelectedStyles, height: '42px'}}>
                <Checkbox 
                    checked={ballInfo[ball].isOwned} 
                    sx={{color: 'white', '&.Mui-disabled': {color: 'white', '&.Mui-checked': {color: '#1976d2'}}, position: 'absolute', right: 'calc(50% - 21px)'}} 
                    disabled={disabled}
                    onClick={isEditMode ? ((e) => handleEditBallInfo(e, 'isOwned', pokeName, ball, collectionId, ownerId)) : undefined}
                />
               
                
            </Box>
            
            <Box sx={{...styles.indicators.indicatorRow, display: 'flex', width: '100%'}}> 
                {isOwned && 
                    <>
                        {hasHiddenAbility &&
                        <Box sx={{position: 'relative', width: (isHomeCollection || !hasEggMoves) ? '100%' : '40%', left: (isHomeCollection || !hasEggMoves) ? 0 : '2px', '@media only screen and (max-width: 1200px)': {width: (isHomeCollection || !hasEggMoves) ? '100%' : '0%', left: 0}}}>
                            {/* {ballInfo[ball].isHA !== undefined && (isTradePage ? 
                                <Typography sx={{position: 'absolute', bottom: '0px', color: 'white', fontSize: '14px', width: '100%',  opacity: ballInfo[ball].isHA ? 1 : 0.5, fontWeight: ballInfo[ball].isHA ? 700 : 400}}>HA</Typography> : 
                                renderHAIndicator('', isHomeCollection, ballInfo, ball, isEditMode, pokeName, collectionId, ownerId, disabled, handleEditBallInfo, styles))
                            } */}
                            
                            <HAIndicator 
                                textOnly={isTradePage}
                                isEditMode={isEditMode}
                                isHAActive={ballInfo[ball].isHA}
                                handleChange={handleHAChangeFunc}
                                noTopRow={noTopRowHAInd}
                            />
                        </Box>
                        }
                        {(hasHiddenAbility && hasEggMoves) &&
                            <Box sx={{position: 'relative', width: '20%', '@media only screen and (max-width: 1200px)': {width: '0%'}}}></Box>
                        }
                        {hasEggMoves && 
                        <Box sx={{position: 'relative', width: (isHomeCollection) ? '0%' : !hasHiddenAbility ? '100%' : '40%', right: (isHomeCollection || !hasHiddenAbility) ? 0 : '2px', '@media only screen and (max-width: 1200px)': {width: (isHomeCollection) ? '0%' : '100%', right: 0}}}>
                            {/* {ballInfo[ball].emCount !== undefined && (isTradePage ? <Typography sx={{position: 'absolute', bottom: '0px', color: 'white', fontSize: '14px', opacity: ballInfo[ball].emCount === 0 ? 0.5 : 1, fontWeight: ballInfo[ball].emCount === 0 ? 400 : 700}}>{ballInfo[ball].emCount}EM</Typography> :
                                renderEMIndicator(ballInfo, ball, isEditMode, pokeName, collectionId, ownerId, disabled, handleEditBallInfo, styles))} */}
                            
                            <EMIndicator 
                                textOnly={isTradePage}
                                isEditMode={isEditMode}
                                emCount={ballInfo[ball].emCount}
                                EMs={ballInfo[ball].EMs}
                                handleChange={handleEMCountChangeFunc}
                            />
                        </Box>
                        }
                    </>
                }
                {ballInfo[ball].highlyWanted !== undefined ? renderTagIndicator('highlyWanted') : 
                ballInfo[ball].pending !== undefined && renderTagIndicator('pending')
                }
            </Box>
            {(isTradePage && isSelectedTradePage) && 
                <Box sx={{position: 'absolute', top: '-2px', right: '1px'}}>
                    <ImgData type='icons' linkKey='greencheckmark' size='12px'/>
                </Box>
            }
        </TableCell> 
        </>
    )
}