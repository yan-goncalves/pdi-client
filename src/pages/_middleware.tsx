import { PUBLIC_ROUTES } from 'constants/defsRoutes'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const stripDefaultLocale = (str: string): string => {
  const stripped = str.replace('/br', '')
  return stripped
}

/** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextApiRequest & NextRequest) {
  const pathname = req.nextUrl.pathname
  const cookieLocale = req.cookies['NEXT_LOCALE']
  const nextLocale = req.nextUrl.locale
  const locale = nextLocale !== cookieLocale ? nextLocale : cookieLocale

  const isNotPublic = () => {
    const ret = PUBLIC_ROUTES.filter((route) => {
      if (req.nextUrl.pathname.includes(route)) {
        return route
      }
    })

    return ret.length === 0
  }

  if (isNotPublic() && req.nextUrl.pathname !== '/') {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET!
    })
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    if (!session) {
      const url = stripDefaultLocale(`/${locale}${pathname}`)
      const callbackUrl = encodeURIComponent(url)
      const res = NextResponse.redirect(`/signin?callbackUrl=${callbackUrl}`)
      res.cookie('NEXT_LOCALE', locale)

      return res
    }
  }
  if (pathname.includes('/signin') || isNotPublic()) {
    const res = NextResponse.next()
    res.cookie('NEXT_LOCALE', locale)

    return res
  }

  // const shouldHandleLocale =
  //   !PUBLIC_FILE.test(req.nextUrl.pathname) &&
  //   !req.nextUrl.pathname.includes('/api/') &&
  //   req.nextUrl.locale === 'br'

  // return shouldHandleLocale
  //   ? NextResponse.redirect(
  //       `/${stripDefaultLocale(req.nextUrl.pathname)}${req.nextUrl.search}`
  //     )
  //   : undefined
}
