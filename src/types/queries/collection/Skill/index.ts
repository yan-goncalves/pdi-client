import { BaseType } from 'types/common'
import { SectionType } from 'types/queries/collection/Section'

export interface SkillType extends BaseType {
  title: string
  description: string
  section: SectionType
}
