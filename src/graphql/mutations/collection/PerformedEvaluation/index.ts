import { gql } from '@apollo/client'

export const CREATE_PERFORMED_EVALUATION = gql`
  mutation CreatePerformedEvaluation($idUser: Int!, $idEvaluation: Int!) {
    created: createPerformedEvaluation(input: { idEvaluation: $idEvaluation, idUser: $idUser }) {
      id
    }
  }
`

export const UPDATE_PERFORMED_EVALUATION = gql`
  mutation UpdatePerformedEvaluation($id: Int!, $midFinished: Boolean, $endFinished: Boolean) {
    updatePerformedEvaluation(
      id: $id
      input: { midFinished: $midFinished, endFinished: $endFinished }
    ) {
      id
      midFinished
      endFinished
    }
  }
`
