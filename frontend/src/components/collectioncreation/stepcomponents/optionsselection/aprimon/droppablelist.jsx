import {Box} from '@mui/material'
import { useRef, forwardRef, useMemo } from 'react'
import { Virtuoso } from 'react-virtuoso'
import DraggableSortItem from './draggablesortitem'
import { Draggable } from 'react-beautiful-dnd'

export default function DroppableList({totalCount, listContent, isHoldList, onHoverStyles, virtuosoStyles, otherContainerStyles, virtuosoProps, droppableProps, innerRef, snapshot}) {

    const HeightPreservingItem = ({children, ...props}) => {
        return (
            <Box sx={{height: '36px'}} {...props}>
                {children}
            </Box>
        )
    }

    return (
        <>
        <Box sx={{width: '100%', height: '95%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...otherContainerStyles}}>
            <Virtuoso 
                {...virtuosoProps}
                scrollerRef={innerRef}
                {...droppableProps}
                components={{
                    Item: HeightPreservingItem
                }}
                className={onHoverStyles ? 'virtuosohover' : 'none'}
                style={{height: '100%', width: '90%', borderRadius: '10px', overflowX: 'auto', ...virtuosoStyles}}
                totalCount={totalCount}
                itemContent={(index) => <DraggableSortItem pokemon={listContent[index]} isHoldList={isHoldList} index={index}/>}
            />
        </Box>
        
        </>
    )
}

    