import {Box, Typography} from '@mui/material'

export default function TextSpaceSingle({colorStyles, text, multipleTexts, label, width, otherStyles, otherLabelStyles, otherTextStyles, textBgColor, displayingTags, tagAreaStyles}) {
    //displayingTags is for when there's no uniform text for the area, but rather they display text blurbs of user preferences. Refer to show collection under trade status
    const hasLabel = label !== undefined
    const {bgColor, textColor, labelBgColor, isGradient} = colorStyles
    const bgStyle = isGradient ? {background: bgColor} : {backgroundColor: bgColor}
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
                flexDirection: 'row', 
                height: '2rem', 
                width, 
                ...bgStyle, 
                ...otherStyles, 
                borderTopLeftRadius: '15px', 
                borderBottomLeftRadius: '15px'
            }}
        >
            <Box sx={{margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', ...tagAreaStyles}}>
                {multipleTexts.map((text) => {
                    return <Typography 
                                key={`${text}-Tag`}
                                sx={{
                                    color: textColor, 
                                    fontWeight: 700, 
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
        <Box sx={{display: 'flex', justifyContent: 'start', flexDirection: 'row', height: '2rem', width, ...bgStyle}}>
            <Box sx={{margin: 0}}>
                <Typography sx={{color: textColor, ...otherTextStyles}}>{text}</Typography>
            </Box>
        </Box>
    )
}