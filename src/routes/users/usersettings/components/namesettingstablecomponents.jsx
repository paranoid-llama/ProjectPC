import React from 'react'
import {Box, Typography, Paper, useTheme, Tabs, Tab, ToggleButton, TableRow, TableCell, Table, TableHead, TableBody, TableContainer, Grid} from '@mui/material'
import { getNameOptions } from './namesettinggeneration'
import ImgData from '../../../../components/collectiontable/tabledata/imgdata'

export const nameSettingTableHeader = () => {
    return (
        <>
        <TableRow sx={{backgroundColor: '#26BCC9', color: 'black', display: 'flex', flexDirection: 'row', width: '99%', height: '50px'}}>
            {/* <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%', borderTop: 'none'}} variant='head'>
            </TableCell> */}
            <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '15%', borderTop: 'none'}} variant='head'>
                <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                    Pokemon
                </Typography>
            </TableCell>
            <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '85%', borderTop: 'none'}} variant='head'>
                <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                    Name Options
                </Typography>
            </TableCell>
        </TableRow>
        </>
    )
}

const listNameOptions = (theme, poke, group, enabledOpt, currentNameSettings) => {
    const nameOptions = getNameOptions(group, poke, currentNameSettings)
    return (
        <Grid container sx={{...theme.components.box.fullCenterRow, width: '100%', height: '100%'}}>
            {nameOptions.map((opt) => {
                return (
                    <Grid item xs={5}>
                        <ToggleButton
                            value={opt}
                            selected={enabledOpt === opt}
                            sx={{fontSize: '12px', paddingY: 0.5, margin: 0.5}}
                        >
                            {opt}
                        </ToggleButton>
                    </Grid>
                )
            })}
        </Grid>
    )
}

export const nameSettingRowContent = (row, theme, group, enabledOpt, currentNameSettings) => {
    return (
        <>
            <TableCell sx={{width: '15%', height: '80px', position: 'relative', borderTop: 'none'}}>
                <Typography>{row}</Typography>
            </TableCell>
            <TableCell sx={{display: 'flex', height: '150px', justifyContent: 'center', alignItems: 'center', width: '85%', borderTop: 'none'}}>
                {listNameOptions(theme, row, group, enabledOpt, currentNameSettings)}
            </TableCell>
        </> 
    )
}

export const nameSettingVirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed'}} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} sx={{display: 'flex', flexDirection: 'row', width: '99%'}} />,
    TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};