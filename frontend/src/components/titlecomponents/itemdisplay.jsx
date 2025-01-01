import {Box, Typography, Grid, Tabs, Tab, styled, Paper, useTheme} from '@mui/material'
import { useState, forwardRef } from 'react'
import { getPossibleItems } from '../../../common/infoconstants/miscconstants.mjs'
import ImgData from '../collectiontable/tabledata/imgdata'
import { VirtuosoGrid } from 'react-virtuoso'
import ScrollBar from '../functionalcomponents/scrollbar'

export default function ItemDisplay({collectionGen, itemTradeStatus, lfItems, ftItems, sw}) {
    const startAtLf = itemTradeStatus === 'lf' || itemTradeStatus === 'lf/ft'
    const theme = useTheme()
    const [itemType, setItemType] = useState(startAtLf ? 'lf' : 'ft')
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
    const Item = styled(Paper)(() => gridItemStyles)
    const itemGridComponents = {
        List: forwardRef(({children, ...props}, ref) => (
            <Grid {...props} container ref={ref} spacing={0.5} rowSpacing={1} sx={{width: '100%'}}>
                {children}
            </Grid>
        )),
        Item: forwardRef(({children, ...props}, ref) => (
            <Grid item {...props} xs={sw ? 3 : 2} ref={ref} sx={{}}>
                {children}
            </Grid>
        ))
    }

    const totalItems = getPossibleItems(collectionGen)

    const renderItems = () => {
        const itemValuesArr = itemType === 'lf' ? lfItems : Object.keys(ftItems)
        const renderedItems = totalItems.filter(item => itemValuesArr.includes(item.value))
        const scalingStyles = {
            text: {fontSize: itemValuesArr.length <= 12 ? '11px' : '8px'},
            img: itemValuesArr.length <= 12 ? '20px' : '16px'
        }
        return (
            itemValuesArr.length === 0 ? 
            <Box sx={{display: 'flex', flexDirection: 'center', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                <Typography sx={{fontSize: '14px', color: 'grey'}}><i>No info</i></Typography>
            </Box> : 
            <>
            {renderedItems.map(item => {
                const pluralSuffix = item.value === 'patch' ? 'es' : 's'
                return (
                    <Grid item xs={itemValuesArr.length <= 12 ? 2 : 1.75} key={`${item.display}-display`} sx={gridItemStyles}>
                        <Typography sx={scalingStyles.text}>{item.display}{pluralSuffix}</Typography>
                        <ImgData type='items' linkKey={item.value} size={scalingStyles.img}/>
                        {(itemType === 'ft') && <Typography sx={{...scalingStyles.text, opacity: ftItems[item.value] === 0 ? 0.5 : 1}}>{ftItems[item.value] === 0 ? '(Unknown)' : ftItems[item.value]}</Typography>}
                    </Grid>
                )
            })}
            </>
        )
    }

    const renderGridItem = (idx) => {
        const itemLiteral = itemType === 'lf' ? lfItems[idx] : Object.keys(ftItems)[idx]
        const item = totalItems.filter(i => i.value === itemLiteral)[0]
        const pluralSuffix = item.value === 'patch' ? 'es' : 's'
        const textScaling = (item.display+pluralSuffix).length > 12 ? '11px' : '14px'
        return (
            <Paper sx={{backgroundColor: theme.palette.color1.dark, height: sw ? (itemType === 'lf' ? '75px' : '80px') : itemType === 'lf' ? '80px' : '100px', position: 'relative'}}>
                <Typography sx={{color: theme.palette.color1.contrastText, fontSize: textScaling}}>{item.display}{pluralSuffix}</Typography>
                <Box sx={{position: 'absolute', width: '100%', ...theme.components.box.fullCenterRow, bottom: (sw) ? itemType === 'lf' ? '5px':'12px' : itemType === 'lf' ? '6px': '20px'}}><ImgData type='items' linkKey={item.value}/></Box>
                {(itemType === 'ft') && <Typography sx={{color: theme.palette.color1.contrastText,position: 'absolute', width: '100%', bottom: '0px', opacity: ftItems[item.value] === 0 ? 0.5 : 1, fontSize: ftItems[item.value] === 0 ? '11px' : '12px'}}>{ftItems[item.value] === 0 ? '(Unknown)' : ftItems[item.value]}</Typography>}
            </Paper>
        )
    } 

    const itemArr = itemType === 'lf' ? lfItems : Object.keys(ftItems)

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
                {itemArr.length === 0 ? 
                <Box sx={{width: '95%', height: '95%', border: '1px solid white', borderRadius: '10px', ...theme.components.box.fullCenterCol}}>
                    <Typography sx={{color: 'grey'}}><i>No {itemType === 'lf' ? 'LF' : 'FT'} Items</i></Typography>
                </Box> :
                <VirtuosoGrid
                    totalCount={itemArr.length}
                    components={{
                        ...itemGridComponents,
                        Scroller: forwardRef((props, ref) => {
                            const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
                            return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color3.main} children={props.children} otherProps={otherProps}/>
                        })
                    }}
                    style={{width: '95%', height: '95%', border: '1px solid white', borderRadius: '10px'}}
                    itemContent={(i) => renderGridItem(i)}
                />}
                {/* <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.15}}>
                    {renderItems()}
                </Grid> */}
            </Box>
        </Box>
    )
}