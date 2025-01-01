import {Box, Typography, useTheme, Checkbox} from '@mui/material'
import { useDispatch } from 'react-redux'
import HAIndicator from '../../tabledata/haindicator'
import EMIndicator from '../../tabledata/emindicator'
import { setSelected } from '../../../../app/slices/editmode'
import { renderBallListDragVer } from '../../../../../utils/functions/renderballselection'
import { getCenterOffset } from '../../../../../utils/functions/renderballselection'

export default function SmallWidthCheckbox({ballInfo, isEditMode, handleEditBallInfo, pokeName, ball, collectionId, ownerId, isRow2=false, pokeid, allowedBallsTotal}) {
    const theme = useTheme()
    const disabled = !isEditMode
    const dispatch = useDispatch()

    const onClickFunc = isEditMode ? {
        onClick: () => dispatch(setSelected({
            selected: pokeid, 
            selectedBall: ball, 
            dontShowEditScreen: true, 
            sw: true, 
            allowedBalls: allowedBallsTotal
        }))
    } : {}

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
                    top: '5px',
                    fontSize: '13px'
                }}
            >
                {tagType === 'highlyWanted' ? 'WANT' : 'PEND'}
            </Typography>
        )
    }

    return (
        <Box 
            sx={{
                width: '100%', 
                height: '100%', 
                border: '1px solid black', 
                borderTop: 'none', 
                borderBottom: isRow2 ? 'none' : '1px solid black', 
                ...theme.components.box.fullCenterCol, 
                justifyContent: 'start',
                ':hover': {cursor: isEditMode ? 'pointer' : 'auto'}
            }}
            {...onClickFunc}
        >
            <Checkbox
                checked={ballInfo.isOwned} 
                sx={{color: 'white', '&.Mui-disabled': {color: 'white', '&.Mui-checked': {color: '#1976d2'}}, mt: 1}} 
                disabled={disabled}
                size='large'
                onClick={isEditMode ? ((e) => handleEditBallInfo(e, 'isOwned', pokeName, ball, collectionId, ownerId)) : undefined}
            />
            <Box sx={{...theme.components.box.fullCenterCol, borderTop: '1px solid white', width: '90%', position: 'relative'}}>
                {ballInfo.isOwned && ballInfo.isHA !== undefined &&
                <HAIndicator 
                    sx={{width: '100%', fontSize: '18px', height: '24px', top: '4px'}}
                    textOnly={false}
                    isEditMode={isEditMode}
                    isHAActive={ballInfo.isHA}
                    handleChange={(e) => handleHAChangeFunc(e)}
                    noTopRow={true}
                    smallWidth={true}
                />}
                {ballInfo.isOwned && ballInfo.emCount !== undefined &&
                <EMIndicator 
                    sx={{width: '100%', fontSize: '16px', height: '24px', top: '28px'}}
                    textOnly={false}
                    isEditMode={isEditMode}
                    emCount={ballInfo.emCount}
                    EMs={ballInfo.EMs}
                    handleChange={(e) => handleEMCountChangeFunc(e)}
                    smallWidth={true}
                />
                }
                {ballInfo.pending && renderTagIndicator('pending')}
                {ballInfo.highlyWanted && renderTagIndicator('highlyWanted')} 

            </Box>
        </Box>
    )
}