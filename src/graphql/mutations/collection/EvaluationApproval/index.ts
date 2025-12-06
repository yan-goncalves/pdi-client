import { gql } from '@apollo/client'
import { FRAGMENT_USER_MODEL } from 'graphql/fragments'

export const APPROVE_EVALUATION = gql`
  ${FRAGMENT_USER_MODEL}
  mutation ApproveEvaluation($input: ApproveEvaluationInput!) {
    approveEvaluation(input: $input) {
      id
      period
      status
      comment
      createdAt
      updatedAt
      performedEvaluation {
        id
        grade
        midFinished
        endFinished
        isCalibrated
      }
      hrUser {
        ...FragmentUserModel
      }
    }
  }
`

export const REJECT_EVALUATION = gql`
  ${FRAGMENT_USER_MODEL}
  mutation RejectEvaluation($input: RejectEvaluationInput!) {
    rejectEvaluation(input: $input) {
      id
      period
      status
      comment
      createdAt
      updatedAt
      performedEvaluation {
        id
        grade
        midFinished
        endFinished
        isCalibrated
      }
      hrUser {
        ...FragmentUserModel
      }
    }
  }
`

