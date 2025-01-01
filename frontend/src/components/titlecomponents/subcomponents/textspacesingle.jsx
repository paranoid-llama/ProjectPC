import {Box, Typography, Tooltip, useTheme} from '@mui/material'

export default function TextSpaceSingle({colorStyles, text, textTag=undefined, textTagStyle, multipleTexts, multipleTextTooltips, label, width, otherStyles, otherLabelStyles, otherTextStyles, textBgColor, displayingTags, tagAreaStyles, largeTextArea, largeTextAreaStyles, largeTextStyles, buttonAdornmentFunc, noRounding=false}) {
    //displayingTags is for when there's no uniform text for the area, but rather they display text blurbs of user preferences. Refer to show collection under trade status
    const theme = useTheme()
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
            borderTopLeftRadius: noRounding ? '0px' : '15px', 
            borderBottomLeftRadius: noRounding ? '0px' : '15px'
        }}>
            <Box sx={{margin: 0, width: '25%'}}>
                <Typography sx={{color: textColor, fontWeight: 700, margin: 0, padding: '4px', backgroundColor: labelBgColor, borderRadius: '15px', ...otherLabelStyles}}>{label}</Typography>
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', margin: 0, marginLeft: '0.8rem'}}>
                <Typography sx={{color: textColor, ...otherTextStyles}}>{text}</Typography>
                {textTag && <Typography sx={{paddingX: 1, fontWeight: 700, ml: 1, borderRadius: '20px', fontSize: '11px', ...textTagStyle}}>{textTag}</Typography>}
            </Box>
            {buttonAdornmentFunc !== undefined && 
                <Box sx={{position: 'absolute', right: '7%', top: 0, height: '100%', borderRadius: '50%'}}>
                    {buttonAdornmentFunc()}
                </Box>
            }
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
                borderTopLeftRadius: noRounding ? '0px' : '15px', 
                borderBottomLeftRadius: noRounding ? '0px' : '15px'
            }}
        >
            <Box sx={{margin: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', ...tagAreaStyles}}>
                {multipleTextTooltips ? 
                multipleTexts.map(textData => {
                    return (
                        <Tooltip title={textData.tooltip} arrow key={`${textData.display}-Badge`}>
                            <Typography 
                                sx={{
                                    color: textColor, 
                                    fontWeight: 700, 
                                    padding: '4px', 
                                    borderRadius: '15px', 
                                    backgroundColor: labelBgColor,
                                    ':hover': {cursor: 'pointer'},
                                    ...otherTextStyles
                                }}>
                                    {textData.display}
                            </Typography>
                        </Tooltip>
                    )
                }) :
                multipleTexts.map((text) => {
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
        largeTextArea ? 
        <Box
            sx={{
                width, 
                ...bgStyle,
                ...largeTextAreaStyles,
                borderTopLeftRadius: noRounding ? '0px' : '15px', 
                borderBottomLeftRadius: noRounding ? '0px' : '15px'
            }}
        >
            <Typography 
                sx={{
                    ...largeTextStyles
                }}
            >
                {text}
            </Typography>
            {buttonAdornmentFunc !== undefined && 
                <Box sx={{position: 'absolute', right: '7%', bottom: '0%', borderRadius: '50%'}}>
                    {buttonAdornmentFunc()}
                </Box>
            }
        </Box> : 
        <Box sx={{display: 'flex', justifyContent: 'start', flexDirection: 'row', height: '2rem', width, ...bgStyle, ...otherStyles, borderTopLeftRadius: noRounding ? '0px' : '15px', borderBottomLeftRadius: noRounding ? '0px' : '15px'}}>
            <Box sx={{margin: 0, width: '100%', display: 'flex', alignItems: 'center'}}>
                <Typography sx={{color: textColor, ...otherTextStyles}}>{text}</Typography>
            </Box>
        </Box>
    )
}