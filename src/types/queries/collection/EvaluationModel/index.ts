import { EVALUATION_MODEL_PERIOD } from 'constants/evaluation'
import { SectionType } from 'types/queries/collection/Section'
import { FeedbackType } from '../Feedback'

export type EvaluationModelType = {
  year: string
  period: EVALUATION_MODEL_PERIOD
  finished: boolean
  sections?: SectionType[]
  feedbacks?: FeedbackType[]
}

export type GetAllEvaluationModelProps = {
  evaluationModels: Pick<EvaluationModelType, 'year' | 'period' | 'finished'>[]
}

export type GetEvaluationModelProps = {
  evaluationModel: EvaluationModelType
}
