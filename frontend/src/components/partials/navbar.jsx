import "./navbar.css"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Fragment } from "react";

export default function NavBar() {
    const icons = ['home', 'search', 'createcollection', 'login']
    const iconLinks = ['/', '/search', '/collections/new', '/login']

    return (
        <Box sx={{flexGrow: 1, width: '100%'}}>
            <AppBar position="relative">
                <div className="NavBar">
                    <Typography
                        variant="h4"
                        noWrap
                        sx={{flexGrow: 1, display: {sm: 'flex'}, mx: 5}}
                        className="NavTypography"
                    >
                        <Link href="/" sx={{color: '#FFF'}} underline="none">Pokollections</Link>
                    </Typography>
                    {icons.map((i, idx) => {
                        return (
                            <Fragment key={i}>
                                <Link 
                                    href={iconLinks[idx]} 
                                    sx={{mr: 2, display: {sm:'flex'}, justifyContent: {xs: 'center'}, width: '5%'}}
                                >
                                    <IconButton
                                        size="small"
                                        edge="end"
                                        aria-label={i === 'createcollection' ? `${i.slice(0, 5)} ${i.slice(6, 15)}` : i}
                                        className="NavIcons"
                                    >
                                        <img src={`https://res.cloudinary.com/duaf1qylo/image/upload/icons/${i}white.png`} height='20px' width= '20px'/>
                                    </IconButton>
                                </Link>
                            </Fragment>
                        )
                    })}
                </div>
            </AppBar>
        </Box>
    )
}