import { BaseType } from 'types/common'
import { GoalType } from '../Goal'

import { PerformedEvaluationType } from '../PerformedEvaluation'
import { PerformedKpiType } from '../PerformedKpi'

export interface PerformedGoalType extends BaseType {
  performed: PerformedEvaluationType
  goal: GoalType
  performedKpis: PerformedKpiType[]
}

export type GetPerformedGoalType = {
  performed: PerformedGoalType
}

export type CreatePerformedGoalType = {
  created: PerformedGoalType
}

export type UpdatePerformedGoalType = {
  updated: PerformedGoalType
}
