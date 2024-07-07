import {useRouteError} from "react-router-dom";
import {Box, Typography, useTheme} from '@mui/material'
import BodyWrapper from "./components/partials/routepartials/bodywrapper";

export default function ErrorPage() {
    const error = useRouteError();
    const theme = useTheme()

    return (
        <BodyWrapper>
            <Box sx={{height: '750px', width: '100%', borderRadius: '10px', ...theme.components.box.fullCenterCol, backgroundColor: 'rgba(220, 53, 69, 0.8)', color: 'white'}}>
            <Typography>Oops! An unexpected error has occurred!</Typography>
            <Typography>{error.data}</Typography>
            <Typography>{error.status} <i>{error.statusText || error.message}</i></Typography>
            </Box>
        </BodyWrapper>
    )
}