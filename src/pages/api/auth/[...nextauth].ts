import { initializeApollo } from 'graphql/client'
import { LOGIN } from 'graphql/mutations/auth'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserType } from 'types/collection/User'

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
        const client = initializeApollo()

        const data = await client
          .mutate<{ signin: JWT }>({
            mutation: LOGIN,
            variables: {
              identifier: credentials?.identifier,
              password: credentials?.password
            }
          })
          .then(({ data }) => data?.signin)

        return { ...data }
      }
    })
  ],

  session: {
    maxAge: 24 * 60 * 60,
    updateAge: 60 * 60
  },

  callbacks: {
    session: async ({ session, token }) => {
      session.jwt = token.jwt as string
      session.user = token.user as UserType

      return session
    },

    jwt: async ({ token, user: data }) => {
      if (data) {
        const { jwt, user } = data

        token.jwt = jwt as string
        token.user = user as UserType
        token.access_token = jwt
      }

      return token
    }
  }
})
