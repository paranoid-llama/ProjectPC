import {Box, Typography, useTheme, Button} from '@mui/material'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import { useNavigate } from 'react-router'

export default function AdminMain({}) {
    const theme = useTheme()
    const navigate = useNavigate()

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Typography sx={{fontSize: '32px', mb: 4}}>Admin Functions</Typography>
            <Box sx={{...theme.components.box.fullCenterCol, gap: 1}}>
                <Button size='large' variant='contained' onClick={() => navigate('/admin/table-data')}>Change Collection Table Data</Button>
                <Button size='large' variant='contained' onClick={() => navigate('/admin/send-notifications')}>Send Notifications</Button>
            </Box>
        </BodyWrapper>
    )
}