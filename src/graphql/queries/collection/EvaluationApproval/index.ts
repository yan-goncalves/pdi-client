import { gql } from '@apollo/client'
import { FRAGMENT_EVALUATION_APPROVAL, FRAGMENT_USER_MODEL } from 'graphql/fragments'

// Fragment leve para listagem (sem todos os dados da avaliação)
const FRAGMENT_EVALUATION_APPROVAL_LIST = gql`
  ${FRAGMENT_USER_MODEL}
  fragment FragmentEvaluationApprovalList on EvaluationApprovalModel {
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
      user {
        ...FragmentUserModel
      }
      evaluation {
        id
        year
        period
      }
    }
    hrUser {
      ...FragmentUserModel
    }
  }
`

export const GET_EVALUATION_APPROVAL = gql`
  ${FRAGMENT_EVALUATION_APPROVAL}
  query GetEvaluationApproval($id: Int!) {
    evaluationApproval(id: $id) {
      ...FragmentEvaluationApproval
    }
  }
`

export const GET_EVALUATION_APPROVALS = gql`
  ${FRAGMENT_EVALUATION_APPROVAL_LIST}
  query GetEvaluationApprovals($input: ListEvaluationApprovalsInput) {
    evaluationApprovals(input: $input) {
      ...FragmentEvaluationApprovalList
    }
  }
`

export const GET_REJECTED_EVALUATIONS_FOR_MANAGER = gql`
  ${FRAGMENT_EVALUATION_APPROVAL_LIST}
  query GetRejectedEvaluationsForManager {
    rejectedEvaluationsForManager {
      ...FragmentEvaluationApprovalList
    }
  }
`

