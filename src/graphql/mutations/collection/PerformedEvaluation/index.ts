import { gql } from '@apollo/client'

export const CREATE_PERFORMED_EVALUATION = gql`
  mutation CreatePerformedEvaluation($idUser: ID!, $idEvaluationModel: ID!) {
    createPerformedEvaluation(
      data: { user: $idUser, evaluation_model: $idEvaluationModel }
    ) {
      data {
        id
      }
    }
  }
`
