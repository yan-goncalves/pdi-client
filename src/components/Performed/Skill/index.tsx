import { useMutation } from '@apollo/client'
import { Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { Rating } from '@mui/material'
import { IconStar } from '@tabler/icons'
import Accordion from 'components/Accordion'
import Comment from 'components/Comment'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants, EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PERFORMED_SKILL,
  UPDATE_PERFORMED_SKILL
} from 'graphql/mutations/collection/PerformedSkill'
import { useEffect, useLayoutEffect, useState } from 'react'
import {
  CreatePerformedSkillType,
  PerformedSkillType,
  UpdatePerformedSkillType
} from 'types/collection/PerformedSkill'
import { SkillType } from 'types/collection/Skill'
import PerformedView from '../View'

export type PerformedSkillProps = {
  skill: SkillType
  performed?: PerformedSkillType
  actor: EVALUATION_ACTOR
}

export type PerformedSkillCommentType =
  | 'midFeedbackManager'
  | 'endFeedbackManager'
  | 'endFeedbackUser'

export type PerformedSkillRatingType = 'ratingUser' | 'ratingManager'

const PerformedSkill = ({ skill, performed, actor }: PerformedSkillProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const {
    performedEvaluation,
    setPerformedEvaluation,
    periodMode,
    ratings,
    isLocaleLoading,
    mode
  } = useEvaluation()
  const [performedSkill, setPerformedSkill] = useState<PerformedSkillType>()
  const [rating, setRating] = useState<number>(-1)
  const [comment, setComment] = useState<string>()
  const [commentField, setCommentField] = useState<PerformedSkillCommentType>('midFeedbackManager')
  const [ratingField, setRatingField] = useState<PerformedSkillRatingType>('ratingUser')
  const [hover, setHover] = useState<number>(-1)
  const [labels, setLabels] = useState<string[]>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isRated, setIsRated] = useState<boolean>(false)

  // queries/mutations
  const [create] = useMutation<CreatePerformedSkillType>(CREATE_PERFORMED_SKILL, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED QUESTION', { ...e })
  })
  const [update] = useMutation<UpdatePerformedSkillType>(UPDATE_PERFORMED_SKILL, {
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
      setCommentField(
        periodMode === EVALUATION_PERIOD.MID
          ? 'midFeedbackManager'
          : actor === EVALUATION_ACTOR.MANAGER
          ? 'endFeedbackManager'
          : 'endFeedbackUser'
      )
      setRatingField(actor === EVALUATION_ACTOR.MANAGER ? 'ratingManager' : 'ratingUser')
    }
  }, [periodMode, actor])

  useEffect(() => {
    if (performed) {
      setPerformedSkill(performed)
    } else {
      setComment('')
    }
  }, [performed])

  useEffect(() => {
    if (performedSkill) {
      setComment(performedSkill[commentField] || '')
    }
  }, [performedSkill, setCommentField])

  useEffect(() => {
    if (performedSkill) {
      setRating(performedSkill[ratingField]?.value || -1)
    }
  }, [performedSkill, setRatingField])

  useEffect(() => {
    if (ratings.length) {
      setLabels(ratings.map((rating) => rating.description))
    }
  }, [ratings])

  useEffect(() => {
    if ((hover > -1 || rating > -1) && !isLocaleLoading) {
      setIsRated(true)
    } else {
      setIsRated(false)
    }
  }, [hover, rating, isLocaleLoading])

  const updatePerformedEvaluation = async (skill: PerformedSkillType) => {
    const skillIndex = performedEvaluation.skills.findIndex((s) => s.id === skill.id)
    const skills = performedEvaluation.skills.map((currSkill) => {
      return currSkill.id === skill.id ? { ...currSkill, ...skill } : { ...currSkill }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      skills: skillIndex < 0 ? [...pe.skills, skill] : skills
    }))
  }

  const handleSave = async (
    field: PerformedSkillCommentType | PerformedSkillRatingType,
    value: number | string
  ) => {
    if (!performedSkill) {
      await create({
        variables: {
          idPerformed: performedEvaluation.id,
          idSkill: skill.id,
          [field]: value
        }
      })
    } else {
      await update({
        variables: {
          id: performedSkill.id,
          [field]: value
        }
      })
    }
  }

  const handleChange = async (_: React.SyntheticEvent, newRating: number | null) => {
    setRating(newRating || -1)
    await handleSave(ratingField, newRating || -1)
  }

  const handleSaveComment = async () => {
    await handleSave(commentField, comment || '')
  }

  return (
    <Grid p={10} gutter={50}>
      {periodMode !== EVALUATION_PERIOD.MID && (
        <Grid.Col span={12} xs={3} xl={2}>
          <Group align={'center'} direction={'column'} spacing={'xs'}>
            <Title order={6}>{CommonConstants.rating.title[locale]}</Title>
            <Group sx={{ cursor: !isLocaleLoading && !isDisabled ? 'auto' : 'not-allowed' }}>
              <Rating
                icon={<IconStar size={30} fill={theme.colors.yellow[6]} style={{ padding: 2 }} />}
                emptyIcon={<IconStar size={30} style={{ padding: 2 }} />}
                disabled={isLocaleLoading}
                size={'large'}
                max={ratings.length}
                value={!isLocaleLoading ? rating : -1}
                onChange={(_, newRating) => !isDisabled && handleChange(_, newRating)}
                onChangeActive={(_, newHover) => !isDisabled && setHover(newHover)}
                sx={{ pointerEvents: !isLocaleLoading && !isDisabled ? 'auto' : 'none' }}
              />
            </Group>
            <Text
              align={'center'}
              weight={isRated ? 'bold' : 'normal'}
              size={isRated ? 'md' : 'xs'}
              sx={(theme) => ({
                color: isRated ? 'dark' : theme.colors.gray[4],
                minHeight: 25
              })}
            >
              {!isLocaleLoading
                ? isRated
                  ? labels?.[hover > -1 ? hover - 1 : rating - 1]
                  : CommonConstants.rating.label[locale]
                : CommonConstants.loading[locale]}
            </Text>
          </Group>
        </Grid.Col>
      )}

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

      {(performedEvaluation.midFinished || performedEvaluation.endFinished) && (
        <Grid.Col mt={15} span={12}>
          <Text
            size={'sm'}
            p={10}
            mb={5}
            weight={500}
            hidden={actor === EVALUATION_ACTOR.MANAGER && periodMode === EVALUATION_PERIOD.MID}
          >
            {CommonConstants.historic[locale]}:
          </Text>
          {performedEvaluation.midFinished &&
            (actor !== EVALUATION_ACTOR.MANAGER || periodMode !== EVALUATION_PERIOD.MID) && (
              <Accordion>
                <Accordion.Item
                  label={
                    <Group>
                      <Text>
                        {CommonConstants.actor.manager[locale]} -{' '}
                        {EvaluationConstants.title.MID[locale]}
                      </Text>
                    </Group>
                  }
                >
                  <PerformedView comment={performed?.midFeedbackManager} />
                </Accordion.Item>
              </Accordion>
            )}
          {(performedEvaluation.endFinished || actor === EVALUATION_ACTOR.MANAGER) &&
            periodMode !== EVALUATION_PERIOD.MID && (
              <Accordion mt={10}>
                <Accordion.Item
                  label={
                    <Group>
                      <Text>
                        {
                          CommonConstants.actor[
                            actor === EVALUATION_ACTOR.USER
                              ? EVALUATION_ACTOR.MANAGER
                              : EVALUATION_ACTOR.USER
                          ][locale]
                        }{' '}
                        - {EvaluationConstants.title.END[locale]}
                      </Text>
                    </Group>
                  }
                >
                  <PerformedView
                    rating={{
                      labels,
                      value:
                        actor === EVALUATION_ACTOR.MANAGER
                          ? performed?.ratingUser?.value
                          : performed?.ratingManager?.value
                    }}
                    comment={
                      actor === EVALUATION_ACTOR.MANAGER
                        ? performed?.endFeedbackUser
                        : performed?.endFeedbackManager
                    }
                  />
                </Accordion.Item>
              </Accordion>
            )}
        </Grid.Col>
      )}
    </Grid>
  )
}

export default PerformedSkill
