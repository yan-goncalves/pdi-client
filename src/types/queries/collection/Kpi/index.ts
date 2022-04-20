import { UserType } from 'types/auth'
import { BaseType } from 'types/common'

export interface KpiType extends BaseType {
  name: string
  manager: UserType
}
