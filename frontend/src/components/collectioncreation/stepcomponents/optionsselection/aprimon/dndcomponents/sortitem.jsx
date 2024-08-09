import {Box, Typography} from '@mui/material'
import getNameDisplay from '../../../../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../../../../collectiontable/tabledata/imgdata'
import './droppablelist.css'

export default function SortItem({provided, pokemon, isHoldList, index, snapshot, nameDisplaySettings}) {

    const isDragginStyles = snapshot.isDragging === true ? {color: 'white'} : {}
    const isDraggingTextStyles = snapshot.isDragging === true ? {display: 'flex', alignItems: 'center'} : {}

    return (
        <>
        <Box 
            //, marginBottom: '3px', marginTop: '3px',
            sx={{display: 'flex', alignItems: 'center', backgroundColor: '#283f57', borderRadius: '10px', ...isDragginStyles}}
            ref={provided.innerRef} 
            {...provided.draggableProps} 
            {...provided.dragHandleProps}
        >
            <Box sx={{height: '100%', width: isHoldList ? '14%' : '7%', mx: 1, pointerEvents: 'none'}}>
                <ImgData linkKey={pokemon.id}/>
            </Box>
            <Box sx={{height: '100%', width: isHoldList ? '16%' : '8%', ml: 1, pointerEvents: 'none', ...isDraggingTextStyles}}>
                <Typography sx={{fontSize: '10px'}}>#{pokemon.natDexNum}</Typography>
            </Box>
            <Box sx={{height: '100%', width: isHoldList ? '70%' : '40%', ml: 1, pointerEvents: 'none', ...isDraggingTextStyles}}>
                <Typography sx={{fontSize: (isHoldList && pokemon.name.length > 25) ? '8px' : (isHoldList && pokemon.name.length > 20) ? '10px' : '12px'}}>{getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
            </Box>
            {(!isHoldList && !snapshot.isDragging) &&
            <Box sx={{height: '100%', width: '25%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mr: 4, pointerEvents: 'none'}}>
                <Typography sx={{fontSize: '10px', width: '70%', ml: 2}}>Position {index+1}</Typography>
            </Box>}
        </Box>
        </>
    )
}

