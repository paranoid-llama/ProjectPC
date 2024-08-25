import {useRouteError} from "react-router-dom";
import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from "./components/partials/routepartials/bodywrapper";

export default function ErrorPage() {
    const error = useRouteError();
    const theme = useTheme()

    return (
        <BodyWrapper>
            <Box sx={{height: '750px', width: '100%', borderRadius: '10px', ...theme.components.box.fullCenterCol, justifyContent: 'start', backgroundColor: 'rgba(220, 53, 69, 0.7)', color: 'rgba(140, 53, 69, 1)'}}>
            <Typography sx={{fontSize: '28px', fontWeight: 700, my: 1, mt: 5}}>An unexpected error has occurred!</Typography>
            <Typography sx={{fontSize: '24px'}}>{error.status} {error.name}</Typography>
            <Typography> <i>{error.message}</i></Typography>
            </Box>
        </BodyWrapper>
    )
}