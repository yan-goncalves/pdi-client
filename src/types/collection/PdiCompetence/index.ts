import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'
import { PdiCompetenceCategoryType } from './Category'

export interface PdiCompetenceType extends BaseType {
  performed: PerformedEvaluationType
  category: PdiCompetenceCategoryType
  action: string
  deadline: Date
}

export type CreatePdiCompetenceType = {
  created: PdiCompetenceType
}

export type UpdatePdiCompetenceType = {
  updated: PdiCompetenceType
}
