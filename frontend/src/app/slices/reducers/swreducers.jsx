

const swColReducers = {
    setPosRenderSelectedData: (state, action) => {
        const {position, rendered, selectedBall} = action.payload
        state.swCollection.position = position
        state.swCollection.rendered = rendered
        state.selectedBall = selectedBall
        return state
    },
    setPosRenderOHBallData: (state, action) => {
        //this action triggers an extra action in collectionstate
        const {position, rendered, noOhUpdate, onhandId, newBall} = action.payload
        state.swCollection.position = position
        state.swCollection.rendered = rendered
        if (!noOhUpdate && !state.unsavedOnhandChanges) {
            state.unsavedOnhandChanges = true
        }
    },
    setAllData: (state, action) => {
        const {position, rendered, noOhUpdate, onhandId, newBall} = action.payload
        state.swCollection.position = position
        state.swCollection.rendered = rendered
        state.selectedBall = newBall
        if (!noOhUpdate && !state.unsavedOnhandChanges) {
            state.unsavedOnhandChanges = true
        }
    },
    setPos: (state, action) => {
        state.swCollection.position = action.payload
        return state
    },
    resetPosRenderData: (state) => {
        state.swCollection.position = 0
        state.swCollecton.rendered = []
    },
}

export default swColReducers