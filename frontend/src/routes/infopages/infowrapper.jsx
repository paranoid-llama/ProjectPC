import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'

export default function InfoWrapper({title, titleSize='3rem', wrapperSx={}, children}) {
    const theme = useTheme()
    return (
        <>
        <Box sx={{minHeight: '100px', backgroundColor: theme.palette.color2.main, backgroundImage: `url(https://res.cloudinary.com/duaf1qylo/image/upload/w_0.4,c_scale,o_10/v1715457371/misc/ballswallpaper.png)`, ...theme.components.box.fullCenterCol, justifyContent: 'center'}}>
            <Typography variant='h1' sx={{mb: 2, color: theme.palette.color2.contrastText, fontSize: titleSize, mt: 3, textAlign: 'center'}}>{title}</Typography>
        </Box>
        <BodyWrapper sx={wrapperSx}>
            {children}
        </BodyWrapper>
        </>
    )
}