import { BaseType } from 'types/common'
import { FeedbackType } from '../Feedback'
import { PerformedEvaluationType } from '../PerformedEvaluation'

export interface PerformedFeedbackType extends BaseType {
  performed: PerformedEvaluationType
  feedback: FeedbackType
  midReply?: string
  endReply?: string
}

export type CreatePerformedFeedbackType = {
  created: PerformedFeedbackType
}

export type UpdatePerformedFeedbackType = {
  updated: PerformedFeedbackType
}
