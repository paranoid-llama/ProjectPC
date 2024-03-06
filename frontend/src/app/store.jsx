import {configureStore} from '@reduxjs/toolkit'
import { resizeEvent } from 'redux-window'
import onhand from './slices/onhand'
import collection from './slices/collection'
import editmode from './slices/editmode'
import listDisplay from './slices/listdisplay'
import reduxWindow from 'redux-window'

const store = configureStore({
    reducer: {
        listDisplay: listDisplay.reducer,
        onhand: onhand.reducer,
        collection: collection.reducer,
        editmode: editmode.reducer,
        reduxWindow
    }
})

export default store 

