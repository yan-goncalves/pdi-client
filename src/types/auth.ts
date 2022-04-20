import { BaseType } from 'types/common'

export interface UserType extends BaseType {
  username: string
  email: string
  provider: 'local'
  blocked: boolean | null
  confirmed: boolean
  role?: 'Administrator' | 'Authenticated'
  picture: string
  department: DepartmentType
  info: UserInfoType
  manager: Pick<UserType, 'id' | 'username'>
}

export interface UserInfoType extends BaseType {
  name: string
  lastname: string
  access_role: 'User' | 'Manager' | 'Coordinator' | 'Director'
  role: string
  hiring_date: Date
  badge: number
  cost_center: number
}

export interface DepartmentType extends BaseType {
  key: string
  name: string
}
