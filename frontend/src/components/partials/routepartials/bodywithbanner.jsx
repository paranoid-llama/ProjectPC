import Banner from "./banner";
import BodyWrapper from "./bodywrapper";
import { Box, Typography } from "@mui/material";

export default function BodyWithBanner({children, text, bodySx, bannerSx, doubleBanner, doubleBannerSx, doubleBannerText}) {
    return (
        <>
        <Banner sx={bannerSx}>{text}</Banner>
        {doubleBanner && 
            <Box sx={{width: '100%', alignItems: 'center'}}>
                <Typography align='left' variant='h2' sx={{fontWeight: 700, fontSize: '24px', textAlign: 'center', padding: '1rem', ...doubleBannerSx}}>{doubleBannerText}</Typography>
            </Box>
        }
        <BodyWrapper sx={bodySx}>
            {children}
        </BodyWrapper>
        </>
    )
}