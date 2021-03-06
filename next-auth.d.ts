import 'next-auth'
import 'next-auth/jwt'
import { UserType } from 'types/collection/User'

declare module 'next-auth' {
  interface Session {
    jwt: string
    user: UserType
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface CallbacksOptions<P = Profile, A = Account> {
    jwt: (params: {
      token: JWT
      user?: User
      account?: A
      profile?: Profile
      isNewUser?: boolean
    }) => Awaitable<JWT>
  }
}

declare module 'next-auth/jwt' {
  import { Session } from 'next-auth'

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends Session {}
}
