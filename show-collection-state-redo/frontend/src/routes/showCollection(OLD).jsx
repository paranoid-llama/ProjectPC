import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import CollectionListBody from "./../components/collectionListBody"
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import {TableVirtuoso} from 'react-virtuoso'

export default function ShowCollection() {
    const [collection, setCollection] = useState({})

    const styles = {textAlign: 'center', color: 'white'}
    const collectionId = useLocation().pathname.replace("/collections/", "")

    function handleEditOwned(e, pokename, ballname, collectionID) {
        const editData = {
            pokename,
            ballname,
            isOwned: e.target.checked
        }
        fetch(`http://localhost:3000/collections/${collectionID}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editData)
        })
    } 
    
    useEffect(() => {
        fetch(`http://localhost:3000/collections/${collectionId}`)
            .then((res) => res.json())
            .then((data) => setCollection(data))
    }, [])

    return (
        <>
        <Box sx={{margin: 5, textAlign: 'center', width: 'fit-content'}}>
            <h1>Collection info</h1>
            <h2>Owner: {collection.owner && collection.owner.username}</h2>
            <Table size="small" sx={{backgroundColor: '#272625', color: 'white', minWidth: 650}}>
                <TableHead>
                    <TableRow sx={{}}>
                        <th colSpan="3">Pokemon</th>
                        <th colSpan="11">Ball</th>
                    </TableRow>
                    <TableRow>
                        <th>#</th>
                        <th>img</th>
                        <th>Name</th>
                        <th>Fast</th>
                        <th>Friend</th>
                        <th>Heavy</th>
                        <th>Level</th>
                        <th>Love</th>
                        <th>Lure</th>
                        <th>Moon</th>
                        <th>Beast</th>
                        <th>Dream</th>
                        <th>Safari</th>
                        <th>Sport</th>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collection.ownedPokemon && collection.ownedPokemon.map((pokemon) => {
                        const heading = () => {
                            return (
                                <>
                                <TableCell sx={styles}>{pokemon.natDexNum}</TableCell>
                                <TableCell sx={styles}><img 
                                    
                                    src={
                                        `https://res.cloudinary.com/duaf1qylo/image/upload/pokesprites/${pokemon.natDexNum < 10 ? `00${pokemon.natDexNum}` : pokemon.natDexNum < 100 ? `0${pokemon.natDexNum}` : `${pokemon.natDexNum}`}.png`}
                                /></TableCell>
                                <TableCell sx={styles}>{pokemon.name}</TableCell>
                                </>
                            )
                        }
                        const balls = ['fast', 'friend', 'heavy', 'level', 'love', 'lure', 'moon', 'beast', 'dream', 'safari', 'sport']
                            
                        return (
                            <>
                            <TableRow className="CollectionListRow">
                                {heading()}
                                {balls.map((b) => {
                                    const ball = pokemon.balls[b]
                                    return (
                                        <TableCell className="CollectionListBody" sx={styles}>
                                            {/* <tr className="CollectionListBodyRowCheck"> */}
                                                {ball !== undefined ? 
                                                ball.isOwned ?
                                                <Checkbox className="ownedPokemon" defaultChecked/> 
                                                : <Checkbox className="ownedPokemon" onClick={(e) => handleEditOwned(e, pokemon.name, b, collection._id)}/>
                                                : 'x'}
                                            {/* </tr> */}
                                            {ball !== undefined && ball.isOwned ? <div className="CollectionListBodyRowInfo">
                                                {ball.isOwned === true ? ball.isHA === true ? 
                                                <div className="RowInfoHAIndicator"><span className="HAIndicator"><b>HA</b></span></div>
                                                : <div className="RowInfoHAIndicator"><span className="HAIndicator">Non-HA</span></div>
                                                : null}
                                                {ball.isOwned === true ? ball.EMs.length >= 4 ?
                                                <div className="RowInfoEMIndicator"><span className="EMIndicator"><b>4EMs</b></span></div>
                                                : null : null }
                                            </div> : null}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                            </>    
                        )
                    })}
                </TableBody>
            </Table>
        </Box>
    </>
    )
}