import './../../../../utils/styles/componentstyles/imgdata.css'

export default function ImgData({type='poke', linkKey, size='32px', setAbsolutePosition=false}) {
    const imgLinkModifier = type === 'poke' ? 'sprites' : type === 'ball' ? 'balls' : type === 'gender' && 'icons'
    const imgLink = `https://res.cloudinary.com/duaf1qylo/image/upload/${imgLinkModifier}/${linkKey}.png`
    const className = setAbsolutePosition ? 'position-absolute' : ''
    return (
        <img width={size} height={size} src={imgLink} className={className}></img>
    )
}