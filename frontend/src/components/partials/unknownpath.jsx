import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from './routepartials/bodywrapper'

export default function UnknownPath({}) {
    const theme = useTheme()

    return (
        <>
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Typography variant='h1' sx={{fontSize: '48px', my: 3, fontWeight: 700}}>This page doesn't exist!</Typography>
            <Typography>We couldn't find the page at this URL. Double-check that it is correct!</Typography>
        </BodyWrapper>
        </>
    )
}