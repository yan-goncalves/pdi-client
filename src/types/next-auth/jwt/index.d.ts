import { DefaultSession } from 'next-auth'
import 'next-auth/core'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  import { Session } from 'next-auth/core'

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface JWT extends Session, Pick<DefaultSession, 'expires'> {}
}
