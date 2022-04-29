import { BaseType } from 'types/common'
import { EvaluationGoalKpiType } from 'types/collection/EvaluationGoalKpiType'
import { EvaluationModelType } from 'types/collection/EvaluationModel'
import { GoalType } from 'types/collection/Goal'
import { UserType } from 'types/collection/User'

export interface EvaluationGoalType extends BaseType {
  evaluation: EvaluationModelType
  goal: GoalType
  user: UserType
  kpis: EvaluationGoalKpiType[]
}

export type GetEvaluationGoalsType = {
  evaluationGoals: EvaluationGoalType[]
}
