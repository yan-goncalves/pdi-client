import { ROLES } from 'constants/role'
import { DepartmentType } from 'types/collection/Department'
import { UserInfoType } from 'types/collection/UserInfo'
import { BaseType } from 'types/common'

export interface UserType extends BaseType {
  username: string
  email: string
  blocked: boolean | null
  confirmed: boolean
  role: ROLES
  picture?: string
  department: DepartmentType
  info: UserInfoType
  manager: Pick<UserType, 'id' | 'username' | 'info'>
}

export type GetUsersType = {
  users: UserType[]
}

export type GetUserType = {
  user: UserType
}
