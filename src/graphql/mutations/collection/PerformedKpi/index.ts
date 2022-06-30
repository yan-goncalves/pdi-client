import { gql } from '@apollo/client'
import { FRAGMENT_PERFORMED_KPI } from 'graphql/fragments'

export const CREATE_PERFORMED_KPI = gql`
  ${FRAGMENT_PERFORMED_KPI}
  mutation CreatePerformedKpi(
    $idPerformedGoal: Int!
    $idKpi: Int!
    $ratingManager: Int
    $achieved: String
    $midFeedbackUser: String
    $endFeedbackUser: String
    $midFeedbackManager: String
    $endFeedbackManager: String
  ) {
    created: createPerformedGoalKpi(
      input: {
        idPerformedGoal: $idPerformedGoal
        idKpi: $idKpi
        ratingManager: $ratingManager
        achieved: $achieved
        midFeedbackUser: $midFeedbackUser
        endFeedbackUser: $endFeedbackUser
        midFeedbackManager: $midFeedbackManager
        endFeedbackManager: $endFeedbackManager
      }
    ) {
      ...FragmentPerformedKpi
    }
  }
`
export const UPDATE_PERFORMED_KPI = gql`
  ${FRAGMENT_PERFORMED_KPI}
  mutation UpdatePerformedKpi(
    $id: Int!
    $ratingManager: Int
    $achieved: String
    $midFeedbackUser: String
    $endFeedbackUser: String
    $midFeedbackManager: String
    $endFeedbackManager: String
  ) {
    updated: updatePerformedGoalKpi(
      id: $id
      input: {
        ratingManager: $ratingManager
        achieved: $achieved
        midFeedbackUser: $midFeedbackUser
        endFeedbackUser: $endFeedbackUser
        midFeedbackManager: $midFeedbackManager
        endFeedbackManager: $endFeedbackManager
      }
    ) {
      ...FragmentPerformedKpi
    }
  }
`
