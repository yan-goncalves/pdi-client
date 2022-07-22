import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'
import { PdiCompetenceCategoryType } from './Category'

export interface PdiCompetenceType extends BaseType {
  performed: PerformedEvaluationType
  category: PdiCompetenceCategoryType
  name: string
  action: string
  deadline: Date
}

export type CreatePdiCompetenceType = {
  created: PdiCompetenceType
}

export type UpdatePdiCompetenceType = {
  updated: PdiCompetenceType
}

export type DeletePdiCompetenceType = {
  deleted: PdiCompetenceType
}
