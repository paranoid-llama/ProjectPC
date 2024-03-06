import {Box, Typography, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, CardActionArea} from '@mui/material'
import Header from '../../titlecomponents/subcomponents/header'

export default function CollectionTypeSelection({}) {
    //add more collection types here when you set it up
    return (
        <>
            <Header additionalStyles={{color: 'black', marginTop: 2}}>Select a Collection Type</Header>
            
            <Card sx={{maxWidth: 500}}>
                <CardActionArea>

                </CardActionArea>
            </Card>
        </>
    )
}