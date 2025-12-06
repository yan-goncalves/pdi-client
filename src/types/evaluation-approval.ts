import {
  EVALUATION_APPROVAL_PERIOD,
  EVALUATION_APPROVAL_STATUS
} from 'constants/evaluation-approval'
import { PerformedEvaluation } from './performed-evaluation'
import { User } from './user'

export type EvaluationApproval = {
  id: number
  performedEvaluation: PerformedEvaluation
  period: EVALUATION_APPROVAL_PERIOD
  status: EVALUATION_APPROVAL_STATUS
  hrUser?: User
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

