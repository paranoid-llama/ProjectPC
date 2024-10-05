import { useDispatch, useSelector } from "react-redux";
import { Button, useTheme } from "@mui/material";
import { setOnHandView } from "../../app/slices/collectionstate";
import { deselect } from "../../app/slices/editmode";
import hexToRgba from "hex-to-rgba";

export default function ChangeOnHandView({collectionLoaderData, isEditMode, demo}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const onhandView = useSelector((state) => state.collectionState.listDisplay.onhandView)
    return (
        <Button 
            sx={{
                border: `1px solid ${theme.palette.color1.dark}`, 
                backgroundColor: hexToRgba(theme.palette.color3.main, 0.75), 
                color: theme.palette.color1.main,
                padding: 0.5, ml: 2,
                fontSize: '11px',
                zIndex: 15,
                ':hover': {cursor: 'pointer', backgroundColor: hexToRgba(theme.palette.color3.main, 0.75), opacity: 0.65}
            }}
            onClick={() => {
                dispatch(deselect())
                dispatch(setOnHandView({useState: (isEditMode || demo), onhand: collectionLoaderData.onHand, collection: collectionLoaderData.ownedPokemon}))
            }}
        >
            View by {onhandView === 'byIndividual' ? 'Pokemon' : 'Individual'}
        </Button>
    )
}