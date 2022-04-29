import { BaseType } from 'types/common'
import { AccessRoleType } from 'types/collection/User'

export interface UserInfoType extends BaseType {
  name: string
  lastname: string
  access_role: AccessRoleType
  role: string
  hiring_date: Date
  badge: number
  cost_center: number
}
