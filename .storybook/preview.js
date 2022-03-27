import { RouterContext } from 'next/dist/shared/lib/router-context'
import { MantineProvider } from '@mantine/core'
import { theme } from 'styles/theme'

export const decorators = [
  (Story) => (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <Story />
    </MantineProvider>
  )
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  nextRouter: {
    Provider: RouterContext.Provider
  }
}
