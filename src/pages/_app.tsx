import { ApolloProvider } from '@apollo/client'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { NextUIProvider } from '@nextui-org/react'
import { store } from 'app/store'
import AppShell from 'components/AppShell'
import Footer from 'components/Footer'
import LoadingOverlay from 'components/LoadingOverlay'
import LoginSuccessfulProvider from 'contexts/LoginSuccessfulProvider'
import RoutesCheckerProvider from 'contexts/RoutesCheckerProvider'
import { useApollo } from 'graphql/apollo'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import GlobalStyles from 'styles/globals'
import { theme } from 'styles/theme'
import Page404 from '../templates/404'

export default function _App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  const client = useApollo(pageProps.initialApolloState)
  const { pathname } = useRouter()

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
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <NextUIProvider>
              <ReduxProvider store={store}>
                <NotificationsProvider>
                  <RoutesCheckerProvider>
                    <LoginSuccessfulProvider>
                      {/* <Header /> */}
                      <GlobalStyles />
                      <LoadingOverlay />
                      {pathname.includes('404') ? (
                        <Page404 />
                      ) : (
                        <AppShell>
                          <Component {...pageProps} />
                        </AppShell>
                      )}
                      <Footer />
                    </LoginSuccessfulProvider>
                  </RoutesCheckerProvider>
                </NotificationsProvider>
              </ReduxProvider>
            </NextUIProvider>
          </MantineProvider>
        </ApolloProvider>
      </SessionProvider>
    </>
  )
}
