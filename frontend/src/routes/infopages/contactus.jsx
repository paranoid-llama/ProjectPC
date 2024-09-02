import {Box, Typography, useTheme, Grid} from '@mui/material'
import InfoWrapper from './infowrapper'
import hexToRgba from 'hex-to-rgba'
import ContactUsDirectlyComponents from './contactusdirectly/contactusdirectlycomponents'

export default function ContactUs({}) {
    const theme = useTheme()

    return (
        <InfoWrapper title='Contact Us' wrapperSx={{...theme.components.box.fullCenterCol, mt: 3}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', py: 2, px: 3, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px', border: `2px solid ${theme.palette.color1.dark}`, height: '900px', color: theme.palette.color1.contrastText, maxWidth: '750px', position: 'relative', width: '100%'}}>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'center'}}>
                    You can contact us at this e-mail: 
                </Typography>
                <Typography sx={{fontSize: '24px', width: '100%', textAlign: 'center', my: 4, fontWeight: 700}}>
                    llama.pokellections@gmail.com
                </Typography>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'center'}}>
                    Feel free to contact us for any of these concerns:
                </Typography>
                <Grid container sx={{...theme.components.box.fullCenterRow, my: 5}}>
                    <Grid item xs={4}><Typography sx={{fontWeight: 700}}>Questions/Concerns</Typography></Grid>
                    <Grid item xs={4}><Typography sx={{fontWeight: 700}}>Report a Bug</Typography></Grid>
                    <Grid item xs={4}><Typography sx={{fontWeight: 700}}>Report a User</Typography></Grid>
                </Grid>
                <Typography>Alternatively, you can also contact our e-mail directly from here:</Typography>
                <ContactUsDirectlyComponents containerSx={{my: 2, width: '80%'}}/>
                <Typography sx={{fontSize: '11px', mb: 5}}>The e-mail will be sent by the server to llama.pokellections@gmail.com on behalf of you. If you choose not to send anonymously, only your username will be sent.</Typography>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'center'}}>
                    Please provide as much information as possible when contacting us! We're always happy to help.
                </Typography>
            </Box>
        </InfoWrapper>
    )
}