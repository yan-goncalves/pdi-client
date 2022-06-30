import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_QUESTION } from 'graphql/fragments'

export const CREATE_PERFORMED_QUESTION = gql`
  ${FRAGMENT_PERFORMED_QUESTION}
  mutation CreatePerformedQuestion(
    $reply: String
    $justification: String
    $idPerformed: Int!
    $idQuestion: Int!
  ) {
    created: createPerformedQuestion(
      input: {
        reply: $reply
        justification: $justification
        idPerformed: $idPerformed
        idQuestion: $idQuestion
      }
    ) {
      ...FragmentPerformedQuestion
    }
  }
`

export const UPDATE_PERFORMED_QUESTION = gql`
  ${FRAGMENT_PERFORMED_QUESTION}
  mutation UpdatePerformedQuestion($id: Int!, $reply: String, $justification: String) {
    updated: updatePerformedQuestion(
      id: $id
      input: { reply: $reply, justification: $justification }
    ) {
      ...FragmentPerformedQuestion
    }
  }
`
