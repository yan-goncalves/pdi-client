import { gql } from '@apollo/client'

export const GET_ALL_EVALUATION_MODEL = gql`
  query GetAllEvaluationModel {
    evaluationModels(sort: "year:desc") {
      year
      period
      finished
    }
  }
`
