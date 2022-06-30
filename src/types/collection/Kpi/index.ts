import { UserType } from 'types/collection/User'
import { BaseType } from 'types/common'

export interface KpiType extends BaseType {
  manager: UserType
  name: string
  target: string
  weight: number
}

export type GetKpisType = {
  kpis: KpiType[]
}

export type CreateKpiType = {
  created: KpiType
}

export type UpdateKpiType = {
  updated: KpiType
}

export type DeleteKpiType = {
  deleted: KpiType
}
