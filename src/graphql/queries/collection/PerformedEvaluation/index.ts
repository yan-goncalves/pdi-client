import { gql } from '@apollo/client'

export const GET_PERFORMED_EVALUATION = gql`
  query GetPerformedEvaluation($idUser: ID!, $idEvaluationModel: ID!) {
    performedEvaluations(
      filters: {
        user: { id: { eq: $idUser } }
        evaluation_model: { id: { eq: $idEvaluationModel } }
      }
    ) {
      data {
        id
        attributes {
          performed_questions {
            data {
              id
              attributes {
                answer
                why
                skill {
                  data {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
