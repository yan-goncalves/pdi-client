import { BaseType } from 'types/common'
import { PerformedQuestionType } from '../PerformedQuestion'

export interface PerformedEvaluationType extends BaseType {
  performed_questions: PerformedQuestionType[]
}

export type GetPerformedEvaluationType = {
  performedEvaluations: PerformedEvaluationType[]
}

export type CreatePerformedEvaluationType = {
  created: PerformedEvaluationType
}
