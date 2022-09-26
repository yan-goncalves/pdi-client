import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import Dashboard from 'templates/Dashboard'

const UserPdiPage = () => {
  return <Dashboard actor={EVALUATION_ACTOR.USER} />
}

export default UserPdiPage
