import { Avatar, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import ContentBase from 'components/ContentBase'
import EvaluationItem from 'components/EvaluationItem'
import EvaluationResult from 'components/EvaluationResult'
import PerformedFeedback from 'components/Performed/Feedback'
import PerformedGoal from 'components/Performed/Goal'
import PerformedQuestion from 'components/Performed/Question'
import PerformedSkill from 'components/Performed/Skill'
import { StepperProgress } from 'components/StepperProgress'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants } from 'constants/evaluation'
import { GoalsConstants } from 'constants/goals'
import { QuestionI18n } from 'constants/questions'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import React, { useEffect, useState } from 'react'
import PdiCoaching from 'templates/PdiCoaching'
import PdiCompetence from 'templates/PdiCompetence'
import PdiQuality from 'templates/PdiQuality'
import { FeedbackType } from 'types/collection/Feedback'
import { GoalType } from 'types/collection/Goal'
import { QuestionType } from 'types/collection/Question'
import { SkillType } from 'types/collection/Skill'
import { sortById } from 'utils/helpers'

export type EvaluationTemplateProps = {
  actor: EVALUATION_ACTOR
}

const EvaluationTemplate = ({ actor }: EvaluationTemplateProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { evaluationModel, appraisee, periodMode, performedEvaluation, isSaving } = useEvaluation()
  const [questions, setQuestions] = useState<QuestionType[]>()
  const [skills, setSkills] = useState<SkillType[]>()
  const [goals, setGoals] = useState<GoalType[]>()
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  useEffect(() => {
    const arrayQuestions: QuestionType[] = []
    evaluationModel?.sections?.map(
      (section) => section?.questions && arrayQuestions.push(...section.questions)
    )
    setQuestions(arrayQuestions.sort(sortById))

    const arraySkill: SkillType[] = []
    evaluationModel?.sections?.map(
      (section) => section?.skills && arraySkill.push(...section.skills)
    )
    setSkills(arraySkill.sort(sortById))

    setGoals(evaluationModel.goals)
    setFeedbacks(evaluationModel.feedbacks)
  }, [evaluationModel])

  if (!evaluationModel || !skills || !goals || !feedbacks) {
    return null
  }

  return (
    <ContentBase
      title={
        <Group sx={{ justifyContent: 'space-between' }}>
          <Title p={20} order={!match ? 3 : 6}>
            {evaluationModel.year} - {EvaluationConstants.title[periodMode][locale]}
          </Title>
          <Group mr={25}>
            <Avatar
              size={!match ? 'sm' : 'xs'}
              src={
                !appraisee?.picture
                  ? FALLBACK_USER_PICTURE
                  : `${process.env.NEXT_PUBLIC_API_URL}${appraisee.picture.url}`
              }
              sx={{ backgroundColor: theme.colors.gray[3] }}
            />
            <Text size={!match ? 'md' : 'xs'} weight={500}>
              {appraisee.info?.name} {appraisee.info?.lastname}
            </Text>
          </Group>
        </Group>
      }
    >
      <StepperProgress
        allowStepSelect
        disabled={isSaving}
        radius={'md'}
        groupButtonProps={{
          group: {
            sx: {
              alignItems: 'flex-end',
              justifyContent: 'flex-end'
            }
          },
          prev: { variant: 'white' },
          withDivider: {
            mt: 50,
            mx: -20
          }
        }}
        nextBtnLabel={CommonConstants.next[locale]}
        prevBtnLabel={CommonConstants.previous[locale]}
        finishBtnLabel={CommonConstants.finish[locale]}
        styles={{
          content: {
            height: '100%'
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100% - 50px)',
          padding: '20px 30px 0'
        }}
      >
        <StepperProgress.Step label={EvaluationConstants.steps.questions[locale]}>
          {questions?.map((question, index) => (
            <React.Fragment key={`${question.id}-${question.ask}`}>
              <EvaluationItem
                sectionTitle={`${QuestionI18n[locale]} ${index + 1}`}
                sectionColor={'orange'}
                title={question.ask}
              />
              <PerformedQuestion
                question={question}
                actor={actor}
                performed={performedEvaluation.questions?.find(
                  (performed) => performed && performed.question.id === question.id
                )}
              />
            </React.Fragment>
          ))}
        </StepperProgress.Step>
        {(performedEvaluation.midFinished || actor === EVALUATION_ACTOR.MANAGER) && (
          <StepperProgress.Step label={EvaluationConstants.steps.skills[locale]}>
            {skills?.map((skill) => (
              <React.Fragment key={`${skill.id}-${skill.title}`}>
                <EvaluationItem
                  sectionTitle={skill.title}
                  sectionColor={'grape'}
                  title={skill.description}
                />
                <PerformedSkill
                  skill={skill}
                  actor={actor}
                  performed={performedEvaluation.skills?.find(
                    (performed) => performed && performed.skill.id === skill.id
                  )}
                />
              </React.Fragment>
            ))}
          </StepperProgress.Step>
        )}
        <StepperProgress.Step label={EvaluationConstants.steps.goals[locale]}>
          {!goals.length ? (
            <div key={'no-one-goal'}>
              <Text size={'md'} color={'gray'}>
                {GoalsConstants.empty[locale]}
              </Text>
            </div>
          ) : (
            goals?.map((goal) => (
              <React.Fragment key={`${goal.id}-${goal.name}`}>
                <EvaluationItem
                  sectionTitle={EvaluationConstants.steps.goals[locale]}
                  sectionColor={'green'}
                  title={goal.name}
                />
                <PerformedGoal
                  goal={goal}
                  actor={actor}
                  performed={performedEvaluation.goals.find(
                    (performed) => performed && performed.goal?.id === goal.id
                  )}
                />
              </React.Fragment>
            ))
          )}
        </StepperProgress.Step>
        {(performedEvaluation.midFinished || actor === EVALUATION_ACTOR.MANAGER) && (
          <StepperProgress.Step label={EvaluationConstants.steps.feedbacks[locale]}>
            {feedbacks?.map((feedback) => (
              <React.Fragment key={`${feedback.id}-${feedback.inquire}`}>
                <EvaluationItem
                  sectionTitle={EvaluationConstants.steps.feedbacks[locale]}
                  sectionColor={'blue'}
                  title={feedback.inquire}
                />
                <PerformedFeedback
                  feedback={feedback}
                  actor={actor}
                  performed={performedEvaluation.feedbacks.find(
                    (performed) => performed && performed.feedback.id === feedback.id
                  )}
                />
              </React.Fragment>
            ))}
          </StepperProgress.Step>
        )}
        {(actor === EVALUATION_ACTOR.MANAGER ||
          performedEvaluation.midFinished ||
          performedEvaluation.endFinished) && (
          <StepperProgress.Step label={EvaluationConstants.steps.pdi[locale]}>
            <React.Fragment>
              <EvaluationItem
                sectionColor={'indigo'}
                sectionTitle={CommonConstants.pdiQuality.title[locale]}
              />
              <PdiQuality actor={actor} pdi={performedEvaluation.pdiQuality} />
            </React.Fragment>

            <React.Fragment>
              <EvaluationItem
                sectionColor={'indigo'}
                sectionTitle={CommonConstants.pdiCompetence.title[locale]}
              />
              <PdiCompetence actor={actor} pdi={performedEvaluation.pdiCompetence} />
            </React.Fragment>

            <React.Fragment>
              <EvaluationItem
                sectionColor={'indigo'}
                sectionTitle={CommonConstants.pdiCoaching.title[locale]}
              />
              <PdiCoaching actor={actor} pdi={performedEvaluation.pdiCoaching} />
            </React.Fragment>
          </StepperProgress.Step>
        )}
        <StepperProgress.Completed>
          <EvaluationResult />
        </StepperProgress.Completed>
      </StepperProgress>
    </ContentBase>
  )
}

export default EvaluationTemplate
