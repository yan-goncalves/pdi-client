import { BaseType } from 'types/common'
import { UserType } from 'types/collection/User'

export interface GoalType extends BaseType {
  name: string
  manager: UserType
}
