import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Dashboard from 'templates/Dashboard'

const UserHomePage = () => {
  const { data: session } = useSession()

  useEffect(() => {
    console.log('SESSION', session)
  }, [session])

  return <Dashboard actor={EVALUATION_ACTOR.USER} />
}

export default UserHomePage
