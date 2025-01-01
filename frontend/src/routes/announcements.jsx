import {Box, Typography, Button, useTheme} from '@mui/material'
import InfoWrapper from './infopages/infowrapper'
import { useNavigate } from 'react-router'
import hexToRgba from 'hex-to-rgba'

export default function Announcements({}) {
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <InfoWrapper title='Announcements' wrapperSx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '550px', mb: 2}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '550px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
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
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '510px', mb: 2}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '90%', height: '510px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 3}}>
                        <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Post-Launch Update 2</Typography>
                        <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', width: '95%', textAlign: 'left'}}>Hey guys! First off, I want to thank everyone for the positive reception to the site! I've been working on implementing some smaller, more easier-to-implement features and so here are the changes:</Typography>
                        <Box sx={{...theme.components.box.fullCenterCol, width: '90%', justifyContent: 'start', mt: 1}}>
                            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', alignItems: 'start'}}>
                                <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px', textAlign: 'left'}}> - Added more filtering options. You can now:</Typography>
                                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px', textAlign: 'left'}}> - Filter by game in HOME collections</Typography>
                                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px', textAlign: 'left'}}> - Filter out completed sets of pokemon (where they have all ball combinations owned)</Typography>
                                    <Typography sx={{fontSize: '12px', color: 'white', textIndent: '50px', textAlign: 'left'}}> - Reset filters</Typography>
                                <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px', textAlign: 'left'}}> - Added an option to complete an entire pokemon set with one button when they are selected</Typography>
                                <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px', textAlign: 'left'}}> - Fixed an error with editing LF/FT Items in non-HOME collections, if you had not set it up when creating the collection</Typography>
                                <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px', textAlign: 'left'}}> - Changed the color of wanted/pending tags so they pop out more</Typography>
                                <Typography sx={{fontSize: '13px', color: 'white', textIndent: '30px', textAlign: 'left'}}> - Slightly changed collection importing</Typography>
                            </Box>
                        <Typography sx={{color: 'white', fontSize: '14px', width: '95%', textIndent: '30px', mt: 2, textAlign: 'left'}}>
                            Many of these changes came from feedback given to the site, so thank you if you had suggested these! On top of those smaller changes, 
                            I'm looking to perform some bigger ones well (many also suggested to me), which include linking HOME collections to HOME game collections,
                            exporting collections, and making the site mobile friendly (especially the collection/edit collection page). These might take a month or longer 
                            to complete. 
                        </Typography>
                        <Typography sx={{color: 'white', fontSize: '14px', mt: 1}}>
                            Thanks again for using the site!
                        </Typography>
                        </Box>
                        <Typography sx={{position: 'absolute', top: '3px', right: '5px', fontSize: '12px', color: 'white'}}>September 8, 2024</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '320px', mb: 2}}>
                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '320px', maxWidth: '800px', position: 'relative', border: `1px solid ${theme.palette.color1.dark}`, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', height: '100%', justifyContent: 'start', width: '100%', ml: 4, mt: 3}}>
                    <Typography sx={{fontSize: '36px', color: 'white', fontWeight: 700}}>Post-Launch Update</Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', textAlign: 'left', width: '95%'}}>
                        Thank you guys for joining the site! I just wanted to post a quick update about importing collections from google sheets. 
                        I have found there were issues when users have tried to do so. I am aware of them and have made some small fixes to some of them.
                        There might be more issues with importing collections, so I apologize for the inconvenience!
                    </Typography>
                    <Typography sx={{fontSize: '14px', color: 'white', textIndent: '30px', textAlign: 'left', width: '95%', mt: 1}}>
                        In order to be able to help, I changed the Contact Us page so you can message me directly from there! I encourage anyone experiencing problems to 
                        send a message through there, and I will respond to your user through the website. If you're looking specifically for help on importing, it would help if you sent
                        more detailed information on the data you filled out on the form, the error that shows up and, if you're okay with it, a link to your sheet. Feel free to offer overall thoughts
                        and suggestions through there as well!
                    </Typography>
                    <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '95%', mt: 0}}>
                        <Button sx={{fontSize: '14px', color: theme.palette.color3.main, ml: 3}} onClick={() => navigate('/info/contact-us')}>Contact Us</Button>
                    </Box>
                    </Box>
                    <Typography sx={{position: 'absolute', top: '3px', right: '5px', fontSize: '12px', color: 'white'}}>September 2, 2024</Typography>
                </Box>
            </Box>
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
                <Typography sx={{position: 'absolute', top: '3px', right: '5px', fontSize: '12px', color: 'white'}}>August 30, 2024</Typography>
            </Box>
            <Typography sx={{color: 'grey', fontSize: '24px', mt: 20}}><i>No other announcements</i></Typography>
        </InfoWrapper>
    )
}