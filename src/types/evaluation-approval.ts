import {
  EVALUATION_APPROVAL_PERIOD,
  EVALUATION_APPROVAL_STATUS
} from 'constants/evaluation-approval'
import { PerformedEvaluationType } from './collection/PerformedEvaluation'
import { UserType } from './collection/User'

export type EvaluationApproval = {
  id: number
  performedEvaluation: PerformedEvaluationType
  period: EVALUATION_APPROVAL_PERIOD
  status: EVALUATION_APPROVAL_STATUS
  hrUser?: UserType
  comment?: string
  createdAt: string
  updatedAt: string
}

export type ApproveEvaluationInput = {
  idPerformedEvaluation: number
  period: EVALUATION_APPROVAL_PERIOD
  comment: string
}

export type RejectEvaluationInput = {
  idPerformedEvaluation: number
  period: EVALUATION_APPROVAL_PERIOD
  comment: string
}

export type ListEvaluationApprovalsInput = {
  status?: EVALUATION_APPROVAL_STATUS
  period?: EVALUATION_APPROVAL_PERIOD
}

