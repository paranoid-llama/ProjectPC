import {Box, Typography, useTheme} from '@mui/material'
import { useState } from 'react'
import BodyWrapper from '../../../components/partials/routepartials/bodywrapper'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import { useLocation, useNavigate, useRouteLoaderData, useLoaderData, Outlet, useRevalidator } from 'react-router'
import hexToRgba from 'hex-to-rgba'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import Account from './account'
import Profile from './profile'
import Privacy from './privacy'
import Display from './display'
import Other from './other'

export default function SettingsPage({userData}) {
    const theme = useTheme()
    // const userData = useLoaderData()
    const locationData = useLocation()
    const revalidator = useRevalidator()
    const catInit = locationData.state !== null ? (locationData.state.catInit !== undefined ? locationData.state.catInit : '') : ''
    const settingCategories = ['profile', 'account', 'privacy', 'display', 'other']
    const [settingCategory, setSettingCategory] = useState(catInit)

    const changeCategory = (newCat) => {
        setSettingCategory(newCat)
    }
    
    const revalidateFunc = () => {
        revalidator.revalidate()
    }

    const CatComponent = settingCategory === 'profile' ? Profile : settingCategory === 'account' ? Account : settingCategory === 'privacy' ? Privacy : 
        settingCategory === 'display' ? Display : Other

    return (
        <BodyWrapper sx={{mx: 0, mb: 0, ...theme.components.box.fullCenterCol}}>
            <Box sx={{maxHeight: '150px', ...theme.components.box.fullCenterRow}}>
                <Box sx={{opacity: 0.5}}><ImgData type='icons' linkKey='user' size='150px'/></Box>
                <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                    <Typography sx={{fontSize: '32px', fontWeight: 700}}>User Settings</Typography>
                    <Typography sx={{fontSize: '20px', mb: 2}}>{userData.username}</Typography>
                </Box>
            </Box>
            <Box sx={{minHeight: '600px', width: '100%', maxWidth: '1200px', ...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                <Box sx={{height: '100%', minHeight: '600px', maxWidth: '300px', width: '30%', ...theme.components.box.fullCenterCol, justifyContent: 'start', color: 'white', borderTop: '1px solid black'}}>
                    {settingCategories.map((cat, idx) => {
                        const evenOption = idx % 2 === 0
                        const isSelectedCategory = settingCategory === cat
                        const backgroundColor = isSelectedCategory ? theme.palette.color3.dark : evenOption ? theme.palette.color1.main : theme.palette.color1.darker
                        const backgroundColorStyle = {backgroundColor}
                        const hoverStyle = isSelectedCategory ? {} : evenOption ? {'&:hover': {backgroundColor: hexToRgba(backgroundColor, 0.9), cursor: 'pointer'}} : {'&:hover': {backgroundColor: hexToRgba(backgroundColor, 0.8), cursor: 'pointer'}}
                        return (
                            <Box 
                                sx={{
                                    height: '120px', 
                                    width: '100%', 
                                    borderTop: idx === 0 ? 'none' : '1px solid black', 
                                    position: 'relative',
                                    color: isSelectedCategory ? 'black' : 'inherit',
                                    ...theme.components.box.fullCenterCol, 
                                    ...backgroundColorStyle, 
                                    ...hoverStyle
                                }} 
                                key={`user-setting-${cat}-category`}
                                onClick={() => changeCategory(cat)}
                            >
                                <Typography sx={{width: '100%', textAlign: 'center', fontSize: '36px'}}>
                                    {capitalizeFirstLetter(cat)}
                                </Typography>
                            </Box>
                        )
                    })}
                </Box>
                <Box sx={{height: '600px', width: '70%', ...theme.components.box.fullCenterCol, borderTop: '1px solid black', borderBottom: '1px solid black', borderLeft: '1px solid black', backgroundColor: hexToRgba(theme.palette.color1.light, 0.3)}}>
                    {/* {settingCategory === '' ? 
                        <Typography sx={{fontSize: '18px', color: 'grey'}}><i>Click on a category to change settings</i></Typography> : 
                        <Outlet context={revalidateFunc}/>
                    } */}
                    {settingCategory === '' ?
                        <Typography sx={{fontSize: '18px', color: 'grey'}}><i>Click on a category to change settings</i></Typography> : 
                        <CatComponent 
                            user={userData}
                            revalidate={revalidateFunc}
                        />
                    }
                </Box>
            </Box>
        </BodyWrapper>
    )
}