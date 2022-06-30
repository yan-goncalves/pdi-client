import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import useCookie from 'react-use-cookie'

export type LocaleType = 'br' | 'en'

export type LocaleDataType = {
  flag: 'brasil' | 'usa'
  label: 'Português' | 'English'
}

export type Locales = {
  [key in LocaleType]: LocaleDataType
}

export const LOCALES: Locales = {
  br: {
    label: 'Português',
    flag: 'brasil'
  },

  en: {
    label: 'English',
    flag: 'usa'
  }
}

type ContextType = {
  locale: LocaleType
  data: {
    flag: string
    label: string
  }
  setLocale: Dispatch<SetStateAction<LocaleType>>
}

const LocaleContext = createContext<ContextType>({} as ContextType)

type LocaleProviderProps = {
  localeIni: LocaleType
  children: React.ReactNode
}

const LocaleProvider = ({ localeIni, children }: LocaleProviderProps) => {
  const [locale, setLocale] = useCookie('NEXT_LOCALE') as [
    LocaleType,
    Dispatch<SetStateAction<LocaleType>>
  ]
  const [label, setLabel] = useState<string>(LOCALES[localeIni].label)
  const [flag, setFlag] = useState<string>(LOCALES[localeIni].flag)

  useEffect(() => {
    setLabel(LOCALES[locale].label)
    setFlag(LOCALES[locale].flag)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, data: { label, flag } }}>
      {children}
    </LocaleContext.Provider>
  )
}

export const useLocale = () => {
  return useContext(LocaleContext)
}

export default LocaleProvider
