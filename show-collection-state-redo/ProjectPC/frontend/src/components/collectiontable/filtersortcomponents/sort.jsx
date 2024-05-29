import { Box, Typography, styled, ToggleButton, ToggleButtonGroup} from "@mui/material"
import { useSelector, useDispatch } from 'react-redux'
import { setSortKey } from "../../../app/slices/listdisplay"
import MuiToggleButton from '@mui/material/ToggleButton'

export default function Sort({listType}) {
    const dispatch = useDispatch()
    const ToggleButton = styled(MuiToggleButton)({
        '&.MuiToggleButton-sizeSmall': {
            color: 'white',
            borderColor: 'grey'
        },
        '&.Mui-selected': {
            backgroundColor: '#b59d0e',
            color: '#1e2f41'
        }
    })

    // const collectionSort = useSelector((state) => state.listDisplay.collectionFilters.sort)
    // const onhandSort = useSelector((state) => state.listDisplay.onhandFilters.sort)
    const sortKey = listType === 'collection' ? useSelector((state) => state.listDisplay.collectionFilters.sort) : useSelector((state) => state.listDisplay.onhandFilters.sort)
    const listDisplayState = listType === 'collection' ? useSelector ((state) => state.listDisplay.collection) : useSelector((state) => state.listDisplay.onhand)

    const handleChange = (e) => {
        dispatch(setSortKey({sortKey: e.target.value, listType, listState: listDisplayState}))
    }

    return (
        <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginLeft: '10px'}}>
            <Box sx={{height: '20%'}}><Typography color='white' variant='h6'>Sort By</Typography></Box>
            <Box sx={{height: '40%', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography color='white' sx={{width: '20%'}}>Dex #</Typography>
                <Box sx={{width: '65%', display: 'flex', flexDirection: 'column', marginLeft: '15px'}}>
                    <ToggleButtonGroup size='small' orientation='vertical' value={sortKey} onChange={(e) => handleChange(e)} exclusive={true}>
                        <ToggleButton 
                            sx={{padding: '0px', width: '100%'}}
                            value='NatDexNumL2H'
                        >
                            Lowest to Highest
                        </ToggleButton>
                        <ToggleButton 
                            sx={{padding: '0px', width: '100%'}}
                            value='NatDexNumH2L'
                        >
                            Highest to Lowest
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Box sx={{height: '40%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography color='white' sx={{width: '20%'}}>Name</Typography>
                <Box sx={{width: '65%', display: 'flex', flexDirection: 'column', alignItems: 'start', marginLeft: '25px'}}>
                    <ToggleButtonGroup size='small' orientation='vertical' value={sortKey} sx={{width: '40%'}} onChange={(e) => handleChange(e)} exclusive={true}>
                        <ToggleButton 
                            sx={{padding: '0px', width: '100%'}}
                            value='A2Z'
                        >
                            A-Z
                        </ToggleButton>
                        <ToggleButton 
                            sx={{padding: '0px', width: '100%'}}
                            value='Z2A'
                        >
                            Z-A
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </Box>
    )
}