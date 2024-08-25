import { styled } from "@mui/material";
import MuiButton from '@mui/material/Button'

export default function FilterSortButton({toggleArea, areaOpen}) {

    const Button = styled(MuiButton)({
        '&.MuiButton-contained': {
            color: 'white',
            backgroundColor: '#1d1c1b'
        }
    })

    return (
        <Button
            variant='contained' 
            size='small' 
            sx={{borderRadius: '30px', height: '25px', position: 'absolute', right: '5px', top: areaOpen ? '25px' : '15px'}} 
            onClick={toggleArea}
        >
            Filter/Sort
        </Button>
    )
}