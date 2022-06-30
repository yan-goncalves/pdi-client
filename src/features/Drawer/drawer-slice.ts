import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'app/store'

export interface DrawerType {
  drawerOpened: boolean
}

const initialState: DrawerType = {
  drawerOpened: false
}

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setDrawerOpened(state: DrawerType, { payload }: PayloadAction<DrawerType>) {
      state.drawerOpened = payload.drawerOpened
    }
  }
})

export const selectDrawerOpened = (state: RootState) => state.drawerOpened

export const { setDrawerOpened } = drawerSlice.actions

export default drawerSlice.reducer
