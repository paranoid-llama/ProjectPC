import './../../../../utils/styles/componentstyles/imgdata.css'

export default function ImgData({type='poke', linkKey, size='32px', setAbsolutePosition=false, imgFolder='none', additionalClasses=''}) {
    const imgLinkModifier = type === 'poke' ? 'sprites' : type === 'ball' ? 'balls' : (type === 'gender' || type === 'icons' ) ? 'icons' : type === 'items' ? 'items' : type === 'cards' && 'cards'
    const imgLink = `https://res.cloudinary.com/duaf1qylo/image/upload/${imgFolder !== 'none' ? imgFolder : imgLinkModifier}/${linkKey}.png`
    const className = setAbsolutePosition ? 'position-absolute' : ''
    const noCustomSize = size === 'inherit'
    if (noCustomSize) {
        return (
            <img src={imgLink} className={`${className} ${additionalClasses}`}></img>
        )
    }
    return (
        <img width={size} height={size} src={imgLink} className={`${className} ${additionalClasses}`}></img>
    )
}