import { PUBLIC_ROUTES } from 'constants/defsRoutes'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const stripDefaultLocale = (str: string): string => {
  const stripped = str.replace('/pt-BR', '')
  return stripped
}

/** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextApiRequest & NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!
  })

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
    if (!session) {
      const callbackUrl = encodeURIComponent(pathname)
      const redirect = stripDefaultLocale(`/${locale}/signin?callbackUrl=`)
      const res = NextResponse.redirect(`${redirect}${callbackUrl}`)
      res.cookie('NEXT_LOCALE', locale)

      return res
    }
  }

  if (!!session && pathname.includes('/signin')) {
    const redirect = stripDefaultLocale(`/${locale}/dashboard`)
    const res = NextResponse.redirect(redirect)
    res.cookie('NEXT_LOCALE', locale)

    return res
  }

  if (pathname.includes('/signin') || isNotPublic()) {
    const res = NextResponse.next()
    res.cookie('NEXT_LOCALE', locale)

    return res
  }
}
