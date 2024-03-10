import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import "./footer.css"
import Typography from '@mui/material/Typography';

export default function Footer() {
    return (
        <Box sx={{width: '100%', mt: 5, height: '50px'}}>
            <AppBar 
            position='static'
            sx={{
                flexGrow: 1, 
                width: '100%', 
                height: '100%',
                backgroundColor: 'transparent'
            }}>
                <div className="footer">
                    <Typography
                        noWrap
                        sx={{flexGrow: 1, display: {sm: 'flex'}, mx: 5}}
                        className="footertext"
                    >
                        {`Pokémon and All Respective Names are Trademark & © of Nintendo 1996-${new Date().getFullYear()}`}
                    </Typography>
                </div>
            </AppBar>
        </Box>
    )
}