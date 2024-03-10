import {Box} from '@mui/material'
import Header from '../../titlecomponents/subcomponents/header'

export default function Banner({sx, children}) {
    return (
        <Box sx={{width: '100%', alignItems: 'center'}}>
            <Header additionalStyles={sx}>{children}</Header>
        </Box>
    )
}