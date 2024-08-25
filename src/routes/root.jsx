import {Outlet, useLocation, useRouteLoaderData} from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Features from '../components/titlecomponents/homepage/features';
import hexToRgba from 'hex-to-rgba';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export default function Root() {
    const theme = useTheme()
    const navigate = useNavigate()
    const userData = useRouteLoaderData('root')
    return (
      <Box sx={{flex: 1}}>
        <Box sx={{minHeight: '340px', backgroundColor: theme.palette.color2.main, backgroundImage: `url(https://res.cloudinary.com/duaf1qylo/image/upload/w_0.4,c_scale,o_10/v1715457371/misc/ballswallpaper.png)`, ...theme.components.box.fullCenterCol, justifyContent: 'center'}}>
            <Typography variant='h1' sx={{mb: 2, color: theme.palette.color2.contrastText, fontSize: '4rem', mt: 3, textAlign: 'center'}}>Welcome to Pokellections!</Typography>
            <Typography variant='h2' sx={{color: theme.palette.color2.contrastText, fontSize: '32px'}}>Aprimon Collection Tracker</Typography>
            <Button onClick={() => navigate('/info/what-are-aprimon')}>What are Aprimon?</Button>
        </Box>
        <Box sx={{width: '100%', height: '50px', display: 'flex', mb: 5, backgroundColor: theme.palette.color2.main, borderBottomRightRadius: '100%', borderBottomLeftRadius: '100%'}}></Box>
        <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '300px', mb: 2}}>
          <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '300px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
            <Button sx={{textTransform: 'none', position: 'absolute', top: '0px', left: '0px', ml: 2, fontSize: '11px', color: theme.palette.color3.main}} size='small' onClick={() => navigate('/announcements')}><ArrowRightAltIcon/> Announcements</Button>
            <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 3}}>
              <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Version 1.0 Launch</Typography>
              <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', width: '95%'}}>The site is launched! Thank you for visiting this site! We currently support any of the following aprimon collections:</Typography>
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
              <Typography sx={{color: 'white', fontSize: '14px', width: '95%', textIndent: '30px', mt: 2}}>
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
        </Box>
        <Features />
        <Box sx={{...theme.components.box.fullCenterCol, mt: 1}}>
          {!userData.loggedIn && 
          <Box sx={{width: '50%', height: '100px', borderRadius: '10px', backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight, ...theme.components.box.fullCenterCol}}>
            <Typography sx={{fontSize: '24px', fontWeight: 700}}>Try it out!</Typography>
            <Button size='large' onClick={() => navigate('/register')} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Get Started and Register</Button>
          </Box>}
        </Box>
      </Box>
    );
  }