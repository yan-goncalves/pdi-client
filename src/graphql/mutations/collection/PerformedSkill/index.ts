import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_SKILL } from 'graphql/fragments'

export const CREATE_PERFORMED_SKILL = gql`
  ${FRAGMENT_PERFORMED_SKILL}
  mutation CreatePerformedSkill(
    $idPerformed: Int!
    $idSkill: Int!
    $ratingUser: Int
    $ratingManager: Int
    $midFeedbackManager: String
    $endFeedbackManager: String
    $endFeedbackUser: String
    $midFeedbackUser: String
  ) {
    created: createPerformedSkill(
      input: {
        idPerformed: $idPerformed
        idSkill: $idSkill
        ratingUser: $ratingUser
        ratingManager: $ratingManager
        midFeedbackManager: $midFeedbackManager
        endFeedbackManager: $endFeedbackManager
        endFeedbackUser: $endFeedbackUser
        midFeedbackUser: $midFeedbackUser
      }
    ) {
      ...FragmentPerformedSkill
    }
  }
`

export const UPDATE_PERFORMED_SKILL = gql`
  ${FRAGMENT_PERFORMED_SKILL}
  mutation UpdatePerformedSkill(
    $id: Int!
    $ratingUser: Int
    $ratingManager: Int
    $midFeedbackManager: String
    $endFeedbackManager: String
    $endFeedbackUser: String
    $midFeedbackUser: String
  ) {
    updated: updatePerformedSkill(
      id: $id
      input: {
        ratingUser: $ratingUser
        ratingManager: $ratingManager
        midFeedbackManager: $midFeedbackManager
        endFeedbackManager: $endFeedbackManager
        endFeedbackUser: $endFeedbackUser
        midFeedbackUser: $midFeedbackUser
      }
    ) {
      ...FragmentPerformedSkill
    }
  }
`
