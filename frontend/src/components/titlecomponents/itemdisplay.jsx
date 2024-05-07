import {Box, Typography, Grid, Tabs, Tab} from '@mui/material'
import { useState } from 'react'
import { getPossibleItems } from '../../infoconstants'
import ImgData from '../collectiontable/tabledata/imgdata'

export default function ItemDisplay({collectionGen, itemTradeStatus, lfItems, ftItems}) {
    const [itemType, setItemType] = useState(lfItems.length === 0 ? 'ft' : 'lf')
    const changeItemType = (newVal) => {setItemType(newVal)}

    const gridItemStyles = {
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#283f57',
        borderRadius: '5px',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '2px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
    }

    const totalItems = getPossibleItems(collectionGen)

    const renderItems = () => {
        const itemValuesArr = itemType === 'lf' ? lfItems : Object.keys(ftItems)
        const renderedItems = totalItems.filter(item => itemValuesArr.includes(item.value))
        const scalingStyles = {
            text: {fontSize: itemValuesArr.length <= 12 ? '12px' : '9px'},
            img: itemValuesArr.length <= 12 ? '30px' : '24px'
        }
        return (
            renderedItems.map(item => {
                const pluralSuffix = item.value === 'patch' ? 'es' : 's'
                return (
                    <Grid item xs={itemValuesArr.length <= 12 ? 2 : 1.75} key={`${item.display}-display`} sx={gridItemStyles}>
                        <Typography sx={scalingStyles.text}>{item.display}{pluralSuffix}</Typography>
                        <ImgData type='items' linkKey={item.value} size={scalingStyles.img}/>
                        {(itemType === 'ft') && <Typography sx={{...scalingStyles.text, opacity: ftItems[item.value] === 0 ? 0.5 : 1}}>{ftItems[item.value] === 0 ? '(Unknown)' : ftItems[item.value]}</Typography>}
                    </Grid>
                )
            })
        )
    }

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant='h6' sx={{fontSize: '18px', fontWeight: 700}}>Items</Typography>
            </Box>
            <Tabs value={itemType} onChange={(e, newVal) => changeItemType(newVal)} sx={{'&.MuiTabs-root': {height: '20px', minHeight: '12px', my: 0.25}, '& .MuiTab-root': {py: 0, minHeight: '12px'}}}>
                <Tab value='lf' disabled={itemTradeStatus === 'ft' || itemTradeStatus === 'none'} label='LF'/>
                <Tab value='ft' disabled={itemTradeStatus === 'lf' || itemTradeStatus === 'none'} label='FT'/>
            </Tabs>
            <Box sx={{width: '100%', height: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.15}}>
                    {renderItems()}
                </Grid>
            </Box>
        </Box>
    )
}