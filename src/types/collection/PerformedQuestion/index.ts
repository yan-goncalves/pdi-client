import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'
import { QuestionType } from '../Question'

export enum REPLY_OPTION {
  YES = 'yes',
  NO = 'no'
}

export interface PerformedQuestionType extends BaseType {
  performed: PerformedEvaluationType
  reply: REPLY_OPTION
  justification: string
  question: QuestionType
}

export type CreatePerformedQuestionType = {
  created: PerformedQuestionType
}

export type UpdatePerformedQuestionType = {
  updated: PerformedQuestionType
}
