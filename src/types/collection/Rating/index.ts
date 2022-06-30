import { BaseType } from 'types/common'

export interface RatingType extends BaseType {
  value: number
  description: string
}

export type GetRatings = {
  ratings: RatingType[]
}
