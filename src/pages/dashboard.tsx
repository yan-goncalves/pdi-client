import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import Dashboard from 'templates/Dashboard'

const UserHomePage = () => {
  return <Dashboard actor={EVALUATION_ACTOR.USER} />
}

export default UserHomePage
