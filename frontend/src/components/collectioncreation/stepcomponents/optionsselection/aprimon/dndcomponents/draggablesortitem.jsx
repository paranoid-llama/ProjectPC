import {Box, Typography} from '@mui/material'
import {useRef} from 'react'
import ImgData from '../../../../../collectiontable/tabledata/imgdata'
import {Draggable} from 'react-beautiful-dnd';
import SortItem from './sortitem';
import './droppablelist.css'

export default function DraggableSortItem({pokemon, isHoldList, index, nameDisplaySettings}) {

    return (
        <>
        <Draggable key={pokemon.id} draggableId={pokemon.id} index={index} type='group'>
            {(provided, snapshot) => (
                <SortItem provided={provided} pokemon={pokemon} isHoldList={isHoldList} index={index} isDragging={false} snapshot={snapshot} nameDisplaySettings={nameDisplaySettings}/>
            )}
        </Draggable> 
        </>
    )
}