import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'
import { RatingType } from '../Rating'
import { SkillType } from '../Skill'

export interface PerformedSkillType extends BaseType {
  performed: PerformedEvaluationType
  skill: SkillType
  ratingUser?: RatingType
  ratingManager?: RatingType
  midFeedbackManager?: string
  endFeedbackManager?: string
  midFeedbackUser?: string
  endFeedbackUser?: string
}

export type CreatePerformedSkillType = {
  created: PerformedSkillType
}

export type UpdatePerformedSkillType = {
  updated: PerformedSkillType
}
