type BaseProps = {
  id: number
  createdAt: string
  updatedAt: string
}

export interface UserInfoProps extends BaseProps {
  name: string
  lastname: string
  access_role: 'User' | 'Manager' | 'Coordinator' | 'Director'
  role: string
  hiring_date: Date
  badge: number
  cost_center: number
}

export interface DepartmentProps extends BaseProps {
  key: string
  name: string
}
