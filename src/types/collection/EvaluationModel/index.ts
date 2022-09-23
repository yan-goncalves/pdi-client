import { EVALUATION_PERIOD } from 'constants/evaluation'
import { FeedbackType } from 'types/collection/Feedback'
import { SectionType } from 'types/collection/Section'
import { BaseType } from 'types/common'
import { GoalType } from '../Goal'

export interface EvaluationModelType extends BaseType {
  year: string
  period: EVALUATION_PERIOD
  midDate: {
    start: Date
    deadline: Date
  }
  endDate: {
    start: Date
    deadline: Date
  }
  sections?: SectionType[]
  feedbacks?: FeedbackType[]
  goals?: GoalType[]
}

export type GetEvaluationModelsType = {
  evaluations: Pick<EvaluationModelType, 'id' | 'year' | 'period' | 'midDate' | 'endDate'>[]
}

export type GetEvaluationModelType = {
  evaluation: EvaluationModelType
}
