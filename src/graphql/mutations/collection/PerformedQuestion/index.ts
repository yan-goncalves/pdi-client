import { gql } from '@apollo/client'

export const CREATE_PERFORMED_QUESTION = gql`
  mutation CreatePerformedQuestion(
    $answer: ENUM_PERFORMEDQUESTION_ANSWER
    $why: String
    $idPerformedEvaluation: ID!
    $idQuestion: ID!
  ) {
    created: createPerformedQuestion(
      data: {
        answer: $answer
        why: $why
        performed_evaluation: $idPerformedEvaluation
        skill: $idQuestion
      }
    ) {
      data {
        id
      }
    }
  }
`

export const UPDATE_PERFORMED_QUESTION = gql`
  mutation UpdatePerformedQuestion($id: ID!, $answer: ENUM_PERFORMEDQUESTION_ANSWER, $why: String) {
    updatePerformedQuestion(id: $id, data: { answer: $answer, why: $why }) {
      data {
        id
      }
    }
  }
`
