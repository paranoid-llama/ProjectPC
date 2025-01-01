import { Box } from "@mui/material"
import ImgData from "../../../../collectiontable/tabledata/imgdata"

export default function SWBallRender({ball}) {
    const selectedBall = useSelector((state) => state.editmode.selectedBall)
    const isSelected = selectedBall === ball

    return (
        <Box sx={{margin: 0, position: 'relative'}}>
            <ImgData type='ball' linkKey={ball} size='40px'/>
            {isSelected &&
            <Box sx={{position: 'absolute', width: '38px', height: '38px', top: '0px', border: '1px solid rgb(25, 118, 210)', borderRadius: '5px'}}>
            </Box>
            }
        </Box>
    )
}