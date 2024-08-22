import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./footer.css"
import Typography from '@mui/material/Typography';

export default function Footer() {
    const theme = useTheme()
    const navigate = useNavigate()
    return (
        <Box sx={{width: '100%', mt: 5, height: '60px'}}>
            <AppBar 
            position='static'
            sx={{
                flexGrow: 1, 
                width: '100%', 
                height: '100%',
                backgroundColor: 'transparent'
            }}>
                <div className="footer">
                    <Box sx={{...theme.components.box.fullCenterRow, gap: 2, mt: 0.5, mb: -1.5}}>
                        <Button sx={{fontSize: '12px'}} onClick={() => navigate('/info/about-us')}>About Us</Button>
                        <Button sx={{fontSize: '12px'}} onClick={() => navigate('/info/contact-us')}>Contact Us</Button>
                    </Box>
                    <Typography
                        noWrap
                        sx={{flexGrow: 1, display: {sm: 'flex'}, mx: 5, fontSize: '12px'}}
                        className="footertext"
                    >
                        {`Pokémon and All Respective Names are Trademark & © of Nintendo 1996-${new Date().getFullYear()}`}
                    </Typography>
                </div>
            </AppBar>
        </Box>
    )
}