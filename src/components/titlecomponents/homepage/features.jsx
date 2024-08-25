import {Box, Typography} from '@mui/material'
import { useTheme } from '@mui/material'
import { useRef } from 'react'

export default function Features({}) {
    const theme = useTheme()

    return (
        <Box sx={{height: '400px', width: '100%', backgroundColor: theme.palette.color1.dark, color: theme.palette.color3.main, ...theme.components.box.fullCenterCol}}>
            <Box sx={{height: '10%', my: 2, ...theme.components.box.fullCenterRow}}>
                <Typography variant='h5' sx={{fontSize: '24px', fontWeight: 700}}>Features</Typography>
            </Box>
            <Box sx={{height: '90%', width: '96%', mb: 2, ...theme.components.box.fullCenterCol, gap: 2}}>
                <Box sx={{width: '100%', height: '50%', ...theme.components.box.fullCenterRow}}>
                    <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '400px', mr: 3}}>
                        <Typography sx={{fontSize: '24px', mb: 0.5, textAlign: 'center'}}><b>Customization</b></Typography>
                        <Typography sx={{fontSize: '14px', textAlign: 'center'}}>
                            Customize your aprimon collection whichever way you like, from the generation you collect in, pokemon, ball, or even pokemon/ball combos you collect. 
                            Your collection, your way.
                        </Typography>
                    </Box>
                    <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '400px', ml: 3}}>
                        <Typography sx={{fontSize: '24px', mb: 0.5, textAlign: 'center'}}><b>Accessibility</b></Typography>
                        <Typography sx={{fontSize: '14px', textAlign: 'center'}}>
                            Pokellections makes collection tracking very easy by providing you all the tools you need to track any pokemon information.
                            We will also update your collections for you based on new generation/legality information. You can just focus on the fun part of collecting.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{width: '100%', height: '50%', ...theme.components.box.fullCenterRow}}>
                    <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '400px', mr: 3}}>
                        <Typography sx={{fontSize: '24px', mb: 0.5, textAlign: 'center'}}><b>Sheets Functionality</b></Typography>
                        <Typography sx={{fontSize: '14px', textAlign: 'center'}}>
                            Are you tracking an aprimon collection using Google Sheets? We can import straight from your sheet to make the transition seamless.
                            All it takes is a couple of clicks to make the switch!
                        </Typography>
                    </Box>
                    <Box sx={{width: '50%', height: '100%', ...theme.components.box.fullCenterCol, justifyContent: 'start', maxWidth: '400px', ml: 3}}>
                        <Typography sx={{fontSize: '24px', mb: 0.5, textAlign: 'center'}}><b>Trade Set-up</b></Typography>
                        <Typography sx={{fontSize: '14px', textAlign: 'center'}}>
                            No more combing through other people's sheets to see if they have anything you're missing and/or anything you can offer. 
                            We'll not only do that for you, we'll track your trades and automatically update your collection once it's marked as complete.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}