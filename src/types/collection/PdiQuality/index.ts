import { BaseType } from 'types/common'

export enum PDI_QUALITY_CATEGORY {
  STRENGTH = 'STRENGTH',
  WEAKNESS = 'WEAKNESS'
}

export interface PdiQualityType extends BaseType {
  category: PDI_QUALITY_CATEGORY
  description: string
}

export type CreatePdiQualityType = {
  created: PdiQualityType
}

export type UpdatePdiQualityType = {
  updated: PdiQualityType
}
