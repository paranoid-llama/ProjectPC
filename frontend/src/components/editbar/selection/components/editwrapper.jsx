import {Box, Typography, FormGroup} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay'
import ImgData from '../../../collectiontable/tabledata/imgdata'

export default function EditWrapper({children, imgLink, name, natDexNum, onClickFunc=undefined, orientation='row', customNameWrapperStyles={}, customNameStyles={}, customTotalWrapperStyles={}, childWrapperSx={position: 'relative', transformStyle: 'preserve-3d'}, customImgSize='32px', lowerNameWrapperSx={}, imgWrapperSx={}, CustomNameImgPlate=undefined}) {
    const hoverStyles = onClickFunc !== undefined ? {'&:hover': {backgroundColor: '#cbcfd0', cursor: 'pointer'}} : {}
    const userNameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: orientation, justifyContent: 'start', alignItems: 'center', gap: '1%', ...customTotalWrapperStyles}}>
            {CustomNameImgPlate ? CustomNameImgPlate(userNameDisplaySettings) : 
            <Box sx={{display: 'flex', justifyContent: 'start', alignItems: 'center', gap: '5%', ...customNameWrapperStyles}}>
                <Box sx={{width: '30%', display: 'flex', alignItems: 'center', justifyContent: 'start', ...imgWrapperSx}}>
                    <ImgData linkKey={imgLink} size={customImgSize}/>
                </Box>
                <Box sx={{width: '70%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...hoverStyles, ...lowerNameWrapperSx}} onClick={onClickFunc}>
                    <Typography sx={{fontSize: '15px', ...customNameStyles}} align='center'>{getNameDisplay(userNameDisplaySettings, name, natDexNum)}</Typography>
                </Box>
            </Box>
            }
            <FormGroup sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{
                    backgroundColor: '#e3e5e6', 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: orientation,
                    zIndex: 500,
                    ...childWrapperSx
                }}>
                    {children}
                </Box>
            </FormGroup>
        </Box>
    )
}