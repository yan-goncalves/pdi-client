import { ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { store } from 'app/store'
import AppShell from 'components/AppShell'
import LoadingOverlay from 'components/LoadingOverlay'
import EvaluationProvider from 'contexts/EvaluationProvider'
import LocaleProvider, { LocaleType } from 'contexts/LocaleProvider'
import RoutesManagerProvider from 'contexts/RoutesManagerProvider'
import { useApollo } from 'graphql/client'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import GlobalStyles from 'styles/globals'
import { theme } from 'styles/theme'
import Page404 from 'pages/404'

export default function _App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const { locale } = useRouter()
  const client = useApollo(pageProps.initialApolloState)
  const { pathname } = useRouter()
  const match = useMediaQuery(`(max-width: 992px)`, false)

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head>
        <title>PDI - SLBRASIL</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <LocaleProvider localeIni={locale as LocaleType}>
        <SessionProvider session={session}>
          <ApolloProvider client={client}>
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              withCSSVariables
              theme={theme}
              defaultProps={{
                Tooltip: {
                  withArrow: true,
                  radius: 'md'
                },
                Button: { radius: 'md' },
                Badge: { radius: 'md' },
                ActionIcon: { radius: 'md' },
                Card: { radius: 'lg' }
              }}
              styles={{
                Title: {
                  root: {
                    fontFamily: 'Open Sans, Roboto, sans-serif'
                  }
                }
              }}
            >
              <NextUIProvider
                theme={createTheme({
                  type: 'light',
                  theme: {
                    breakpoints: {
                      xs: '576px',
                      sm: '768px',
                      md: '992px',
                      lg: '1200px',
                      xl: '1400px'
                    }
                  }
                })}
              >
                <ReduxProvider store={store}>
                  <NotificationsProvider position={match ? 'bottom-center' : 'bottom-right'}>
                    <RoutesManagerProvider>
                      <EvaluationProvider>
                        <GlobalStyles />
                        <LoadingOverlay />
                        {pathname.includes('404') ? (
                          <Page404 {...pageProps} />
                        ) : (
                          <AppShell>
                            <Component {...pageProps} />
                          </AppShell>
                        )}
                      </EvaluationProvider>
                    </RoutesManagerProvider>
                  </NotificationsProvider>
                </ReduxProvider>
              </NextUIProvider>
            </MantineProvider>
          </ApolloProvider>
        </SessionProvider>
      </LocaleProvider>
    </>
  )
}
