import { BaseType } from 'types/common'
import { SectionType } from 'types/collection/Section'

export interface SkillType extends BaseType {
  title: string
  description: string
  section: SectionType
}
