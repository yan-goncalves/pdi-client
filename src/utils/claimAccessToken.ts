import { User } from 'next-auth'

export const claimAccessToken = async (
  provider: string,
  access_token: string
): Promise<{
  jwt: string
  user: User
}> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}/callback?access_token=${access_token}`
  )
  const res = await response.json()

  return res
}
