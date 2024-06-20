import {TableRow, TableCell, Box} from '@mui/material'
import ImgData from '../../collectiontable/tabledata/imgdata'

export function setCollectionHeader(theme, columns) {
    const styles = theme.components.list.collection
    return (
        <>
        <TableRow sx={{backgroundColor: theme.components.color1.main}}>
            {columns.map(c => (
                c.ball ? 
                <TableCell 
                    key={`${c.label}-header`}
                    sx={{...styles.tableCell, width: c.width}} 
                    variant='head'>
                    <Box
                        sx={styles.ballHeaderDiv.divStyles}
                    >
                        <Box sx={styles.ballHeaderDiv.label}>{c.label}</Box>
                        <div>
                            <ImgData size='25px' type='ball' linkKey={c.dataKey}/>
                        </div>
                    </Box>
                </TableCell> :
                <TableCell 
                    key={`${c.label}-header`}
                    sx={{...styles.tableCell, width: c.width}} 
                    variant='head'
                    >
                    <Box 
                        sx={
                            c.label === 'img' ? 
                            {...styles.textHeader, paddingTop: '28px', paddingBottom: '28px'} : 
                            c.label === '#' ?
                            {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment} :
                            styles.textHeader
                        }
                    >
                        {c.label !== 'img' && c.label}
                    </Box>
                </TableCell>
            ))}
        </TableRow>
        </>
    )
}
