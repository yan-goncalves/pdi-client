import { UserType } from 'types/auth'
import { BaseType } from 'types/common'

export interface GoalType extends BaseType {
  name: string
  manager: UserType
}
