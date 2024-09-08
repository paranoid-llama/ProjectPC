import DataCell from "../tabledata/datacell";
import { connect } from "react-redux";
import { TableCell, Box, Typography } from "@mui/material";
import ImgData from "../tabledata/imgdata";
import { apriballs, homeDisplayGames, getGameColor } from "../../../../common/infoconstants/miscconstants.mjs";
import { OnHandQtyDisplay } from "./bypokemoncomponents";

export default function OnHandByPokemonDisplay({columns, row, pokemonId, isEditMode, isSelected, setSelected, styles, availableGames=undefined}) {
    // console.log(row)
    // console.log(columns)
    const displayAvailableGames = availableGames !== undefined
    return (
        <>
        {columns.map(c => {
            // console.log(row)
            const isBallQty = apriballs.includes(c.dataKey)
            const isBlackSquare = row.balls === undefined || (isBallQty && row.balls[c.dataKey] === undefined) || isBallQty && (row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].numTotal === 0)
            
            const label = !isBlackSquare && (isBallQty ? row.balls[c.dataKey] : row[c.dataKey])
            const alignment = c.label === '#' ? {width: '90%', position: 'relative'} :
            (c.label === 'img') ? {width: '90%'} : {width: '90%', position: 'relative'}
            const displayHomeGames = c.dataKey === 'name' && displayAvailableGames
            return (
                isBallQty ? 
                <OnHandQtyDisplay 
                    key={`onhand-${row.name}-${c.dataKey}-qty`}
                    qty={!isBlackSquare && row.balls[c.dataKey].numTotal}
                    nonHAQty={!isBlackSquare && (row.balls[c.dataKey].numNonHA === undefined ? 0 : row.balls[c.dataKey].numNonHA)}
                    reserved={!isBlackSquare && row.balls[c.dataKey].reserved}
                    styles={styles}
                    blackSquare={isBlackSquare}
                /> : 
                <TableCell 
                    key={`onhand-${row.name}-${c.label === 'img' ? 'img' : c.dataKey}-column`}
                    padding='none' 
                    sx={!(isBlackSquare) ? {...styles.tableCell, position: 'relative', height: '72px'} : {backgroundColor: 'black'}}
                >
                    <Box sx={{display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                        <Box sx={{...styles.bodyColor, ...alignment, height: '32px'}}>
                            {c.isImg ? 
                            <><Box sx={{position: 'absolute', top: 'calc(50% - 16px)', right: 'calc(50% - 16px)'}}><ImgData type='poke' size='32px' linkKey={row.imgLink}/></Box></> :
                            !(isBlackSquare) && 
                                <Typography 
                                    sx={{
                                        width: '100%', 
                                        height: '100%', 
                                        textAlign: 'center', 
                                        position: 'absolute', 
                                        left: '0px', top: '0px', 
                                        display: 'flex',
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontSize: '14px'
                                    }} 
                                    variant={'body2'}
                                >
                                    {label}
                                </Typography>
                            }
                            {displayHomeGames &&  
                            <Box sx={{position: 'absolute', fontSize: '10px', width: '80%', right: '10%', bottom: '-3px', display: 'flex', justifyContent: 'center'}}>
                                {homeDisplayGames.map((game, idx) => {
                                    const nameOfGame = game === 9 ? 'S/V' : game === 'swsh' ? 'SW/SH' : game === 'bdsp' && 'BD/SP'
                                    const firstGame = nameOfGame.slice(0, nameOfGame.indexOf('/'))
                                    const secondGame = nameOfGame.slice(nameOfGame.indexOf('/')+1, nameOfGame.length)
                                    const firstGameColor = getGameColor(firstGame)
                                    const secondGameColor = getGameColor(secondGame)
                                    const gamesEnabled = availableGames.includes(game)
                                    const margin = idx !== 0 ? {ml: 1} : {} 
                                    return (
                                        <Box key={`available-home-games-display-${nameOfGame}`} sx={{display: 'flex'}}>
                                            <Typography sx={{fontSize: '10px', color: firstGameColor, opacity: gamesEnabled ? 1 : 0.4, ...margin}}>{firstGame}</Typography>
                                            <Typography sx={{fontSize: '10px', color: secondGameColor, opacity: gamesEnabled ? 1 : 0.4}}>/{secondGame}</Typography>
                                        </Box>
                                    )
                                })}
                            </Box>
                            }
                        </Box>
                    </Box>
                </TableCell>
            )
        })}
        </>
    )
}

// const mapStateToProps = (state, ownProps) => {
//     if (!ownProps.isEditMode) {
//         return {}
//     }
//     const pokemon = selectOnHandPokemon(state, ownProps.pokemonId)
//     const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
//     return {
//         row: pokemon,
//         isSelected
//     }
// }

// const mapDispatchToProps = (dispatch, ownProps) => {
//     if (!ownProps.isEditMode) {
//         return {}
//     }
//     return {
//         setSelected: () => dispatch(setSelected(ownProps.pokemonId))
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(OnHandByPokemonDisplay)