import { ROLES } from 'constants/role'
import { PUBLIC_ROUTES } from 'constants/routes'
import { initializeApollo } from 'graphql/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { GetTeamMembersType } from 'types/collection/Team'

const stripDefaultLocale = (str: string): string => {
  return str.replace('/br', '')
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

  if (pathname.includes('manager') && session?.user.role === ROLES.USER) {
    return NextResponse.redirect(stripDefaultLocale(`/${locale}/dashboard`))
  }

  if (
    pathname.includes('manager') &&
    session?.user.role === ROLES.MANAGER &&
    req.page.params?.username
  ) {
    const username = req.page.params?.username
    const apolloClient = initializeApollo(null, session)
    const {
      data: { team }
    } = await apolloClient.query<GetTeamMembersType>({
      query: GET_TEAM_MEMBERS,
      variables: {
        idManager: session.user.id
      }
    })

    if (!team.some((member) => member.username === username)) {
      return NextResponse.redirect(stripDefaultLocale(`/${locale}/manager`))
    }
  }

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.includes(route))

  if (!isPublic && !pathname.endsWith('/')) {
    if (!session) {
      const callbackUrl = encodeURIComponent('/dashboard')
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
