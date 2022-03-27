import 'next-auth'
import 'next-auth/jwt'
import { DepartmentProps, UserInfoProps } from 'types/api'

declare module 'next-auth' {
  interface Session {
    jwt: string
    user: User
  }

  interface User {
    id: number
    username: string
    email: string
    provider: 'local'
    blocked: boolean | null
    confirmed: boolean
    created_at: Date
    updated_at: Date
    role?: {
      description: string
      id: number
      name: string
      type: string
    }
    picture: string
    department: DepartmentProps
    info: UserInfoProps
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
