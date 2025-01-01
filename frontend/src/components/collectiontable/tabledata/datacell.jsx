import {Box, TableCell, Typography, useTheme, Tooltip, Checkbox} from '@mui/material'
import ImgData from './imgdata'
import {useSelector, useDispatch} from 'react-redux'
import {setSelected, deselect} from './../../../app/slices/editmode'
import { toggleOnHandIdToDelete } from './../../../app/slices/editmode'
import store from './../../../app/store'
import Selection from './../selection'
import listStyles from '../../../../utils/styles/componentstyles/liststyles'
import { setPokemon } from '../../../app/slices/tradeoffer'
import { selectIfPokemonIsSelected } from '../../../app/selectors/tradeselectors'
import { getGameColor, homeDisplayGames } from '../../../../common/infoconstants/miscconstants.mjs'

export default function DataCell({label, styles, alignment='none', isEditMode, imgParams={isImg: false}, leftMostCell=false, isSelected=false, onClickFunc, onhandCells=false, specialStyles={}, blackSquare=false, availableGames=undefined, localHandleChange=null, isTradePage=false, tradeSide, tradeDispData, imgAlignment={}, bodyColorOverride={}, fontSizeOverride, reserved=0, isEmDisplay=false, flaggedForDeletion=null, ohDeleteMode=false, specificDeselectFunc=null, checkboxCell=false, checkboxData={}}) {
    const {isImg, imgLinkKey, imgSize='32px', imgType='poke'} = imgParams
    const theme = useTheme()
    const blackSquareStyles = blackSquare ? {backgroundColor: 'black'} : {}
    const noInfo = label === '(No Info)'
    const otherTextStyles = noInfo ? {opacity: 0.5} : {}
    const dispatch = useDispatch()
    const deselectFunc = () => {dispatch(deselect())}
    const hoverSx = isEditMode ? {':hover': {cursor: 'pointer'}} : {}
    const bodyColorSx = isImg ? {backgroundColor: '#1d1c1b', borderRadius: '10px', paddingY: '16px', paddingX: 'calc(50% - 16px)', margin: 0, zIndex: -1} : styles.bodyColor
    const extraBodyColorSx = !isImg ? {height: '20px', px: 0} : {}

    const displayAvailableGames = availableGames !== undefined
    const includeBottomText = displayAvailableGames || reserved !== 0
    const relativeStyle = includeBottomText ? {position: 'relative'} : {}
    const isOnHandAndTradePage = isTradePage && onhandCells
    // const localSelectedStyles = localHandleChange !== null ? {backgroundColor: 'theme'}
    if (isOnHandAndTradePage) {
        if (tradeDispData.fullData.isHA !== undefined) {tradeDispData.ballData.isHA = tradeDispData.fullData.isHA}
        if (tradeDispData.fullData.emCount !== undefined) {
            tradeDispData.ballData.emCount = tradeDispData.fullData.emCount
            tradeDispData.ballData.EMs = tradeDispData.fullData.EMs
        }
    }
    const isSelectedForTrade = isOnHandAndTradePage ? useSelector((state) => selectIfPokemonIsSelected(state, tradeSide, {name: tradeDispData.pData.name, ball: tradeDispData.ballData.ball, onhandId: tradeDispData.ballData.onhandId})) : false
    const dispatchTradeChange = isOnHandAndTradePage ? () => dispatch(setPokemon({pData: tradeDispData.pData, ballData: tradeDispData.ballData, tradeSide})) : false
    return (
        <>
        
        <TableCell 
            padding='none' 
            sx={!(blackSquare) ? {...styles.tableCell, ...hoverSx} : {...blackSquareStyles, ...hoverSx}}
            onClick={(isOnHandAndTradePage && !isSelectedForTrade) ? dispatchTradeChange : (isEditMode && !flaggedForDeletion) ? onClickFunc : null}
        >
            {(leftMostCell === true && (isSelected === true || flaggedForDeletion)) && <Selection height={onhandCells ? '71.016px' : '76px'} onhandSelection={onhandCells} otherStyles={ohDeleteMode ? {backgroundColor: 'rgba(225, 30, 30, 0.2)', borderColor: 'rgba(150, 30, 30, 1)'} : {}} deselectFunc={ohDeleteMode ? onClickFunc : localHandleChange !== null ? localHandleChange : deselectFunc}/>}
            {/* localSelected below only happens for onhand */}
            {(leftMostCell === true && isSelectedForTrade) &&
                <Box sx={{position: 'absolute', width: '99.7%', zIndex: 100}}>
                    <Box sx={{
                        position: 'absolute', 
                        left: '-2px', 
                        top: '-11px', 
                        border: '1px solid turquoise',
                        height: '71px', 
                        ':hover': {
                            cursor: 'pointer',
                            opacity: 0.5,
                            border: '1px solid turquoise',
                        },
                        // ...listStyles.collection.selectionBox.widthScaling
                        width: '100%',

                    }}
                        onClick={dispatchTradeChange}
                    >
                    </Box> 
                    <Box sx={{position: 'absolute', top: -10, right: 2}}>
                        <ImgData type='icons' linkKey='greencheckmark' size='16px'/>
                    </Box>
                </Box>
            }
            <Box sx={!(blackSquare) ? {...alignment, ...bodyColorSx, ...relativeStyle, ...extraBodyColorSx, ...bodyColorOverride} : {}}>
                {isImg ? 
                <><Box sx={{position: 'absolute', ...imgAlignment}}><ImgData type={imgType} size={imgSize} linkKey={imgLinkKey}/></Box></> :
                checkboxCell ? 
                    <Checkbox 
                        sx={{...checkboxData.sx, color: 'white', pointerEvents: isEditMode ? 'auto' : 'none'}}
                        checked={checkboxData.active}
                        onChange={checkboxData.onChange}
                    />
                : 
                !(blackSquare) && <Typography sx={{...otherTextStyles, ...specialStyles, width: '100%', height: '100%', textAlign: 'center', position: 'absolute', left: '0px', top: '0px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fontSizeOverride ? fontSizeOverride : isEmDisplay ? '12px' : '14px', fontStyle: label === 'Unknown' ? 'italic' : 'normal'}} variant={'body2'}>{label}</Typography>
                }
                {includeBottomText && 
                <Box sx={{position: 'absolute', fontSize: '10px', width: '80%', right: '10%', bottom: '-3px', display: 'flex', justifyContent: 'center'}}>
                    {reserved !== 0 && 
                        <Tooltip title='This On-Hand is reserved and is pending in an accepted trade/trade offer. The number indicates the reserved quantity.' arrow>
                            <Typography sx={{fontSize: '8px', width: '100%', position: 'absolute', bottom: '2px', ':hover': {cursor: 'pointer'}}}>
                                Res: {reserved}
                            </Typography>
                        </Tooltip>
                    }
                    {displayAvailableGames && homeDisplayGames.map((game, idx) => {
                        const nameOfGame = game === 9 ? 'S/V' : game === 'swsh' ? 'SW/SH' : game === 'bdsp' && 'BD/SP'
                        const firstGame = nameOfGame.slice(0, nameOfGame.indexOf('/'))
                        const secondGame = nameOfGame.slice(nameOfGame.indexOf('/')+1, nameOfGame.length)
                        const firstGameColor = getGameColor(firstGame)
                        const secondGameColor = getGameColor(secondGame)
                        const gamesEnabled = availableGames.includes(game)
                        const margin = idx !== 0 ? {ml: 1} : {} 
                        return (
                            <Box key={`available-home-games-display-${nameOfGame}`} sx={{display: 'flex'}}>
                                <Typography sx={{fontSize: '10px', color: firstGameColor, opacity: gamesEnabled ? 1 : 0.4, ...margin}}>{firstGame}</Typography>
                                <Typography sx={{fontSize: '10px', color: secondGameColor, opacity: gamesEnabled ? 1 : 0.4}}>/{secondGame}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                }
            </Box>
        </TableCell>
        </> 
    )
}