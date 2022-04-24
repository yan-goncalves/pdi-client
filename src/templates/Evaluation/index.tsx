import { Text, useMantineTheme } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import { StepperProgress } from 'components/StepperProgress'
import { CommonConstants } from 'constants/common'
import { EvaluationSteps } from 'constants/evaluation'
import { GoalsMessages } from 'constants/goals'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { useEffect, useState } from 'react'
import { EvaluationGoalType } from 'types/queries/collection/EvaluationGoal'
import { FeedbackType } from 'types/queries/collection/Feedback'
import { SkillType } from 'types/queries/collection/Skill'

export type EvaluationTemplateProps = {
  type: 'user' | 'manager'
}

const EvaluationTemplate = ({ type }: EvaluationTemplateProps) => {
  const { locale } = useLocale()
  const theme = useMantineTheme()
  const { evaluationModel, mode, periodMode } = useEvaluation()
  const [questions, setQuestions] = useState<SkillType[]>()
  const [skills, setSkills] = useState<SkillType[]>()
  const [goals, setGoals] = useState<EvaluationGoalType[]>()
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>()

  useEffect(() => {
    const arrayQuestions: SkillType[] = []
    evaluationModel?.sections?.map(
      (section) =>
        section.type === 'question' &&
        section?.skills &&
        arrayQuestions.push(...section.skills)
    )
    setQuestions(arrayQuestions)

    const arraySkill: SkillType[] = []
    evaluationModel?.sections?.map(
      (section) =>
        section.type === 'skill' &&
        section?.skills &&
        arraySkill.push(...section.skills)
    )
    setSkills(arraySkill)

    setGoals([])
    setFeedbacks(evaluationModel.feedbacks)
  }, [evaluationModel])

  if (!evaluationModel || !skills || !goals || !feedbacks) {
    return null
  }

  return (
    <ContentBase title={evaluationModel.year}>
      <StepperProgress
        allowStepSelect
        radius={'md'}
        nextBtnLabel={CommonConstants.next[locale]}
        prevBtnLabel={CommonConstants.previous[locale]}
        finishBtnLabel={CommonConstants.finish[locale]}
      >
        <StepperProgress.Step label={EvaluationSteps.questions[locale]}>
          {questions?.map((question) => (
            <div key={`${question.id}-${question.title}`}>{question.title}</div>
          ))}
        </StepperProgress.Step>
        <StepperProgress.Step label={EvaluationSteps.skills[locale]}>
          {skills?.map((skill) => (
            <div key={`${skill.id}-${skill.title}`}>{skill.title}</div>
          ))}
        </StepperProgress.Step>
        <StepperProgress.Step label={EvaluationSteps.goals[locale]}>
          {goals.length === 0 ? (
            <div key={'no-one-goal'}>
              <Text size={'sm'} color={'gray'}>
                {GoalsMessages.empty[locale]}
              </Text>
            </div>
          ) : (
            goals?.map(({ goal }) => (
              <div key={`${goal.id}-${goal.name}`}>{goal.name}</div>
            ))
          )}
        </StepperProgress.Step>
        <StepperProgress.Step label={EvaluationSteps.feedbacks[locale]}>
          {feedbacks?.map((feedback) => (
            <div key={`${feedback.id}-${feedback.question}`}>
              {feedback.question}
            </div>
          ))}
        </StepperProgress.Step>
        <StepperProgress.Completed>
          Avaliação finalizada
        </StepperProgress.Completed>
      </StepperProgress>
    </ContentBase>
  )
}

export default EvaluationTemplate
