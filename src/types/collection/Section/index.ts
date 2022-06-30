import { ROLES } from 'constants/role'
import { SkillType } from 'types/collection/Skill'
import { BaseType } from 'types/common'
import { QuestionType } from '../Question'

export type VisibilitySectionType = {
  [ROLES.USER]?: boolean
  [ROLES.MANAGER]?: boolean
  [ROLES.COORDINATOR]?: boolean
  [ROLES.DIRECTOR]?: boolean
  [ROLES.ADMIN]?: boolean
}

export interface SectionType extends BaseType {
  title: string
  visibility: VisibilitySectionType
  questions?: QuestionType[]
  skills?: SkillType[]
}
