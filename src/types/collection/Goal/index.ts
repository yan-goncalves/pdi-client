import { UserType } from 'types/collection/User'
import { BaseType } from 'types/common'
import { EvaluationModelType } from '../EvaluationModel'
import { KpiType } from '../Kpi'

export interface GoalType extends BaseType {
  evaluation: EvaluationModelType
  manager: UserType
  user: UserType
  name: string
  kpis: KpiType[]
}

export type GetGoalType = {
  goal: GoalType
}

export type GetEvaluationGoalsType = {
  evaluationGoals: GoalType[]
}

export type GetGoalsType = {
  goals: GoalType[]
}

export type CreateGoalType = {
  created: GoalType
}

export type UpdateGoalType = {
  updated: GoalType
}

export type DeleteGoalType = {
  deleted: GoalType
}
