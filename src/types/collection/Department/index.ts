import { BaseType } from 'types/common'

export interface DepartmentType extends BaseType {
  key: string
  name: string
}

export type GetDepartmentsType = {
  departments: DepartmentType[]
}
