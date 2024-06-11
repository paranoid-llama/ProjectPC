import {Box, TableCell, Typography} from '@mui/material'
import ImgData from './imgdata'
import {useSelector, useDispatch} from 'react-redux'
import {setSelected, deselect} from './../../../app/slices/editmode'
import store from './../../../app/store'
import Selection from './../selection'
import { getGameColor, homeDisplayGames } from '../../../../../common/infoconstants/miscconstants.mjs'

export default function DataCell({label, styles, alignment='none', isEditMode, imgParams={isImg: false}, leftMostCell=false, isSelected=false, onClickFunc, onhandCells=false, specialStyles={}, blackSquare=false, availableGames}) {
    const {isImg, imgLinkKey, imgSize='32px', imgType='poke'} = imgParams
    const blackSquareStyles = blackSquare ? {backgroundColor: 'black'} : {}
    const noInfo = label === '(No Info)'
    const otherTextStyles = noInfo ? {opacity: 0.5} : {}
    const dispatch = useDispatch()
    const deselectFunc = () => dispatch(deselect())
    const displayAvailableGames = availableGames !== undefined
    const relativeStyle = displayAvailableGames ? {position: 'relative'} : {}
    return (
        <TableCell 
            padding='none' 
            sx={!(blackSquare) ? styles.tableCell : blackSquareStyles}
            onClick={isEditMode ? onClickFunc : null}
        >
            {(leftMostCell === true && isSelected === true) && <Selection height={onhandCells ? '71.016px' : '76px'} onhandSelection={onhandCells} deselectFunc={deselectFunc}/>}
            <Box sx={!(blackSquare) ? {...alignment, ...styles.bodyColor, ...relativeStyle} : {}}>
                {isImg ? 
                <ImgData type={imgType} size={imgSize} linkKey={imgLinkKey}/> :
                !(blackSquare) && <Typography sx={{...otherTextStyles, ...specialStyles}} variant={'body2'}>{label}</Typography>
                }
                {displayAvailableGames && 
                <Box sx={{position: 'absolute', fontSize: '10px', width: '80%', right: '10%', bottom: '-3px', display: 'flex', justifyContent: 'center'}}>
                    {homeDisplayGames.map((game, idx) => {
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
    )
}