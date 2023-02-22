import { useMutation } from '@apollo/client'
import { Grid, Group, Radio, RadioGroup, Text, Title } from '@mantine/core'
import Comment from 'components/Comment'
import { CommonConstants } from 'constants/common'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PERFORMED_QUESTION,
  UPDATE_PERFORMED_QUESTION
} from 'graphql/mutations/collection/PerformedQuestion'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  CreatePerformedQuestionType,
  PerformedQuestionType,
  REPLY_OPTION,
  UpdatePerformedQuestionType
} from 'types/collection/PerformedQuestion'
import { QuestionType } from 'types/collection/Question'
import { useStyles } from './styles'

export type PerformedQuestionProps = {
  question: QuestionType
  performed?: PerformedQuestionType
  actor: EVALUATION_ACTOR
}

const PerformedQuestion = ({ question, performed, actor }: PerformedQuestionProps) => {
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, mode } = useEvaluation()
  const { classes } = useStyles({ actor, mode })
  const [performedQuestion, setPerformedQuestion] = useState<PerformedQuestionType>()
  const [reply, setReply] = useState<REPLY_OPTION>()
  const [justification, setJustification] = useState<string>()
  // const [currentJustification, setCurrentJustification] = useState<string>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  // queries/mutations
  const [create] = useMutation<CreatePerformedQuestionType>(CREATE_PERFORMED_QUESTION, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePerformedQuestionType>(UPDATE_PERFORMED_QUESTION, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })

  useLayoutEffect(() => {
    if (actor === EVALUATION_ACTOR.MANAGER || mode === EVALUATION_MODE.VIEW) {
      setIsDisabled(true)
    }
  }, [actor, mode])

  useEffect(() => {
    if (performedEvaluation) {
      const performedQuestionFound = performedEvaluation.questions?.find(
        ({ question: q }) => q.id === question.id
      )
      setPerformedQuestion(performedQuestionFound)
    }
  }, [performedEvaluation])

  useEffect(() => {
    if (performed) {
      setPerformedQuestion(performed)
      setReply(performed.reply)
      setJustification(performed.justification || '')
    } else {
      setJustification('')
    }
  }, [performed])

  const updatePerformedEvaluation = async (question: PerformedQuestionType) => {
    const questionIndex = performedEvaluation.questions.findIndex((q) => q.id === question.id)
    const questions = performedEvaluation.questions.map((currQuestion) => {
      return currQuestion.id === question.id
        ? { ...currQuestion, ...question }
        : { ...currQuestion }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      questions: questionIndex < 0 ? [...pe.questions, question] : questions
    }))
  }

  const handleSave = async (field: 'reply' | 'justification', value: string) => {
    if (!performedQuestion) {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          idQuestion: question.id,
          [field]: value
        }
      })
    } else {
      await update({
        variables: {
          id: performedQuestion.id,
          [field]: value
        }
      })
    }
  }

  const handleSaveReply = async (value: REPLY_OPTION) => {
    if (!isDisabled) {
      setReply(value)
      await handleSave('reply', value)
    }
  }

  const handleSavejustification = async () => {
    await handleSave('justification', justification || '')
  }

  return (
    <Grid p={10} gutter={50}>
      <Grid.Col span={12} xs={3} xl={2}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.reply[locale]}:</Title>
          <Group sx={{ cursor: !isDisabled ? 'auto' : 'not-allowed' }}>
            <RadioGroup
              value={reply}
              onChange={!isDisabled ? handleSaveReply : undefined}
              spacing={'xl'}
              orientation={'horizontal'}
              sx={{ pointerEvents: !isDisabled ? 'auto' : 'none' }}
            >
              <Radio
                value={REPLY_OPTION.YES}
                label={<Text weight={500}>{CommonConstants.replyOption.yes[locale]}</Text>}
                className={classes.radio}
              />
              <Radio
                value={REPLY_OPTION.NO}
                label={<Text weight={500}>{CommonConstants.replyOption.no[locale]}</Text>}
                className={classes.radio}
              />
            </RadioGroup>
          </Group>
        </Group>
      </Grid.Col>
      <Grid.Col span={12} xs={8}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.justification[locale]}</Title>
          <Comment
            isDisabled={isDisabled}
            value={justification}
            onChange={setJustification}
            handleSave={handleSavejustification}
          />
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default PerformedQuestion
