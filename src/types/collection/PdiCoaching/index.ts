import { BaseType } from 'types/common'
import { PerformedEvaluationType } from '../PerformedEvaluation'

export enum PDI_COACHING_CATEGORY {
  GROWTH = 'GROWTH',
  CAREER = 'CAREER'
}

export interface PdiCoachingType extends BaseType {
  performed: PerformedEvaluationType
  category: PDI_COACHING_CATEGORY
  action: string
}

export type CreatePdiCoachingType = {
  created: PdiCoachingType
}

export type UpdatePdiCoachingType = {
  updated: PdiCoachingType
}
