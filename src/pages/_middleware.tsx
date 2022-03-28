import { PUBLIC_ROUTES } from 'constants/defsRoutes'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

/** @param {import("next/server").NextRequest} req */
export async function middleware(req: NextApiRequest & NextRequest) {
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
      const callbackUrl = encodeURIComponent(req.nextUrl.pathname)

      const res = NextResponse.redirect(`/signin?callbackUrl=${callbackUrl}`)

      res.clearCookie('next-auth.callback-url')
      res.cookie('next-auth.callback-url', callbackUrl)

      return res
    }
  }

  if (req.nextUrl.pathname.includes('/api/auth/callback')) {
    const res = NextResponse.next()

    res.clearCookie('next-auth.callback-url')
    res.cookie('next-auth.login-successfully', 'ok')

    return res
  }
}
