import {Box, Typography, FormGroup} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../../collectiontable/tabledata/imgdata'

export default function EditWrapper({children, imgLink, name, natDexNum, onClickFunc=undefined}) {
    const hoverStyles = onClickFunc !== undefined ? {'&:hover': {backgroundColor: '#cbcfd0', cursor: 'pointer'}} : {}
    const userNameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '1%'}}>
            <Box>
                <ImgData linkKey={imgLink}/>
            </Box>
            <Box sx={{width: '15%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...hoverStyles}} onClick={onClickFunc}>
                <Typography sx={{fontSize: '15px'}} align='center'>{getNameDisplay(userNameDisplaySettings, name, natDexNum)}</Typography>
            </Box>
            <FormGroup sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{
                    backgroundColor: '#e3e5e6', 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'row', 
                    position: 'relative', 
                    transformStyle: 'preserve-3d', 
                    zIndex: 500
                }}>
                    {children}
                </Box>
            </FormGroup>
        </Box>
    )
}