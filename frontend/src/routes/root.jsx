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
        <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '550px', mb: 2}}>
          <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '550px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
            <Button sx={{textTransform: 'none', position: 'absolute', top: '0px', left: '0px', ml: 2, fontSize: '11px', color: theme.palette.color3.main}} size='small' onClick={() => navigate('/announcements')}><ArrowRightAltIcon/> Announcements</Button>
            <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 3}}>
              <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Mobile Update #1</Typography>
              <Typography sx={{fontSize: '15px', color: 'white', textIndent: '30px', width: '95%'}}>
                Hey guys! I have a much larger update this time around. This update took a lot longer to complete than I originally thought, but it was mostly because I haven't had a lot of time to work on the site. 
                There aren't many changes, but they are very big. Here they are:
              </Typography>
              <Box sx={{...theme.components.box.fullCenterCol, width: '90%', justifyContent: 'start', mt: 1}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', alignItems: 'start', gap: 1}}>
                  <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', fontWeight: 700}}>1. The show collection and edit collection pages are fully mobile friendly and come with new layouts on smaller screens!</Typography>
                    <Typography sx={{fontSize: '13px', color: 'white', textIndent: '50px'}}> - These are the only two pages that are mobile friendly as of right now, but since they are undoubtedly the most difficult to translate to that format, the other pages shouldn't be too far off.</Typography>
                    {/* <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px'}}> - Filter out completed sets of pokemon (where they have all ball combinations owned)</Typography>
                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px'}}> - Reset filters</Typography> */}
                  <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', fontWeight: 700}}>2. You can now edit the on-hand list when it's in "by pokemon" view</Typography>
                  {/* <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - You can edit almost </Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Changed the color of wanted/pending tags so they pop out more</Typography>
                  <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px'}}> - Slightly changed collection importing</Typography> */}
              </Box>
              <Box sx={{...theme.components.box.fullCenterCol, width: '100%', justifyContent: 'start', alignItems: 'start', mt: 1, gap: 1}}>
              <Typography sx={{color: 'white', fontSize: '15px', width: '95%', textIndent: '30px', mt: 2, textAlign: 'left'}}>Here are some upcoming changes (ordered by priority) along with their ETA (still a very rough estimate as the upcoming season is going to take up a lot of my time!):</Typography>
              <Typography sx={{fontSize: '13px', color: 'white', textIndent: '50px'}}> 1. Export Collection to .csv file (by the end of January - later on, I plan to add a more comprehensive export function that will automatically construct a google sheet for you - more details later)</Typography>
              <Typography sx={{fontSize: '13px', color: 'white', textIndent: '50px'}}> 2. Making various pages mobile friendly (ongoing - will be done while I do other updates)</Typography>
              <Typography sx={{fontSize: '13px', color: 'white', textIndent: '50px'}}> 3. Adding Custom Sheets to Aprimon Collections (May)</Typography>
              <Typography sx={{fontSize: '13px', color: 'white', textIndent: '50px'}}> 4. Adding Egg Moves and Item Trading to Home Collections (June)</Typography>
              </Box>
              <Typography sx={{color: 'white', fontSize: '14px', mt: 3}}>
                Thanks again for using the site! Happy new year!
              </Typography>
            </Box>
            <Typography sx={{position: 'absolute', top: '3px', right: '5px', fontSize: '12px', color: 'white'}}>January 1, 2025</Typography>
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