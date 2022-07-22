import { DefaultMantineColor } from '@mantine/core'
import { BaseType } from 'types/common'

export interface EvaluationResultConceptType extends BaseType {
  concept: string
  description: string
  color: DefaultMantineColor
  min: number
  max: number
}

export type GetEvaluationResultConceptsType = {
  concepts: EvaluationResultConceptType[]
}
