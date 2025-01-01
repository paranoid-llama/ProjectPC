import {createSelector} from '@reduxjs/toolkit'

const selectScreenState = (state) => state.reduxWindow
const selectResponsiveComponent = (state, component) => component === undefined ? 'default' : component

const getComponentBreakpoints = (screenWidth, component) => {
    if (component === 'ballprogress') {
        const breakpoint = screenWidth < 400 ? 'smSm' :
                            screenWidth < 550 ? 'mdSm' : 
                            screenWidth < 768 ? 'sm' : 
                            screenWidth >= 768 && screenWidth < 1000 ? 'md' : 
                            (screenWidth >= 1000) && 'lg'
        return breakpoint
    } else if (component === 'filtersort') {
        const breakpoint = screenWidth < 768 ? 'sm' : 
                            screenWidth >= 768 && screenWidth < 1100 ? 'md' : 
                            (screenWidth >= 1100) && 'lg'
        return breakpoint
    } else if (component === 'navbar') {
        const breakpoint = screenWidth < 360 ? 'tiny' : screenWidth < 590 ? 'super-sm' : screenWidth < 617 ? 'sm' : 'reg'
        return breakpoint
    } else if (component === 'dashboard') {
        const breakpoint = screenWidth < 500 ? 'sm' : 'reg'
        return breakpoint
    } else if (component === 'compareDisplayMod') {
        const breakpoint = screenWidth < 380 ? 'sm' : screenWidth < 550 ? 'md' : 'lg'
        return breakpoint
    } else {
        return screenWidth >= 768 ? 'md' : 'sm'
    }
}

const selectScreenBreakpoint = createSelector([selectScreenState, selectResponsiveComponent], (window, comp) => {
    return getComponentBreakpoints(window.width, comp)
})

export {selectScreenBreakpoint}