import {useLocation} from 'react-router-dom'
import {Box, TableCell, ToggleButtonGroup, styled, Typography} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import './../../../../utils/styles/componentstyles/checkboxindicators.css'

export default function IsOwnedCheckbox({ballInfo, handleEditBallInfo, pokeName, ball, collectionId, ownerId, styles}) {
    const isEditMode = useLocation().pathname.includes('edit')

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected, &.Mui-selected:hover': {
            color: 'white',
            backgroundColor: 'none'
        }
    })

    const renderHAIndicator = (position) => {
        
        return (
                <ToggleButton
                    sx={{
                        ...styles.indicators[`haindicator${position}`],
                        position: 'absolute',
                        border: 'none',
                        color: 'white',
                        [`@media only screen and (${position === 'Top' ? 'min' : 'max'}-width: 110${position === 'Top' ? '1' : '0'}px)`]: {
                            display: 'none'
                        },
                        margin: 0,
                        padding: '2px',
                        fontWeight: ballInfo[ball].isHA === true ? 700 : 400,
                        opacity: ballInfo[ball].isHA === true ? 1 : 0.5
                    }}
                    onChange={isEditMode ? (e) => handleEditBallInfo(e, 'isHA', pokeName, ball, collectionId, ownerId) : undefined}
                    value={ballInfo[ball].isHA}
                >
                    HA
                </ToggleButton>
        )
    }

    const renderEMIndicator = () => {
        return (
                <ToggleButton
                    sx={{
                        ...styles.indicators.emindicator,
                        color: 'white',
                        border: 'none',
                        position: 'absolute',
                        margin: 0,
                        padding: '2px',
                        fontWeight: ballInfo[ball].emCount >  0 ? 700 : 400,
                        opacity: ballInfo[ball].emCount > 0 ? 1 : 0.5
                    }}
                    onChange={isEditMode ? (e) => handleEditBallInfo(e, 'emCount', pokeName, ball, collectionId, ownerId) : undefined}
                    value={ballInfo[ball].emCount}
                >
                    {ballInfo[ball].emCount}EM
                </ToggleButton>
        )
    }

    const renderTagIndicator = (tagType) => {
        return (
            <Typography
                sx={{
                    color: 'white',
                    border: 'none',
                    position: 'absolute',
                    margin: 0,
                    padding: '2px',
                    fontWeight: 700,
                    opacity: 0.5,
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
            sx={styles.tableCell}
        >
            {ballInfo[ball].isOwned === true && 
            <Box sx={styles.indicators.indicatorRowTop}>
                {ballInfo[ball].isHA !== undefined && renderHAIndicator('Top')}
            </Box>}
            <Box sx={{...styles.alignment.checkboxAlignment, ...styles.bodyColor}}>
                <Checkbox 
                    checked={ballInfo[ball].isOwned} 
                    sx={{color: 'white'}} 
                    onClick={isEditMode ? ((e) => handleEditBallInfo(e, 'isOwned', pokeName, ball, collectionId, ownerId)) : undefined}
                />
               
                
            </Box>
            
            <Box sx={styles.indicators.indicatorRow}> 
                {ballInfo[ball].isOwned === true && 
                <>
                <Box sx={styles.indicators.haindicatorContainer}>
                    {ballInfo[ball].isHA !== undefined && renderHAIndicator('')}
                </Box>
                <Box sx={styles.indicators.emindicatorContainer}>
                    {ballInfo[ball].emCount !== undefined && renderEMIndicator()}
                </Box>
                </>
                }
                {ballInfo[ball].highlyWanted !== undefined ? renderTagIndicator('highlyWanted') : 
                ballInfo[ball].pending !== undefined && renderTagIndicator('pending')
                }
            </Box>
            
        </TableCell> 
        </>
    )
}