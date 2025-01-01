import {TableHead, Table, TableContainer, TableRow, TableBody, Paper} from '@mui/material'
import { forwardRef } from 'react'

export default function getTableVirtuosoComponents(theme) {
    return {
        Scroller: forwardRef((props, ref) => (
            <TableContainer 
                component={Paper} 
                {...props} 
                ref={ref} 
                sx={{
                    ...props.sx,
                    '&::-webkit-scrollbar': {
                        width: '0.3rem'
                    },
                    '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.color3.main,
                        borderRadius: '5px'
                    },
                    overflowX: 'hidden'
                }}
            />
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed'}} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
}