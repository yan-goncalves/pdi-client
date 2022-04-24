import { BaseType } from 'types/common'
import { SkillType } from 'types/queries/collection/Skill'

export type VisibilitySectionType = {
  User: boolean
  Manager: boolean
  Coordinator: boolean
  Director: boolean
}

export interface SectionType extends BaseType {
  title: string
  visibility: VisibilitySectionType
  order_list: number
  type: 'question' | 'skill'
  skills?: SkillType[]
}
