import {Box} from '@mui/material'
import BodyWithBanner from '../routepartials/bodywithbanner'
import BodyWrapper from '../routepartials/bodywrapper'
import theme from '../../../../utils/styles/globalstyles/theme'

const skeletonBg = {backgroundColor: 'rgb(200, 200, 200)', borderRadius: '10px'}

export function ShowCollectionSkeleton ({}) {

    return (
        <BodyWithBanner text='' bannerSx={{backgroundColor: '#26BCC9', height: '28px'}}>
            <Box sx={{display: 'flex', height: '200px', width: '100%'}}>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '45%'}}>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px', marginBottom: '2px'}}></Box>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px', marginBottom: '2px'}}></Box>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px', marginBottom: '2px'}}></Box>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px'}}></Box>
                </Box>
            </Box>
            <Box sx={{height: '48px', width: '100%'}}></Box>
            <Box sx={{...skeletonBg, height: '800px', width: '100%'}}></Box>
        </BodyWithBanner>
    )
}

export function ShowUserSkeleton({}) {

    return (
        <BodyWithBanner text='' bodySx={{marginBottom: 0, display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center'}} bannerSx={{backgroundColor: '#26BCC9', height: '28px'}}>
            <Box sx={{width: '100%', height: '250px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{width: '200px', height: '100%'}}>
                    <Box sx={{width: '200px', height: '200px', ...skeletonBg, borderRadius: '50%'}}></Box>
                </Box>
                <Box sx={{width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ml: '24px'}}>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px', marginBottom: '2px'}}></Box>
                    <Box sx={{...skeletonBg, width: '100%', height: '30px', marginBottom: '2px'}}></Box>
                    <Box sx={{...skeletonBg, width: '100%', height: '78px'}}></Box>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '80px', marginTop: '-24px'}}></Box>
            <Box sx={{width: '100%', maxWidth: '1200px', height: '150px', marginTop: 3, ...skeletonBg}}></Box>
        </BodyWithBanner>
    )
}

export function UserSettingsSkeleton({}) {

    return (
        <BodyWrapper sx={{ml: 0, mr: 0, mb: 0, display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
            <Box sx={{height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Box sx={{width: '150px', height: '150px', ...skeletonBg, borderRadius: '50%'}}></Box>
                <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', ml: 5}}>
                    <Box sx={{width: '210px', height: '48px', ...skeletonBg}}></Box>
                    <Box sx={{width: '210px', height: '30px', mt: '2px', ...skeletonBg}}></Box>
                </Box>
            </Box>
            <Box sx={{minHeight: '600px', width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start'}}>
                <Box sx={{height: '100%', minHeight: '600px', maxWidth: '300px', width: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start'}}>
                    <Box sx={{width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Box sx={{width: '95%', height: '110px', ...skeletonBg}}></Box></Box>
                    <Box sx={{width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Box sx={{width: '95%', height: '110px', ...skeletonBg}}></Box></Box>
                    <Box sx={{width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Box sx={{width: '95%', height: '110px', ...skeletonBg}}></Box></Box>
                    <Box sx={{width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Box sx={{width: '95%', height: '110px', ...skeletonBg}}></Box></Box>
                    <Box sx={{width: '100%', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Box sx={{width: '95%', height: '110px', ...skeletonBg}}></Box></Box>
                </Box>
                <Box sx={{height: '600px', width: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Box sx={{width: '95%', height: '580px', ...skeletonBg}}></Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}

export function NewTradeOfferSkeleton({}) {

    return (
        <BodyWrapper sx={{mt: 3, mx: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', maxWidth: '1200px', width: '100%'}}>  
                <Box sx={{height: '42px', width: '400px', ...skeletonBg, mb: '8px'}}></Box>
                <Box sx={{height: '50px', width: '75%', ...skeletonBg, mb: '24px'}}></Box>
                <Box sx={{height: '150px', width: '100%', ...skeletonBg}}></Box>
            </Box>
        </BodyWrapper>
    )
}

export function UserNotificationsTradesSkeleton({}) {

    return (
        <BodyWrapper sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', mt: -2, pb: 0.5, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start', ml: 5, ...skeletonBg, height: '50px', width: '250px'}}></Box>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '90%', width: '100%'}}>
                    <Box sx={{height: '100%', width: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', mt: 1, gap: 1}}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '30%', width: '100%'}}>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60%', height: '100%'}}>
                                <Box sx={{width: '90%', height: '50.5px', ...skeletonBg}}></Box>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '40%', height: '100%'}}>
                                <Box sx={{width: '90%', height: '50.5px', ...skeletonBg}}></Box>
                            </Box>
                        </Box>
                        <Box sx={{height: '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', ...skeletonBg}}></Box>
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}

export function ShowTradeSkeleton({}) {

    return (
        <BodyWrapper sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', maxWidth: '1200px', width: '100%', gap: 1}}>  
                <Box sx={{height: '50px', width: '90%'}}></Box>
                <Box sx={{height: '285px', width: '90%', ...skeletonBg}}></Box>
                <Box sx={{height: '750px', width: '90%', ...skeletonBg, mt: '8px'}}></Box>
            </Box>
        </BodyWrapper>
    )
}