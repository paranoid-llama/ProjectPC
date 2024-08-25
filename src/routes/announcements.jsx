import {Box, Typography, Button, useTheme} from '@mui/material'
import InfoWrapper from './infopages/infowrapper'
import { useNavigate } from 'react-router'
import hexToRgba from 'hex-to-rgba'

export default function Announcements({}) {
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <InfoWrapper title='Announcements' wrapperSx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '300px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
                <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 2}}>
                <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Version 1.0 Launch</Typography>
                <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', width: '95%', textAlign: 'start'}}>The site is launched! Thank you for visiting this site! We currently support any of the following aprimon collections:</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', justifyContent: 'start', mt: 1}}>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '40%', alignItems: 'start'}}>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Gen 6 (X/Y) Collections</Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Gen 7 (Sun/Moon) Collections</Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Sword/Shield Collections</Typography>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, width: '60%', alignItems: 'start'}}>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Brilliant Diamond/Shining Pearl Collections</Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Gen 9 (Scarlet/Violet) Collections</Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px'}}> - Pokemon HOME Collections</Typography>
                    </Box>
                </Box>
                <Typography sx={{color: 'white', fontSize: '14px', width: '95%', textIndent: '30px', mt: 2, textAlign: 'start'}}>
                    <b>This website is not optimized for smaller screen sizes!</b> The best experience is achieved on screen sizes no smaller than tablets!
                </Typography>
                <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '95%', mt: 2}}>
                    <Typography sx={{color: 'white', fontSize: '14px', textIndent: '30px'}}>
                    Check out our other pages to read more:
                    </Typography>
                    <Button sx={{fontSize: '14px', color: theme.palette.color3.main, ml: 6}} onClick={() => navigate('/info/about-us')}>About Us</Button>
                    <Button sx={{fontSize: '14px', color: theme.palette.color3.main, ml: 3}} onClick={() => navigate('/info/contact-us')}>Contact Us</Button>
                </Box>
                </Box>
            </Box>
            <Typography sx={{color: 'grey', fontSize: '24px', mt: 20}}><i>No other announcements</i></Typography>
        </InfoWrapper>
    )
}