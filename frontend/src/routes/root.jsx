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
            <Typography sx={{fontWeight: 700, mt: 2, color: 'white'}}>This website is not built for mobile</Typography>
        </Box>
        <Box sx={{width: '100%', height: '50px', display: 'flex', mb: 5, backgroundColor: theme.palette.color2.main, borderBottomRightRadius: '100%', borderBottomLeftRadius: '100%'}}></Box>
        <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '450px', mb: 2}}>
          <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '450px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
            <Button sx={{textTransform: 'none', position: 'absolute', top: '0px', left: '0px', ml: 2, fontSize: '11px', color: theme.palette.color3.main}} size='small' onClick={() => navigate('/announcements')}><ArrowRightAltIcon/> Announcements</Button>
            <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 3}}>
              <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Post-Launch Update 2</Typography>
              <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', width: '95%'}}>Hey guys! First off, I want to thank everyone for the positive reception to the site! I've been working on implementing some smaller, more easier-to-implement features and so here are the changes:</Typography>
              <Box sx={{...theme.components.box.fullCenterCol, width: '90%', justifyContent: 'start', mt: 1}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', alignItems: 'start'}}>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Added more filtering options. You can now:</Typography>
                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px'}}> - Filter by game in HOME collections</Typography>
                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px'}}> - Filter out completed sets of pokemon (where they have all ball combinations owned)</Typography>
                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px'}}> - Reset filters</Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Added an option to complete an entire pokemon set with one button when they are selected</Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Fixed an error with editing LF/FT Items in non-HOME collections, if you had not set it up when creating the collection</Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Changed the color of wanted/pending tags so they pop out more</Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Slightly changed collection importing</Typography>
              </Box>
              <Typography sx={{color: 'white', fontSize: '14px', width: '95%', textIndent: '30px', mt: 2}}>
                Many of these changes came from feedback given to the site, so thank you if you had suggested these! On top of those smaller changes, 
                I'm looking to perform some bigger ones well (many also suggested to me), which include linking HOME collections to HOME game collections,
                exporting collections, and making the site mobile friendly (especially the collection/edit collection page). These might take a month or longer 
                to complete. 
              </Typography>
              <Typography sx={{color: 'white', fontSize: '14px'}}>
                Thanks again for using the site!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Features />
      <Box sx={{...theme.components.box.fullCenterCol, mt: 1}}>
        {!userData.loggedIn && 
        <Box sx={{width: '50%', height: '100px', borderRadius: '10px', backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight, ...theme.components.box.fullCenterCol}}>
          <Typography sx={{fontSize: '24px', fontWeight: 700}}>Try it out!</Typography>
          <Box sx={{...theme.components.box.fullCenterRow, gap: 3}}>
            <Button size='large' onClick={() => navigate('/demo-collection/new')} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Try a demo</Button>
            <Button size='large' onClick={() => navigate('/register')} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Register</Button>
          </Box>
        </Box>}
      </Box>
    </Box>
    );
  }