import { BaseType } from 'types/common'
import { DepartmentType } from 'types/collection/Department'
import { UserInfoType } from 'types/collection/UserInfo'

export type AccessRoleType = 'User' | 'Manager' | 'Coordinator' | 'Director'

export interface UserType extends BaseType {
  username: string
  email: string
  provider: 'local'
  blocked: boolean | null
  confirmed: boolean
  role?: 'Administrator' | 'Authenticated'
  picture?: {
    url: string
  }
  department: DepartmentType
  info: UserInfoType
  manager: Pick<UserType, 'id' | 'username'>
}

export type GetUsers = {
  users: UserType[]
}

export type GetUser = {
  users: UserType[]
}
