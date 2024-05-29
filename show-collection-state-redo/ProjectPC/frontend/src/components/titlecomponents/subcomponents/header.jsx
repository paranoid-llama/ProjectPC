import {Typography} from '@mui/material'

export default function Header({children, additionalStyles}) {
    return (
        <Typography align='left' noWrap variant='h1' sx={{fontWeight: 700, fontSize: '24px', textAlign: 'center', padding: '1rem', ...additionalStyles}}>{children}</Typography>
    )
}