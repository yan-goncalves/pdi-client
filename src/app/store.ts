import { configureStore } from '@reduxjs/toolkit'
import drawerReducer from 'features/Drawer/drawer-slice'
import loadingOverlayReducer from 'features/LoadingOverlay/loading-overlay-slice'
import localeReducer from 'features/Locale/locale-slice'

// Import the previously created search slice

// Create the store, adding the search slice to it
export const store = configureStore({
  reducer: {
    drawerOpened: drawerReducer,
    loadingOverlay: loadingOverlayReducer,
    locale: localeReducer
  }
})

// Export some helper types used to improve type-checking
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
