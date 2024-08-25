import {createSelector} from '@reduxjs/toolkit'

const selectScreenState = (state) => state.reduxWindow
const selectResponsiveComponent = (state, component) => component === undefined ? 'default' : component

const getComponentBreakpoints = (screenWidth, component) => {
    if (component === 'default') {
        return screenWidth >= 768 ? 'md' : 'sm'
    } else if (component === 'ballprogress') {
        const breakpoint = screenWidth < 768 ? 'sm' : 
                            screenWidth >= 768 && screenWidth < 1000 ? 'md' : 
                            (screenWidth >= 1000) && 'lg'
        return breakpoint
    } else if (component === 'filtersort') {
        const breakpoint = screenWidth < 768 ? 'sm' : 
                            screenWidth >= 768 && screenWidth < 1100 ? 'md' : 
                            (screenWidth >= 1100) && 'lg'
        return breakpoint
    }
}

const selectScreenBreakpoint = createSelector([selectScreenState, selectResponsiveComponent], (window, comp) => {
    return getComponentBreakpoints(window.width, comp)
})

export {selectScreenBreakpoint}