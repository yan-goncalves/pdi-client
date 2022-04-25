import { BaseType } from 'types/common'

export interface FeedbackType extends BaseType {
  question: string
  order_list: number
}
