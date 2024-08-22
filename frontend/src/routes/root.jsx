import {Outlet, useLocation, useRouteLoaderData} from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Features from '../components/titlecomponents/homepage/features';

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