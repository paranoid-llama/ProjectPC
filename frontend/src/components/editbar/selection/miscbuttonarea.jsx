import { useState } from "react";
import FlexAppBarContainer from "./components/flexappbarcontainer";
import { useDispatch } from "react-redux"
import { setTags } from "../../../app/slices/collectionstate"
import { setUnsavedChanges } from "../../../app/slices/editmode";
import { useTagRequest } from "../../../../utils/functions/backendrequests/editcollection";
import {Button, Modal, Box, ToggleButton} from '@mui/material'
import DeleteOnHandConfirm from "../editsectioncomponents/onhandeditonly/deleteonhandconfirmmodal";

export default function MiscButtonArea({currentView, collectionID, pokemonInfo={}, listType}) {
    const [onHandDeleteConfirm, setOnHandDeleteConfirm] = useState(false)
    const dispatch = useDispatch()
    const openOnHandDeleteConfirm = () => {
        setOnHandDeleteConfirm(true)
    }
    const closeOnHandDeleteConfirm = () => {
        setOnHandDeleteConfirm(false)
    }

    console.log(pokemonInfo)

    const handleEditTags = (tagType, idx, ball) => {
        dispatch(setTags({tagType, idx, ball}))
        // useTagRequest(tagType, pokemonInfo.activeTag, {pokename: pokemonInfo.name, ballname: ball}, collectionID)
        dispatch(setUnsavedChanges())
    }

    const generateButtons = () => {
        return currentView === 'onHandEdit' ? 
            <Button size='small' sx={{fontSize: '10px', padding: 0}} onClick={openOnHandDeleteConfirm}>Delete On-Hand</Button> : 
            (currentView === 'collectionEdit' && pokemonInfo.isOwned === false) ? 
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <ToggleButton 
                    value='highlyWanted'
                    size='medium' 
                    sx={{fontSize: '14px', padding: '3px', border: 'none', color: '#73661e'}} 
                    selected={pokemonInfo.activeTag === 'highlyWanted'}
                    onClick={() => handleEditTags('highlyWanted', pokemonInfo.idx, pokemonInfo.ball)}
                >
                        Wanted
                </ToggleButton>
                <ToggleButton 
                    value='pending'
                    size='medium' 
                    sx={{fontSize: '14px', padding: '3px', border: 'none', color: '#73661e'}} 
                    selected={pokemonInfo.activeTag === 'pending'}
                    onClick={() => handleEditTags('pending', pokemonInfo.idx, pokemonInfo.ball)}
                >
                        Pending
                </ToggleButton> 
            </Box> : <></>
    }

    return (
        <>
        <FlexAppBarContainer widthPercent='10%' additionalStyles={{justifyContent: 'center', display: 'flex', height: '100%'}}>
            {generateButtons()}
        </FlexAppBarContainer>
        {currentView === 'onHandEdit' && 
        <DeleteOnHandConfirm 
            open={onHandDeleteConfirm} 
            handleClose={closeOnHandDeleteConfirm} 
            pokemonName={pokemonInfo.name} 
            dexNum={pokemonInfo.natDexNum}
            ball={pokemonInfo.ball} 
            imgLink={pokemonInfo.imgLink}
            isHA={pokemonInfo.isHA}
            emCount={pokemonInfo.emCount}
            gender={pokemonInfo.gender}
            isMaxEMs={pokemonInfo.isMaxEMs}
            pokemonId={pokemonInfo.pokemonId}
            collectionID={collectionID}
            />
        }
        </>
    )
}