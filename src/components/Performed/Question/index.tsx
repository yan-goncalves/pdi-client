import { useMutation } from '@apollo/client'
import { Grid, Group, Radio, RadioGroup, Text, Textarea, Title } from '@mantine/core'
import { CommonConstants } from 'constants/common'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PERFORMED_QUESTION,
  UPDATE_PERFORMED_QUESTION
} from 'graphql/mutations/collection/PerformedQuestion'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  CreatePerformedQuestionType,
  PerformedQuestionType,
  UpdatePerformedQuestionType
} from 'types/collection/PerformedQuestion'
import { SkillType } from 'types/collection/Skill'

export type PerformedQuestionProps = {
  item: SkillType
  performed?: PerformedQuestionType
  type: 'user' | 'manager'
}

const PerformedQuestion = ({ item, performed, type }: PerformedQuestionProps) => {
  const { locale } = useLocale()
  const { data: session } = useSession()
  const { performedEvaluation, setPerformedEvaluation } = useEvaluation()
  const [performedQuestion, setPerformedQuestion] = useState<PerformedQuestionType>()
  const [answer, setAnswer] = useState<string>()
  const [why, setWhy] = useState<string>()

  // queries/mutations
  const [create] = useMutation<CreatePerformedQuestionType>(CREATE_PERFORMED_QUESTION, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePerformedQuestionType>(UPDATE_PERFORMED_QUESTION, {
    onCompleted: (data) => console.log('UPDATED PERFORMED QUESTION', { ...data }),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED QUESTION', { ...e })
  })

  useEffect(() => {
    if (performedEvaluation) {
      const performedQuestionFound = performedEvaluation.performed_questions.find(
        (pq) => pq.skill.id === item.id
      )
      setPerformedQuestion(performedQuestionFound)
    }
  }, [performedEvaluation])

  useEffect(() => {
    if (performed) {
      setPerformedQuestion(performed)
    }
  }, [performed])

  useEffect(() => {
    if (performedQuestion) {
      setAnswer(performedQuestion.answer)
      setWhy(performedQuestion.why)
    }
  }, [performedQuestion])

  const updatePerformedEvaluation = async (question: PerformedQuestionType) => {
    setPerformedEvaluation((pe) => ({
      ...pe,
      performed_questions: pe.performed_questions.map((pq) =>
        pq.id === question.id ? { ...pq, ...question } : pq
      )
    }))
  }

  const handleSaveAnswer = async (value: string) => {
    setAnswer(value)

    if (!performedQuestion) {
      await create({
        variables: {
          idPerformedEvaluation: performedEvaluation.id,
          idQuestion: item.id,
          answer: value
        }
      })
    } else {
      await update({
        variables: {
          id: performedQuestion.id,
          answer: value
        }
      })
    }
  }

  const handleSaveWhy = async () => {
    /* */
  }

  return (
    <Grid p={10}>
      <Grid.Col span={12} xs={3} xl={2}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.answer[locale]}:</Title>
          <RadioGroup
            value={answer}
            onChange={handleSaveAnswer}
            spacing={'xl'}
            orientation={'horizontal'}
          >
            <Radio
              disabled={type === 'manager'}
              value={'yes'}
              label={<Text weight={500}>{locale === 'en' ? 'Yes' : 'Sim'}</Text>}
            />
            <Radio
              disabled={type === 'manager'}
              value={'no'}
              label={<Text weight={500}>{locale === 'en' ? 'No' : 'Não'}</Text>}
            />
          </RadioGroup>
        </Group>
      </Grid.Col>
      <Grid.Col span={12} xs={8}>
        <Group direction={'column'}>
          <Title order={6}>{CommonConstants.why[locale]}</Title>
          <Textarea
            disabled={type === 'manager'}
            value={why}
            onChange={({ currentTarget: { value } }) => setWhy(value)}
            minRows={5}
            maxRows={5}
            sx={{ width: 'min(30rem, 100%)' }}
          />
        </Group>
      </Grid.Col>
    </Grid>
  )
}

export default PerformedQuestion
