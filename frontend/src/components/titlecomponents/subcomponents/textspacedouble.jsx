import TextSpaceSingle from "./textspacesingle";

export default function TextSpaceDouble({text1, label1, text2, label2, colorStyles, width, isLast, otherTextStyles}) {
    const {bgColor1, isGradient1, bgColor2, isGradient2, textColor1, textColor2, labelBgColor1, labelBgColor2} = colorStyles
    const bottomBorderStyle = isLast ? {} : {borderBottom: '1px solid white'}
    const text1IsMultiple = typeof text1 === 'object'
    const text2IsMultiple = typeof text2 === 'object'
    const hasOtherTextStyles = otherTextStyles !== undefined
    const additionalLabel1Styles = hasOtherTextStyles && otherTextStyles.additionalLabel1Styles !== undefined ? otherTextStyles.additionalLabel1Styles : {}
    const additionalLabel2Styles = hasOtherTextStyles && otherTextStyles.additionalLabel2Styles !== undefined ? otherTextStyles.additionalLabel2Styles : {}
    const additionalText1Styles = hasOtherTextStyles && otherTextStyles.additionalText1Styles !== undefined ? otherTextStyles.additionalText1Styles : {}
    const additionalText2Styles = hasOtherTextStyles && otherTextStyles.additionalText2Styles !== undefined ? otherTextStyles.additionalText2Styles : {}
    return (
        <>
        <TextSpaceSingle 
            bgColor={bgColor1} 
            textColor={textColor1} 
            text={text1IsMultiple ? undefined : text1} 
            multipleTexts={text1IsMultiple ? text1 : undefined}
            label={label1} 
            labelBgColor={labelBgColor1} 
            gradient={isGradient1}
            width={width} 
            otherStyles={{borderBottom: '1px solid white', marginBottom: 0}} 
            otherLabelStyles={additionalLabel1Styles}
            otherTextStyles={additionalText1Styles}
            displayingTags={text1IsMultiple ? true : false}
        />
        <TextSpaceSingle 
            bgColor={bgColor2} 
            textColor={textColor2} 
            text={text2IsMultiple ? undefined : text2} 
            multipleTexts={text2IsMultiple ? text2 : undefined}
            label={label2} 
            labelBgColor={labelBgColor2} 
            gradient={isGradient2}
            width={width} 
            otherStyles={{marginTop: 0, ...bottomBorderStyle}}
            otherLabelStyles={additionalLabel2Styles}
            otherTextStyles={additionalText2Styles}
            displayingTags={text2IsMultiple ? true : false}
        />
        </>
    )
}