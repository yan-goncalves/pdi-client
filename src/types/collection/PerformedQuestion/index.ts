import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'
import { SkillType } from '../Skill'

export interface PerformedQuestionType extends BaseType {
  answer: 'yes' | 'no'
  why: string
  performed_evaluation: PerformedEvaluationType
  skill: SkillType
}

export type CreatePerformedQuestionType = {
  created: PerformedQuestionType
}

export type UpdatePerformedQuestionType = {
  updated: PerformedQuestionType
}
