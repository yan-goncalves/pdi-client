import { createStylesServer, ServerStyles } from '@mantine/next'
import { CssBaseline } from '@nextui-org/react'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

// const getInitialProps = createGetInitialProps()
const stylesServer = createStylesServer()

export default class _Document extends Document {
  // static getInitialProps = getInitialProps

  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <ServerStyles html={initialProps.html} server={stylesServer} />
        </>
      )
    }
  }

  render() {
    return (
      <Html>
        <Head>{CssBaseline.flush()}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
