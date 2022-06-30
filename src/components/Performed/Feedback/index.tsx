import { useMutation } from '@apollo/client'
import { Grid, Group, Title } from '@mantine/core'
import Comment from 'components/Comment'
import { CommonConstants } from 'constants/common'
import { EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PERFORMED_FEEDBACK,
  UPDATE_PERFORMED_FEEDBACK
} from 'graphql/mutations/collection/PerformedFeedback'
import { useEffect, useLayoutEffect, useState } from 'react'
import { FeedbackType } from 'types/collection/Feedback'
import {
  CreatePerformedFeedbackType,
  PerformedFeedbackType,
  UpdatePerformedFeedbackType
} from 'types/collection/PerformedFeedback'

export type PerformedFeedbackProps = {
  feedback: FeedbackType
  performed?: PerformedFeedbackType
  actor: EVALUATION_ACTOR
}

export type PerformedFeedbackCommentType = 'midReply' | 'endReply'

const PerformedFeedback = ({ feedback, performed, actor }: PerformedFeedbackProps) => {
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, periodMode, mode } = useEvaluation()
  const [performedFeedback, setPerformedFeedback] = useState<PerformedFeedbackType>()
  const [comment, setComment] = useState<string>()
  const [commentField, setCommentField] = useState<PerformedFeedbackCommentType>('midReply')
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const [create] = useMutation<CreatePerformedFeedbackType>(CREATE_PERFORMED_FEEDBACK, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePerformedFeedbackType>(UPDATE_PERFORMED_FEEDBACK, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })

  useLayoutEffect(() => {
    if (mode === EVALUATION_MODE.VIEW) {
      setIsDisabled(true)
    }
  }, [actor, mode])

  useEffect(() => {
    if (periodMode && actor) {
      setCommentField(periodMode === EVALUATION_PERIOD.MID ? 'midReply' : 'endReply')
    }
  }, [periodMode])

  useEffect(() => {
    if (performed) {
      setPerformedFeedback(performed)
    } else {
      setComment('')
    }
  }, [performed])

  useEffect(() => {
    if (performedFeedback) {
      setComment(performedFeedback[commentField] || '')
    }
  }, [performedFeedback, setCommentField])

  const updatePerformedEvaluation = async (feedback: PerformedFeedbackType) => {
    const feedbackIndex = performedEvaluation.feedbacks.findIndex((q) => q.id === feedback.id)
    const feedbacks = performedEvaluation.feedbacks.map((currFeedback) => {
      return currFeedback.id === feedback.id
        ? { ...currFeedback, ...feedback }
        : { ...currFeedback }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      feedbacks: feedbackIndex < 0 ? [...pe.feedbacks, feedback] : feedbacks
    }))
  }

  const handleSave = async (field: PerformedFeedbackCommentType, value: string) => {
    if (!performedFeedback) {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          idFeedback: feedback.id,
          [field]: value
        }
      })
    } else {
      await update({
        variables: {
          id: performedFeedback.id,
          [field]: value
        }
      })
    }
  }

  const handleSaveComment = async () => {
    await handleSave(commentField, comment || '')
  }

  return (
    <Grid p={10} gutter={50}>
      {actor === EVALUATION_ACTOR.MANAGER && (
        <Grid.Col span={12} xs={8}>
          <Group direction={'column'}>
            <Title order={6}>{CommonConstants.comment[locale]}</Title>
            <Comment
              isDisabled={isDisabled}
              value={comment}
              onChange={setComment}
              handleSave={handleSaveComment}
            />
          </Group>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default PerformedFeedback
