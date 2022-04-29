import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app/store'

export interface loadingOverlayType {
  loadingOverlayVisible: boolean
}

const initialState: loadingOverlayType = {
  loadingOverlayVisible: false
}

const loadingOverlaySlice = createSlice({
  name: 'loadingOverlay',
  initialState,
  reducers: {
    setLoadingOverlayVisibility(
      state,
      { payload }: PayloadAction<loadingOverlayType>
    ) {
      state.loadingOverlayVisible = payload.loadingOverlayVisible
    }
  }
})

export const selectLoadingOverlay = (state: RootState) => state.loadingOverlay

export const { setLoadingOverlayVisibility } = loadingOverlaySlice.actions

export default loadingOverlaySlice.reducer
