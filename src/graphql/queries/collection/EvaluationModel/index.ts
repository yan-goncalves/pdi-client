import { gql } from '@apollo/client'
import { FRAGMENT_EVALUATION_MODEL } from 'graphql/fragments'

export const GET_EVALUATION_MODELS = gql`
  query GetEvaluationModels {
    evaluations {
      id
      year
      period
      midDate {
        start
        deadline
      }
      endDate {
        start
        deadline
      }
    }
  }
`

export const GET_EVALUATION_MODEL = gql`
  ${FRAGMENT_EVALUATION_MODEL}
  query GetEvaluationModel($year: Int!) {
    evaluation: evaluationByYear(year: $year) {
      ...FragmentEvaluationModel
    }
  }
`
