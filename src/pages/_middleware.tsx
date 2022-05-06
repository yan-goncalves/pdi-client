import { PUBLIC_ROUTES } from 'constants/routes'
import { initializeApollo } from 'graphql/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextURL } from 'next/dist/server/web/next-url'
import { NextRequest, NextResponse } from 'next/server'
import { GetTeamMembers } from 'types/collection/Team'

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

  if (
    pathname.includes('manager') &&
    session?.user.info.access_role === 'User'
  ) {
    return NextResponse.redirect(stripDefaultLocale(`/${locale}/dashboard`))
  }

  if (
    pathname.includes('manager') &&
    session?.user.info.access_role === 'Manager' &&
    req.page.params?.username
  ) {
    const username = req.page.params?.username
    const apolloClient = initializeApollo(null, session)
    const {
      data: { team }
    } = await apolloClient.query<GetTeamMembers>({
      query: GET_TEAM_MEMBERS,
      variables: {
        idManager: session.user.id
      }
    })

    if (!team.some((member) => member.username === username)) {
      return NextResponse.redirect(stripDefaultLocale(`/${locale}/manager`))
    }
  }

  const isPublic = PUBLIC_ROUTES.some((route) =>
    req.nextUrl.pathname.includes(route)
  )

  if (!isPublic && req.nextUrl.pathname !== '/') {
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

  if (pathname.includes('/signin') || !isPublic) {
    const res = NextResponse.next()
    res.cookie('NEXT_LOCALE', locale)

    return res
  }
}
