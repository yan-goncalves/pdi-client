import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface LocaleType {
  locale: 'pt-BR' | 'en'
}

const initialState: LocaleType = {
  locale: 'pt-BR'
}

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, { payload }: PayloadAction<LocaleType>) {
      state.locale = payload.locale
    }
  }
})

export const selectLocale = (state: RootState) => state.locale

export const { setLocale } = localeSlice.actions

export default localeSlice.reducer
