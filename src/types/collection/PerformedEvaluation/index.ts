import { BaseType } from 'types/common'
import { EvaluationModelType } from '../EvaluationModel'
import { PdiCoachingType } from '../PdiCoaching'
import { PdiCompetenceType } from '../PdiCompetence'
import { PdiQualityType } from '../PdiQuality'
import { PerformedFeedbackType } from '../PerformedFeedback'
import { PerformedGoalType } from '../PerformedGoal'
import { PerformedQuestionType } from '../PerformedQuestion'
import { PerformedSkillType } from '../PerformedSkill'
import { UserType } from '../User'
import { EvaluationApproval } from '../../evaluation-approval'

export interface PerformedEvaluationType extends BaseType {
  evaluation: EvaluationModelType
  user: UserType
  grade?: number
  midFinished: boolean
  endFinished: boolean
  calibrationValue?: number
  calibrationJustification?: string
  questions: PerformedQuestionType[]
  skills: PerformedSkillType[]
  goals: PerformedGoalType[]
  feedbacks: PerformedFeedbackType[]
  pdiCoaching: PdiCoachingType[]
  pdiCompetence: PdiCompetenceType[]
  pdiQuality: PdiQualityType[]
  approvals?: EvaluationApproval[]
}

export type GetPerformedEvaluationType = {
  performedEvaluation: PerformedEvaluationType
}

export type CreatePerformedEvaluationType = {
  created: PerformedEvaluationType
}

export type UpdatePerformedEvaluationType = {
  updated: PerformedEvaluationType
}
