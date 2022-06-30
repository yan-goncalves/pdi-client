import { BaseType } from 'types/common'

export interface PdiCompetenceCategoryType extends BaseType {
  name: string
}

export type GetPdiCompetenceCategories = {
  categories: PdiCompetenceCategoryType[]
}
