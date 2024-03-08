import {Outlet, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Box, Typography} from '@mui/material'

export default function Root() {
    return (
      <>
        <Box sx={{flex: 1, marginTop: 5, ml: 7}}>
            <Typography variant='h4' sx={{mb: 7}}>Home Page!</Typography>
            <Link to='/collections'>Go to collections</Link>
        </Box>
      </>
    );
  }