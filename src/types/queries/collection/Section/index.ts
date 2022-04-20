import { BaseType } from 'types/common'
import { SkillType } from 'types/queries/collection/Skill'

export type VisibilitySectionType = {
  user: boolean
  manager: boolean
  coordinator: boolean
  director: boolean
}

export interface SectionType extends BaseType {
  title: string
  visibility: VisibilitySectionType
  order_list: number
  skills?: SkillType[]
}
