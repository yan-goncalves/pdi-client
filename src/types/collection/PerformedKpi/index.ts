import { BaseType } from 'types/common'
import { KpiType } from '../Kpi'
import { PerformedGoalType } from '../PerformedGoal'
import { RatingType } from '../Rating'

export interface PerformedKpiType extends BaseType {
  performedGoal: PerformedGoalType
  kpi: KpiType
  ratingManager?: RatingType
  achieved?: string
  midFeedbackUser?: string
  endFeedbackUser?: string
  midFeedbackManager?: string
  endFeedbackManager?: string
}

export type CreatePerformedKpiType = {
  created: PerformedKpiType
}

export type UpdatePerformedKpiType = {
  updated: PerformedKpiType
}
