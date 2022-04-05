import { gql } from '@apollo/client'

export const GET_ALL_EVALUATION_MODEL = gql`
  query GetAllEvaluationModel {
    evaluationModels(sort: "year:desc") {
      data {
        attributes {
          year
          period
          finished
        }
      }
    }
  }
`

export * from './__generated__/GetAllEvaluationModel'
