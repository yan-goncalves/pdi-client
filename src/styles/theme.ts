import { MantineTheme } from '@mantine/core'

export const theme: Pick<MantineTheme, 'black' | 'other'> = {
  black: '#333',
  other: {
    images: {
      background: '/img/background.svg',
      landing: '/img/landing.svg',
      login: '/img/login.svg',
      logoPdi: '/img/logo-pdi.svg',
      logo: '/img/logo.svg',
      slbrasil: '/img/sl-brasil.svg',
      error404: '/img/404.svg'
    }
  }
}
