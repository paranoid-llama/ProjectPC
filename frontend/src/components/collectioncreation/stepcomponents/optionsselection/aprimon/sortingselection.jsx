import {Box, Typography, ToggleButton, Button, Select, MenuItem} from '@mui/material'

export default function SortingSelection({sortData, handleChange}) {

    const disabledCollectionResortEffect = sortData.collection.reorder === false ? {pointerEvents: 'none', opacity: 0.5} : {}
    const disabledOnhandResortEffect = sortData.onhand.reorder === false ? {pointerEvents: 'none', opacity: 0.5} : {}
    
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
            <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 1}}>Sorting Mechanisms</Typography>
            <Typography sx={{fontSize: '12px'}}>
                Select the auto-sort method whenever you add/remove pokemon from the collection/on-hand list, and if you want it to reorder everytime.
                Also, custom sort the collection list.
            </Typography>
            <Box sx={{width: '90%', height: '90%', display: 'flex', flexDirection: 'row', mt: 1}}>
                <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Box sx={{width: '100%', height: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 700}}>Collection List</Typography>
                        <Box sx={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2}}>
                            <Typography sx={{fontSize: '14px'}}>Auto Re-Sort List:</Typography>
                            <ToggleButton 
                                sx={{padding: 1, py: 0}} 
                                value={true} 
                                selected={sortData.collection.reorder === true} 
                                onChange={(e) => handleChange(e, 'collection', 'reorder', true)}
                            >
                                Yes
                            </ToggleButton>
                            <ToggleButton 
                                sx={{padding: 1, py: 0}} 
                                value={false}
                                selected={sortData.collection.reorder === false} 
                                onChange={(e) => handleChange(e, 'collection', 'reorder', false)}
                            >
                                No
                            </ToggleButton>
                        </Box>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2, ...disabledCollectionResortEffect}}>
                            <Typography sx={{fontSize: '14px'}}>Sort By:</Typography>
                            <Select 
                                value={sortData.collection.defaultSortKey}
                                sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px', py: 0}}}
                                size='small'
                                onChange={(e, newVal) => handleChange(e, 'collection', 'defaultSortKey', newVal.props.value)}
                            >
                                <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                                <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                                <MenuItem value='NameA2Z'>Name - A to Z</MenuItem>
                                <MenuItem value='NameZ2A'>Name - Z to A</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height: '80%', display: 'flex', alignItems: 'center', flexDirection: 'column', mt: 2}}>
                        <Typography sx={{fontSize: '14px', fontWeight: 700}}>On-Hand List</Typography>
                        <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2}}>
                            <Typography sx={{fontSize: '14px'}}>Auto Re-Sort List:</Typography>
                            <ToggleButton 
                                sx={{padding: 1, py: 0.5}} 
                                value={true} 
                                selected={sortData.onhand.reorder === true} 
                                onChange={(e) => handleChange(e, 'onhand', 'reorder', true)}
                            >
                                Yes
                            </ToggleButton>
                            <ToggleButton 
                                sx={{padding: 1, py: 0.5}} 
                                value={false}
                                selected={sortData.onhand.reorder === false} 
                                onChange={(e) => handleChange(e, 'onhand', 'reorder', false)}
                            >
                                No
                            </ToggleButton>
                        </Box>
                        <Box sx={{width: '100%', height: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 2, ...disabledOnhandResortEffect}}>
                            <Typography sx={{fontSize: '14px'}}>Sort By:</Typography>
                            <Select 
                                value={sortData.onhand.defaultSortKey}
                                sx={{'&.MuiInputBase-root': {width: '70%'}, '& .MuiSelect-select': {fontSize: '12px'}}}
                                size='small'
                                onChange={(e, newVal) => handleChange(e, 'onhand', 'defaultSortKey', newVal.props.value)}
                            >
                                <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                                <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                                <MenuItem value='NameA2Z'>Name - A to Z</MenuItem>
                                <MenuItem value='NameZ2A'>Name - Z to A</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{width: '100%', height: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0.5}}>
                            <Button>
                                Other On-Hand Sort Settings
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{width: '60%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>

                </Box>
            </Box>
        </Box>
    )
}