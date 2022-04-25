import { BaseType } from 'types/common'

export interface PerformedEvaluationType extends BaseType {}

export type GetPerformedEvaluationType = {
  performedEvaluations: PerformedEvaluationType[]
}
export type CreatePerformedEvaluationType = {
  createPerformedEvaluation: PerformedEvaluationType
}
