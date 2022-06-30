import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_FEEDBACK } from 'graphql/fragments'

export const CREATE_PERFORMED_FEEDBACK = gql`
  ${FRAGMENT_PERFORMED_FEEDBACK}
  mutation CreatePerformedFeedback(
    $idPerformed: Int!
    $idFeedback: Int!
    $midReply: String
    $endReply: String
  ) {
    created: createPerformedFeedback(
      input: {
        idPerformed: $idPerformed
        idFeedback: $idFeedback
        midReply: $midReply
        endReply: $endReply
      }
    ) {
      ...FragmentPerformedFeedback
    }
  }
`

export const UPDATE_PERFORMED_FEEDBACK = gql`
  ${FRAGMENT_PERFORMED_FEEDBACK}
  mutation UpdatePerformedFeedback($id: Int!, $midReply: String, $endReply: String) {
    updated: updatePerformedFeedback(id: $id, input: { midReply: $midReply, endReply: $endReply }) {
      ...FragmentPerformedFeedback
    }
  }
`
