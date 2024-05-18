import {Outlet, useLocation} from 'react-router-dom';
import { useTheme, Box, Typography, Button } from '@mui/material';
import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/titlecomponents/homepage/features';

export default function Root() {
    const theme = useTheme()
    return (
      <Box sx={{flex: 1}}>
        <Box sx={{minHeight: '340px', backgroundColor: theme.palette.color2.main, backgroundImage: `url(https://res.cloudinary.com/duaf1qylo/image/upload/w_0.4,c_scale,o_10/v1715457371/misc/ballswallpaper.png)`, ...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Typography variant='h1' sx={{mb: 2, color: theme.palette.color2.contrastText, fontSize: '4rem', mt: 12}}>Welcome to Pokollections!</Typography>
            <Typography variant='h2' sx={{color: theme.palette.color2.contrastText, fontSize: '32px'}}>Aprimon Collection Tracker</Typography>
            <Button>What are Aprimon?</Button>
        </Box>
        <Box sx={{width: '100%', height: '50px', display: 'flex', mb: 5, backgroundColor: theme.palette.color2.main, borderBottomRightRadius: '100%', borderBottomLeftRadius: '100%'}}></Box>
        <Features />
        <Box sx={{...theme.components.box.fullCenterCol, mt: 1}}>
          <Box sx={{width: '50%', height: '100px', borderRadius: '10px', backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight, ...theme.components.box.fullCenterCol}}>
            <Typography sx={{fontSize: '24px', fontWeight: 700}}>Try it out!</Typography>
            <Button size='large' sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Get Started</Button>
          </Box>
        </Box>
      </Box>
    );
  }