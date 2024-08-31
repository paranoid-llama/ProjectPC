import { capitalizeFirstLetter } from "../../../../utils/functions/misc"
import { TableCell, Typography, TableRow, Box, Tooltip } from "@mui/material"

const setBallCols = (userData, ballScopeDisplay) => {
    const cols = []
    const ballOrder = userData.loggedIn ? userData.user.settings.display.ballOrder.filter(b => ballScopeDisplay.includes(b)) : ballScopeDisplay
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

export function OnHandQtyDisplay({qty, nonHAQty, reserved, styles, blackSquare}) {
    return (
        <TableCell 
            padding='none' 
            sx={blackSquare ? {backgroundColor: 'black'} : {...styles.tableCell, position: 'relative', height: '72px'}}
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
                <Box sx={{...styles.alignment.checkboxAlignment, ...styles.bodyColor, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '42px'}}>
                    <Typography 
                        sx={{
                            position: 'absolute',
                            fontWeight: 700,
                            fontSize: '24px'
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
                </>
            }
        </TableCell>
    )
}

