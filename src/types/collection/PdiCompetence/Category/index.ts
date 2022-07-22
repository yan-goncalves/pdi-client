import { BaseType } from 'types/common'

export interface PdiCompetenceCategoryType extends BaseType {
  name: string
}

export type GetPdiCompetenceCategories = {
  categories: PdiCompetenceCategoryType[]
}

export type CreatePdiCompetenceCategoryType = {
  created: PdiCompetenceCategoryType
}

export type DeletePdiCompetenceCategoryType = {
  deleted: PdiCompetenceCategoryType
}
