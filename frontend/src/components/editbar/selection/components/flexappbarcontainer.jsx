import {Box} from '@mui/material'

export default function FlexAppBarContainer({children, widthPercent, additionalStyles}) {
    return (
        <Box sx={{alignItems: 'center', width: widthPercent, ...additionalStyles}}>
            {children}
        </Box>
    )
}