import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import {Box, Slide} from '@mui/material'
import FilterSortButton from './filtersortbutton'
import Sort from './sort'
import Filter from './filter'
import "./../../../../utils/styles/componentstyles/filtersortbox.css"

export default function FilterSortArea({collection, isEditMode}) {
    const [area, setArea] = useState({open: false, firstRender: true})
    const list = useSelector((state) => state.editmode.listType)
    const listType = list === 'onHand' ? 'onhand' : 'collection' //listType is used to simplify store update which uses lowercase onhand. should probably use uniform casing for that word.

    const toggleArea = () => {
        setArea((prev) => ({open: !(prev.open), firstRender: false}))
    }

    const containerRef = useRef()

    const toggleClass = !area.firstRender ?  
        area.open ? 'add-height' : 'shrink-height' : ''

    const height = area.open ? '160px' : '0px'
    const containerPosition = area.open ? '10px' : '50px'

    return (
        <Box sx={{width: '100%', height, margin: '0'}} className={toggleClass} ref={containerRef}>
            <Box sx={{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column'}} >
                <Slide in={area.open} direction='up' timeout={{appear: 200, enter: 500, exit: 1000}}>
                    <Box sx={{width: '99.3%', height: '190px', position: 'absolute', backgroundColor: '#272625', border: '3px solid black', top: '20px', zIndex: 10, borderRadius: '10px'}}>
                        <Box sx={{width: '100%', height: '100%', display: 'flex'}}>
                            <Box sx={{width: '40%', height: '70%'}}>
                                <Sort listType={listType}/>
                            </Box>
                            <Box sx={{width: '60%', height: '95%'}}>
                                <Filter listType={listType} collection={collection} isEditMode={isEditMode}/>
                            </Box>
                        </Box>
                    </Box>
                </Slide>
                <Box sx={{width: '100%', height: '10%', display: 'flex', flexDirection: 'row-reverse', zIndex: 100}}>
                    <Box sx={{position: 'relative', width: '30%', height: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
                        <FilterSortButton toggleArea={toggleArea} areaOpen={area.open}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}