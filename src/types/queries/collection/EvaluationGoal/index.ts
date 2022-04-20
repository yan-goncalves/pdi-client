import { UserType } from 'types/auth'
import { BaseType } from 'types/common'
import { EvaluationGoalKpiType } from 'types/queries/collection/EvaluationGoalKpiType'
import { EvaluationModelType } from 'types/queries/collection/EvaluationModel'
import { GoalType } from 'types/queries/collection/Goal'

export interface EvaluationGoalType extends BaseType {
  evaluation: EvaluationModelType
  goal: GoalType
  user: UserType
  kpis: EvaluationGoalKpiType[]
}

export type GetEvaluationGoalsType = {
  evaluationGoals: EvaluationGoalType[]
}
