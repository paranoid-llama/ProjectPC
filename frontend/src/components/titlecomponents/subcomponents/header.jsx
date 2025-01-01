import {Typography} from '@mui/material'

export default function Header({children, additionalStyles, noWrap=true}) {
    const noWrapProp = noWrap ? {noWrap: true} : {}
    return (
        <Typography align='left' {...noWrapProp} variant='h1' sx={{fontWeight: 700, fontSize: '24px', textAlign: 'center', padding: '1rem', ...additionalStyles}}>{children}</Typography>
    )
}