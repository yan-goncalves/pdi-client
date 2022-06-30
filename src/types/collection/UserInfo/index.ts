import { BaseType } from 'types/common'

export interface UserInfoType extends BaseType {
  name: string
  lastname: string
  position: string
  role: string
  hiring_date: Date
  badge: number
  cost_center: number
}
