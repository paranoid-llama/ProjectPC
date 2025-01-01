// This is a version of sweditselectionwrapper that i tried to make draggable, but it always came up with certain issues and 
// i was not satisfied with it. In the end, i made it button click only.
// I'm leaving it here in case i want to revisit it.
import {Box, Typography, Button, useTheme} from '@mui/material'
import { useRef, useState, useEffect } from 'react';
import Draggable, {DraggableCore} from 'react-draggable'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { toggleEditScreenState } from '../../../../app/slices/editmode';
import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux'

function SWEditSelectionWrapper({}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [position, setPosition] = useState({x: 0, y: 0})
    const selection = useSelector((state) => state.editmode.selected)
    const showEditScreen = useSelector((state) => state.editmode.showEditScreen)
    const noSelection = selection === ''
    const editSelectionRef = useRef(null)
    const editSelectionButtonRef = useRef(null)
    const positionRef = useRef(0)

    // const offAnimation = editSelectionRef.current !== null && editSelectionRef.current.style.animation !== 'none'
    // const bottomStyle = offAnimation && (editSelectionRef.current.style.animation.includes('open') ? '0px' : '-360px')

    // effective edit area is the area of space to edit selection. add 40 to include the button to drag open/drag close area and thats the total area.
    const effectiveEditArea = 360 

    const handleDrag = (e, data) => {
        if (editSelectionRef.current !== null && editSelectionRef.current.style.animation !== 'none') {
            editSelectionRef.current.style.animation = 'none'
            editSelectionButtonRef.current.style.animation = 'none'
            editSelectionRef.current.style.animationFillMode = 'forwards'
            editSelectionButtonRef.current.style.animationFillMode = 'forwards'
        }
        positionRef.current = data.y
        setPosition({x: 0, y: data.y})
        // const bottomNumValue = parseInt(editSelectionRef.current.style.bottom)
        // if ((bottomNumValue <= 0 && bottomNumValue >= -1*effectiveEditArea) || isNaN(bottomNumValue)) {
        //     const newBottom = -1*effectiveEditArea+-1*data.y
        //     editSelectionRef.current.style.bottom = `${newBottom}px`
        // }
    }

    const handleDragStop = (e, data) => {
        
        // const bottomStyle = editSelectionRef.current.style.bottom
        // // console.log(parseInt(bottomStyle))
        // // console.log(-1*effectiveEditArea/4)
        // // console.log(-1*effectiveEditArea*3/4)
        const fullOpenFlag = position.y >= -1*effectiveEditArea*3/4 && showEditScreen === false
        const fullCloseFlag = position.y <= -1*effectiveEditArea/4 && showEditScreen 
        if (fullOpenFlag) {
            // editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 open-sw-edit-selection'

            // editSelectionButtonRef.current.style.animation = '0.3s ease-out 0s 1 open-sw-edit-selection-button'
            dispatch(toggleEditScreenState())
            // setTimeout(() => {
            //     editSelectionRef.current.style.animation = 'none'
            //     editSelectionButtonRef.current.style.animation = 'none'
            //     setPosition({...position, y: -360})
                
            // }, 1)
            
            // data.node.translateY()
        }
        if (fullCloseFlag) {
            // editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 close-sw-edit-selection'
            // editSelectionRef.current.style.animationFillMode = 'forwards'
            // editSelectionButtonRef.current.style.animation = '0.3s ease-out 0s 1 close-sw-edit-selection-button'
            // editSelectionButtonRef.current.style.animationFillMode = 'forwards'
            // setPosition({...position, y: -360})
            dispatch(toggleEditScreenState())
            // e.goto(0)
        }
    }

    useEffect(() => {
        if (editSelectionRef.current !== null) {
            if (showEditScreen === false && position.y !== 0) {
                if (position.y >= -25) {
                    setPosition({...position, y: 0})
                } else {
                    editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 close-sw-edit-selection'
                    editSelectionButtonRef.current.style.animation = '0.3s ease-out 0s 1 close-sw-edit-selection-button'
                    editSelectionRef.current.style.animationFillMode = 'forwards'
                    editSelectionButtonRef.current.style.animationFillMode = 'forwards'
                    // positionRef.current = 0
                    setTimeout(() => {
                        positionRef.current = 0
                        // setPosition({...position, y: 0})
                        // editSelectionRef.current.style.animation = 'none'
                        // editSelectionButtonRef.current.style.animation = 'none'
                    }, 300)
                }
            } else if (showEditScreen && position.y !== -360) {
                if (position.y <= -1*(effectiveEditArea)+25) {
                    setPosition({...position, y: -360})
                } else {
                    editSelectionRef.current.style.animation = '0.3s ease-out 0s 1 open-sw-edit-selection'
                    editSelectionButtonRef.current.style.animation = '0.3s ease-out 0s 1 open-sw-edit-selection-button'
                    editSelectionRef.current.style.animationFillMode = 'forwards'
                    editSelectionButtonRef.current.style.animationFillMode = 'forwards'
                    setTimeout(() => {
                        positionRef.current = -360
                        // setPosition({...position, y: -360})
                        // editSelectionRef.current.style.animation = 'none'
                        // editSelectionButtonRef.current.style.animation = 'none'
                    }, 300)
                }
            }
        }
    }, [showEditScreen])

    const generateKeyframe = () => {
        return (
            `
                @keyframes open-sw-edit-selection {
                    ${positionRef.current !== position.y ?
                    `from {
                        bottom: ${-1*effectiveEditArea}px
                    }` : ''
                    }
                    to {
                        bottom: 0px
                    }
                }
                @keyframes close-sw-edit-selection {
                    ${positionRef.current !== position.y ?
                    `from {
                        bottom: 0px
                    }` : ''
                    }
                    to {
                        bottom: ${-1*effectiveEditArea}px
                    }
                }
                @keyframes open-sw-edit-selection-button {
                    ${positionRef.current !== position.y ?
                    `from {
                        transform: translateY(0px)
                    }` : ''
                    }
                    to {
                        transform: translateY(${-1*effectiveEditArea}px)
                    }
                }
                @keyframes close-sw-edit-selection-button {
                    ${positionRef.current !== position.y ?
                    `from {
                        transform: translateY(${-1*effectiveEditArea}px)
                    }` : ''
                    }
                    to {
                        transform: translateY(0%)
                    }
                }
            `
        )
    }

    return (
        !noSelection &&
        <Box sx={{position: 'fixed', bottom: '0px', width: '100%', zIndex: 500}}>
            <style>{generateKeyframe()}</style>
            <Draggable
                axis='y'
                onDrag={handleDrag}
                onStop={handleDragStop}
                bounds={{top: -1*effectiveEditArea, bottom: 0}}
                position={editSelectionButtonRef.current !== null && editSelectionButtonRef.current.style.animation !== 'none' ? {x: 0, y: positionRef.current} : position}
            >
                <Button 
                    variant='contained' 
                    sx={{
                        width: '100%', 
                        position: 'absolute', 
                        bottom: 0, 
                        height: '40px', 
                        borderTopRightRadius: '10px', 
                        borderTopLeftRadius: '10px', 
                        borderBottomRightRadius: '0px', 
                        borderBottomLeftRadius: '0px', 
                        zIndex: 600
                    }}
                    ref={editSelectionButtonRef}
                    onClick={() => dispatch(toggleEditScreenState())}
                >
                    Edit Selection
                </Button>
            </Draggable>
            <Box 
                sx={{
                    position: 'absolute', 
                    width: '100%', 
                    height: `${effectiveEditArea+40}px`, 
                    backgroundColor: '#e3e5e6', 
                    borderTopRightRadius: '10px', 
                    borderTopLeftRadius: '10px',
                    bottom: `${-1*effectiveEditArea+-1*(editSelectionRef.current !== null && editSelectionRef.current.style.animation !== 'none' ? positionRef.current : position.y)}px`
                }} 
                ref={editSelectionRef}
            >
                
            </Box>
        </Box>
    )
}