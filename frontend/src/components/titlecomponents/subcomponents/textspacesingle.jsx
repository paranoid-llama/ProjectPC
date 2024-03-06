import {Box, Typography} from '@mui/material'

export default function TextSpaceSingle({bgColor, textColor, text, multipleTexts, label, labelBgColor, width, gradient, otherStyles, otherLabelStyles, otherTextStyles, textBgColor, displayingTags}) {
    //displayingTags is for when there's no uniform text for the area, but rather they display text blurbs of user preferences. Refer to show collection under trade status
    const hasLabel = label !== undefined
    const bgStyle = gradient ? {background: bgColor} : {backgroundColor: bgColor}
    return (
        hasLabel ? 
        <Box sx={{
            display: 'flex', 
            justifyContent: 'start', 
            alignItems: 'center', 
            flexDirection: 'row', 
            height: '2rem', 
            width, 
            ...bgStyle, 
            ...otherStyles, 
            borderTopLeftRadius: '15px', 
            borderBottomLeftRadius: '15px'
        }}>
            <Box sx={{margin: 0, width: '25%'}}>
                <Typography sx={{color: textColor, fontWeight: 700, margin: 0, padding: '4px', backgroundColor: labelBgColor, borderRadius: '15px', ...otherLabelStyles}}>{label}</Typography>
            </Box>
            <Box sx={{margin: 0, marginLeft: '0.8rem'}}>
                <Typography sx={{color: textColor, ...otherTextStyles}}>{text}</Typography>
            </Box>
        </Box> :
        displayingTags ? 
        <Box 
            sx={{
                display: 'flex', 
                justifyContent: 'center', 
                flexDirection: 'row', 
                height: '2rem', 
                width, 
                ...bgStyle, 
                ...otherStyles, 
                borderTopLeftRadius: '15px', 
                borderBottomLeftRadius: '15px'
            }}
        >
            <Box sx={{margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {multipleTexts.map((text) => {
                    return <Typography 
                                key={`${text}-Tag`}
                                sx={{
                                    color: textColor, 
                                    fontWeight: 700, 
                                    margin: 0, 
                                    padding: '4px', 
                                    borderRadius: '15px', 
                                    backgroundColor: labelBgColor,
                                    ...otherTextStyles
                                }}>
                                    {text}
                            </Typography>
                })}
            </Box>
        </Box> : 
        <Box sx={{display: 'flex', justifyContent: 'start', flexDirection: 'row', height: '2rem', width, bgColor}}>
            <Box sx={{margin: 0}}>
                <Typography sx={{color: textColor, ...otherTextStyles}}>{text}</Typography>
            </Box>
        </Box>
    )
}