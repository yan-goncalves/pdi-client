import 'next-auth/core'
import { NextAuthOptions as NextAuthOptionsDefault } from 'next-auth/core'
import { UserType } from 'types/collection/User'

declare module 'next-auth/core' {
  interface Session {
    jwt: string
    user: UserType
  }

  export interface NextAuthOptions extends NextAuthOptionsDefault {
    callbacks?: Partial<CallbacksOptions>
  }

  interface CallbacksOptions<
    P extends Record<string, unknown> = Profile,
    A extends Record<string, unknown> = Account
  > {
    jwt: (params: {
      token: JWT
      user?: User
      account?: A
      profile?: P
      isNewUser?: boolean
    }) => Awaitable<JWT>
  }
}
