import axios from 'axios'
import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/signin'
  },

  providers: [
    CredentialsProvider({
      credentials: {
        identifier: { label: 'Username or E-mail', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },

      authorize: async (credentials) => {
        const { jwt } = await axios
          .post<{ jwt: string; user: User }>(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/local`,
            process.env.NODE_ENV === 'production'
              ? credentials
              : {
                  identifier: process.env.NEXT_MASTER_USERNAME,
                  password: process.env.NEXT_MASTER_PASSWORD
                }
          )
          .then((response) => response.data)

        const user = await axios
          .get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
            headers: {
              authorization: `Bearer ${jwt}`
            }
          })
          .then((response) => response.data)

        return { jwt, ...user }
      }
    })
  ],

  session: {
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60
  },

  callbacks: {
    session: async ({ session, token }) => {
      session.jwt = token.jwt
      session.user = token.user

      return session
    },

    jwt: async ({ token, user }) => {
      if (user) {
        const { jwt, ...userProps } = user

        token.jwt = jwt as string
        token.user = userProps
      }

      return token
    },

    redirect: ({ url, baseUrl }) => {
      if (url.startsWith(baseUrl)) {
        const newUrl = new URL(url)
        const callbackUrl = newUrl.searchParams.get('callbackUrl')

        return decodeURIComponent(callbackUrl || newUrl.toString())
      }
      return decodeURIComponent(url)
    }
  }
})
