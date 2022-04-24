import { EvaluationPeriod } from 'constants/evaluation'
import { BaseType } from 'types/common'
import { SectionType } from 'types/queries/collection/Section'
import { FeedbackType } from 'types/queries/collection/Feedback'
import { EvaluationGoalType } from '../EvaluationGoal'

export interface EvaluationModelType extends BaseType {
  year: string
  period: EvaluationPeriod
  finished: boolean
  sections?: SectionType[]
  feedbacks?: FeedbackType[]
  goals?: EvaluationGoalType[]
}

export type GetAllEvaluationModelProps = {
  evaluationModels: Pick<EvaluationModelType, 'year' | 'period' | 'finished'>[]
}

export type GetEvaluationModelProps = {
  evaluationModels: EvaluationModelType[]
}
