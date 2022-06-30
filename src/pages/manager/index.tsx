import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import Dashboard from 'templates/Dashboard'

const ManagerHomePage = () => {
  return <Dashboard actor={EVALUATION_ACTOR.MANAGER} />
}

export default ManagerHomePage
