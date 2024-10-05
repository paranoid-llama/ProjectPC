import {Box, Typography, useTheme, Button} from '@mui/material'
import { apriballLiterals, specialBalls } from '../../../common/infoconstants/miscconstants.mjs'
import { useRouteLoaderData } from 'react-router'
import { useNavigate } from 'react-router'
import ImgData from '../../components/collectiontable/tabledata/imgdata'
import InfoWrapper from './infowrapper'
import hexToRgba from 'hex-to-rgba'

export default function WhatAreAprimon({}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const userData = useRouteLoaderData('root')
    const Highlighted = ({children}) => {
        return (
            <span style={{color: theme.palette.color3.light}}>{children}</span>
        )
    }

    return (
        <InfoWrapper title='What are Aprimon?' wrapperSx={{...theme.components.box.fullCenterCol}}>
            <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', py: 2, px: 3, backgroundColor: hexToRgba(theme.palette.color1.main, 0.9), borderRadius: '10px', border: `2px solid ${theme.palette.color1.dark}`, height: '800px', color: theme.palette.color1.contrastText, maxWidth: '750px'}}>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'start', textIndent: '30px'}}>
                    The classic pokemon catchphrase is "Gotta catch 'em all!". It's no surprise, then, that there are countless pokemon fans who
                    collect all 1000+ pokemon. However, this isn't the <Highlighted><b>only</b></Highlighted> way to collect pokemon. Some people like to collect pokemon in very rare types of 
                    pokeballs colloquially known as <Highlighted><b>apriballs</b></Highlighted>. Thus, pokemon caught in these rare pokeballs are called <Highlighted><b>aprimon</b></Highlighted>.
                </Typography>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', height: '120px', gap: 4}}>
                    {apriballLiterals.map(apB => {
                        return (
                            <Box sx={{...theme.components.box.fullCenterCol}} key={`${apB}-image`}>
                            <ImgData 
                                type='ball'
                                linkKey={apB}
                                size='60px'
                            />
                            <Typography sx={{fontSize: '12px'}}>{`${apB[0].toUpperCase()}${apB.slice(1, apB.length)} Ball`}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', height: '120px', gap: 4, mt: '-15px'}}>
                    {specialBalls.map(spB => {
                        return (
                            <Box sx={{...theme.components.box.fullCenterCol}} key={`${spB}-image`}>
                            <ImgData 
                                type='ball'
                                linkKey={spB}
                                size='60px'
                            />
                            <Typography sx={{fontSize: '12px'}}>{`${spB[0].toUpperCase()}${spB.slice(1, spB.length)} Ball`}</Typography>
                            </Box>
                        )
                    })}
                </Box>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'start', textIndent: '30px'}}>
                    Apriballs stand for <Highlighted><b>Apricorn Balls</b></Highlighted>. They are named after the 7 pokeballs craftable from apricorns in the pokemon games which take place
                    in the Johto region (Gold/Silver/Crystal). The first row in the image above are the apricorn balls. The bottom row are various other pokeballs 
                    that have had limited availability across the games, typically as one-offs or given to the player in particular circumstances. Because they are 
                    also rare, unbuyable pokeballs, they are often grouped in when people mention apriballs, though they technically aren't.  
                </Typography>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'start', textIndent: '30px'}}>
                    For a long time, outside of the game they were introduced, these pokeballs were completely unobtainable. However, in recent years, they have been
                    made available in the games, though are very rare to obtain. People like to collect pokemon in these rare pokeballs, some due to their rarity, and
                    others because they just look pretty. The neat part is, ever since the pokemon X and Y games, pokemon bred and hatched from a pokemon egg <Highlighted><b>inherit the 
                    ball of their parent</b></Highlighted>. That means once you have one species of pokemon in a particular pokeball, you can essentially <Highlighted><b>duplicate that pokemon/ball
                    combination</b></Highlighted> and <Highlighted><b>trade it with others</b></Highlighted>. 
                </Typography>
                <Typography sx={{fontSize: '16px', width: '100%', textAlign: 'start', textIndent: '30px'}}>
                    And that's where aprimon trading began. With hundreds of unique species' of pokemon and 11 balls to collect for each, full collections often number in the 
                    thousands. Factor in that most aprimon collectors also typically collect pokemon with rarer abilities called <Highlighted><b>hidden abilities</b></Highlighted>, and/or rarer moves 
                    called <Highlighted><b>egg moves</b></Highlighted>, and it can be almost a full-time job to track all this information! But for an aprimon collector, the joy of collecting is what
                    makes it all worth it.
                </Typography>
                
            </Box>
            {!userData.loggedIn && 
            <Box sx={{width: '50%', mt: 4, height: '100px', borderRadius: '10px', backgroundColor: theme.palette.color1.light, color: theme.palette.color1.contrastTextLight, ...theme.components.box.fullCenterCol}}>
                <Typography sx={{fontSize: '24px', fontWeight: 700}}>Sounds fun, I wanna try!</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, gap: 3}}>
                    <Button size='large' onClick={() => navigate('/demo-collection/new')} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Try a demo</Button>
                    <Button size='large' onClick={() => navigate('/register')} sx={{'&.MuiButtonBase-root': {color: theme.palette.color1.contrastText, backgroundColor: theme.palette.color2.main}}}>Register</Button>
                </Box>
            </Box>}
        </InfoWrapper>
    )
}