import { capitalizeFirstLetter } from "../../../../utils/functions/misc"
import { TableCell, Typography, TableRow, Box, Tooltip, Button, useTheme } from "@mui/material"
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { apriballs } from "../../../../common/infoconstants/miscconstants.mjs"

const setBallCols = (userData, ballScopeDisplay) => {
    const cols = []
    const ballOrder = userData.loggedIn ? userData.user.settings.display.ballOrder.filter(b => ballScopeDisplay.includes(b)) : apriballs.filter(b => ballScopeDisplay.includes(b))
    ballOrder.forEach(ball => {
        cols.push({
            label: capitalizeFirstLetter(ball),
            dataKey: ball,
            width: `${70/ballScopeDisplay.length}%`,
            ball: true
        })
    })
    return cols
}

export function setColumns(userData, ballScopeDisplay) {
    return [
        {label: '#', dataKey: 'natDexNum', width: '5%'},
        {label: 'img', dataKey: 'natDexNum', width: '5%', isImg: true},
        {label: 'Name', dataKey: 'name', width: '20%'},
        ...setBallCols(userData, ballScopeDisplay)
    ]
}

export function setHeaders(columns, styles) {
    return (
        <>
        <TableRow sx={{backgroundColor: '#283f57', zIndex: 20}}>
            {columns.map(c => (
                c.ball ? 
                <TableCell 
                    key={`${c.label}-header`}
                    sx={{...styles.tableCell, width: c.width, zIndex: 15}} 
                    variant='head'>
                    <Box
                        sx={{...styles.ballHeaderDiv.divStyles, zIndex: 15}}
                    >
                        <Box sx={{...styles.ballHeaderDiv.label, zIndex: 15}}>{c.label}</Box>
                        <div>
                            <img height='25px' width='25px' src={`https://res.cloudinary.com/duaf1qylo/image/upload/balls/${c.dataKey}.png`}/>
                        </div>
                    </Box>
                </TableCell> :
                <TableCell 
                    key={`${c.label}-header`}
                    sx={{...styles.tableCell, width: c.width}} 
                    variant='head'
                    >
                    <Box 
                        sx={
                            c.label === 'img' ? 
                            {...styles.textHeader, paddingTop: '28px', paddingBottom: '28px'} : 
                            c.label === '#' ?
                            {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment, px: 0} :
                            styles.textHeader
                        }
                    >
                        {c.label !== 'img' && c.label}
                    </Box>
                </TableCell>
            ))}
        </TableRow>
        </>
    )
}

export function OnHandQtyDisplay({qty, nonHAQty, reserved, styles, blackSquare, boxWrapper=false, height='72px', blackSquareStyles={}, wrapperStyles={}, fs='24px', bcStyles={}, onClickFunc=undefined, isSelected, deleteOnHandMode, flaggedForDeletion}) {
    const theme = useTheme()
    const Wrapper = boxWrapper ? Box : TableCell
    const isSelectedZIdx = isSelected ? {zIndex: 1, borderBottom: '2px solid turquoise', borderRight: 'none', borderLeft: 'none'} : {}
    const incrementBsStyles = (blackSquare && onClickFunc) ? {':hover': {opacity: 0.8}, position: 'relative', ...isSelectedZIdx} : {}
    return (
        <Wrapper
            padding='none' 
            sx={blackSquare ? {backgroundColor: 'black', ...blackSquareStyles, ...incrementBsStyles} : {...styles.tableCell, position: 'relative', height, ...wrapperStyles}}
        >
            {!blackSquare &&
                <>
                <Box sx={styles.indicators.indicatorRowTop}>
                {nonHAQty !== 0 &&
                    <Tooltip title="The number of this on-hand which don't have their hidden ability" arrow>
                        <Typography
                            sx={{
                                position: 'absolute', 
                                top: '0px', 
                                color: 'white', 
                                fontSize: '10px', 
                                width: '100%',
                                display: 'flex', 
                                justifyContent: 'center',
                                textAlign: 'center',
                                ':hover': {cursor: 'pointer'}
                            }}
                        >
                            N-HA: {nonHAQty}
                        </Typography>
                    </Tooltip>}
                </Box>
                <Box sx={{...styles.alignment.checkboxAlignment, ...styles.bodyColor, ...bcStyles, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '42px'}}>
                    <Typography 
                        sx={{
                            position: 'absolute',
                            fontWeight: 700,
                            fontSize: fs
                        }}
                    >
                        {qty}
                    </Typography>
                </Box>
                <Box sx={{...styles.indicators.indicatorRow, display: 'flex', width: '100%'}}> 
                    {reserved !== 0 &&
                    <Tooltip title='This On-Hand is reserved and is pending in an accepted trade/trade offer. The number indicates the reserved quantity.' arrow>
                        <Typography
                            sx={{
                                position: 'absolute', 
                                bottom: '0px', 
                                color: 'white', 
                                fontSize: '10px', 
                                width: '100%',
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                ':hover': {cursor: 'pointer'}
                            }}
                        >
                            Res: {reserved}
                        </Typography>
                    </Tooltip>}
                </Box>
                {(onClickFunc && !deleteOnHandMode) && <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', top: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => onClickFunc(true)}></Button>}
                {(onClickFunc && !deleteOnHandMode) && <Button sx={{width: '100%', minWidth: '0px', height: '50%', padding: 0, position: 'absolute', bottom: '0px', left: '0px', zIndex: 3}} fullWidth onClick={() => onClickFunc(false)}></Button>}
                {(onClickFunc && deleteOnHandMode) && <Button sx={{width: '100%', minWidth: '0px', height: '100%', padding: 0, position: 'absolute', bottom: '0px', left: '0px', zIndex: 3, ':hover': {backgroundColor: 'rgba(200, 40, 40, 0.3)'}}} fullWidth onClick={onClickFunc}></Button>}
                {flaggedForDeletion &&
                    <Box onClick={onClickFunc} sx={{position: 'absolute', backgroundColor: 'rgba(200, 40, 40, 0.1)', border: '3px solid rgb(200, 40, 40)', width: '90%', height: '95%', top: '-2px', left: '0px', ':hover': {backgroundColor: 'rgba(200, 40, 40, 0.3)'}}}>

                    </Box>
                }
                </>
            }
            {(blackSquare && onClickFunc) && //indicates you can increment by one
            <Button sx={{width: '100%', minWidth: '0px', height: '72px', position: 'absolute', top: '0px', left: '0px', padding: 0, zIndex: 1}} fullWidth onClick={() => onClickFunc(true, true)}>
                <ControlPointIcon sx={{color: 'rgba(255, 255, 255, 0.5)'}}/>
            </Button>
            }
        </Wrapper>
    )
}

