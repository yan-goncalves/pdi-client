import { gql } from '@apollo/client'
import { FRAGMENT_GOAL_MODEL, FRAGMENT_KPI_MODEL } from 'graphql/fragments'

export const GET_GOAL = gql`
  ${FRAGMENT_KPI_MODEL}
  query GetGoal($id: Int!) {
    goal(id: $id) {
      id
      name
      kpis {
        ...FragmentKpiModel
      }
    }
  }
`
export const GET_EVALUATION_GOALS = gql`
  ${FRAGMENT_KPI_MODEL}
  query GetEvaluationGoals($idEvaluation: Int!, $idUser: Int!) {
    evaluationGoals(input: { idEvaluation: $idEvaluation, idUser: $idUser }) {
      id
      name
      kpis {
        ...FragmentKpiModel
      }
    }
  }
`

export const GET_GOALS = gql`
  ${FRAGMENT_GOAL_MODEL}
  query GetGoals {
    goals {
      ...FragmentGoalModel
    }
  }
`
