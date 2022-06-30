import { useMutation } from '@apollo/client'
import { Divider, Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { Rating } from '@mui/material'
import { IconStar } from '@tabler/icons'
import Accordion from 'components/Accordion'
import Comment from 'components/Comment'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants, EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  CREATE_PERFORMED_KPI,
  UPDATE_PERFORMED_KPI
} from 'graphql/mutations/collection/PerformedKpi'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { KpiType } from 'types/collection/Kpi'
import { PerformedGoalType } from 'types/collection/PerformedGoal'
import {
  CreatePerformedKpiType,
  PerformedKpiType,
  UpdatePerformedKpiType
} from 'types/collection/PerformedKpi'
import PerformedView from '../View'

export type PerformedKpiProps = {
  kpi: KpiType
  actor: EVALUATION_ACTOR
  performedGoal: PerformedGoalType
  hasDivider: boolean
}

export type PerformedGoalCommentType =
  | 'midFeedbackUser'
  | 'endFeedbackUser'
  | 'midFeedbackManager'
  | 'endFeedbackManager'

export type PerformedGoalRatingType = 'ratingManager'
export type PerformedGoalAchievedType = 'achieved'

const PerformedKpi = ({ kpi, actor, performedGoal, hasDivider }: PerformedKpiProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const {
    performedEvaluation,
    setPerformedEvaluation,
    periodMode,
    ratings,
    isLocaleLoading,
    mode,
    isSaving,
    setIsSaving
  } = useEvaluation()
  const [performedKpi, setPerformedKpi] = useState<PerformedKpiType>()
  const [rating, setRating] = useState<number>(-1)
  const [comment, setComment] = useState<string>()
  const [achieved, setAchieved] = useState<string>()
  const [achievedField, setAchievedField] = useState<PerformedGoalAchievedType>('achieved')
  const [commentField, setCommentField] = useState<PerformedGoalCommentType>('midFeedbackUser')
  const [ratingField, setRatingField] = useState<PerformedGoalRatingType>('ratingManager')
  const [hover, setHover] = useState<number>(-1)
  const [labels, setLabels] = useState<string[]>()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [isRated, setIsRated] = useState<boolean>(false)

  // queries / mutations
  const [create] = useMutation<CreatePerformedKpiType>(CREATE_PERFORMED_KPI, {
    onCompleted: ({ created }) => updatePerformedEvaluation(created),
    onError: (e) => console.log('ERROR ON CREATING PERFORMED KPI', { ...e })
  })

  const [update] = useMutation<UpdatePerformedKpiType>(UPDATE_PERFORMED_KPI, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED KPI', { ...e })
  })

  useLayoutEffect(() => {
    if (mode === EVALUATION_MODE.VIEW) {
      setIsDisabled(true)
    }
  }, [actor, mode])

  useEffect(() => {
    if (performedGoal) {
      const found = performedGoal.performedKpis?.find(({ kpi: item }) => item.id === kpi.id)
      if (found) {
        setPerformedKpi(found)
      }
    }
  }, [performedGoal])

  useEffect(() => {
    if (performedKpi) {
      setComment(performedKpi[commentField] || '')
    }
  }, [performedKpi, setCommentField])

  useEffect(() => {
    if (performedKpi) {
      setAchieved(performedKpi?.achieved || '')
    }
  }, [performedKpi, setAchievedField])

  useEffect(() => {
    if (performedKpi) {
      setRating(performedKpi[ratingField]?.value || -1)
    }
  }, [performedKpi, setRatingField])

  useEffect(() => {
    if (periodMode && actor) {
      let field: PerformedGoalCommentType

      if (periodMode === EVALUATION_PERIOD.MID) {
        field = actor === EVALUATION_ACTOR.USER ? 'midFeedbackUser' : 'midFeedbackManager'
      } else {
        field = actor === EVALUATION_ACTOR.USER ? 'endFeedbackUser' : 'endFeedbackManager'
      }

      setCommentField(field)
    }
  }, [periodMode, actor])

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

  const handleSave = async (
    field: PerformedGoalCommentType | PerformedGoalRatingType | PerformedGoalAchievedType,
    value: number | string
  ) => {
    if (!performedKpi) {
      await create({
        variables: {
          idPerformedGoal: performedGoal.id,
          idKpi: kpi.id,
          [field]: value
        }
      })
    } else {
      await update({
        variables: {
          id: performedKpi.id,
          [field]: value
        }
      })
    }
  }

  const handleChange = async (_: React.SyntheticEvent, newRating: number | null) => {
    setRating(newRating || -1)
    setIsSaving(true)
    await handleSave(ratingField, newRating || -1).then(() => setIsSaving(false))
  }

  const handleSaveComment = async () => {
    await handleSave(commentField, comment || '')
  }

  const handleSaveAchieved = async () => {
    await handleSave(achievedField, achieved || '')
  }

  const updatePerformedEvaluation = async (kpi: PerformedKpiType) => {
    const kpiIndex = performedGoal.performedKpis?.findIndex((k) => k.id === kpi.id)
    const kpis = performedGoal.performedKpis?.map((currKpi) => {
      return currKpi.id === kpi.id ? { ...currKpi, ...kpi } : { ...currKpi }
    })

    const updated = {
      ...performedGoal,
      performedKpis: kpiIndex < 0 ? [...performedGoal.performedKpis, kpi] : kpis
    }

    const goalIndex = performedEvaluation.goals?.findIndex((q) => q.id === updated.id)
    const goals = performedEvaluation.goals?.map((currGoal) => {
      return currGoal.id === updated.id ? { ...currGoal, ...updated } : { ...currGoal }
    })

    setPerformedEvaluation((pe) => ({
      ...pe,
      goals: goalIndex < 0 ? [...pe.goals, updated] : goals
    }))
  }

  return (
    <React.Fragment>
      {periodMode !== EVALUATION_PERIOD.MID && actor === EVALUATION_ACTOR.MANAGER && (
        <Grid.Col span={12} xs={3} xl={2}>
          <Group align={'center'} direction={'column'} spacing={'xs'}>
            <Title order={6}>{CommonConstants.rating.title[locale]}</Title>
            <Group
              sx={{
                cursor: !isSaving && !isLocaleLoading && !isDisabled ? 'auto' : 'not-allowed'
              }}
            >
              <Rating
                icon={<IconStar size={30} fill={theme.colors.yellow[6]} style={{ padding: 2 }} />}
                emptyIcon={<IconStar size={30} style={{ padding: 2 }} />}
                disabled={isLocaleLoading}
                size={'large'}
                max={ratings.length}
                value={!isLocaleLoading ? rating : -1}
                onChange={(_, newRating) => !isSaving && !isDisabled && handleChange(_, newRating)}
                onChangeActive={(_, newHover) => !isSaving && !isDisabled && setHover(newHover)}
                sx={{
                  pointerEvents: !isSaving && !isLocaleLoading && !isDisabled ? 'auto' : 'none'
                }}
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
          {periodMode !== EVALUATION_PERIOD.MID && actor === EVALUATION_ACTOR.MANAGER && (
            <>
              <Text size={'sm'} weight={500}>
                {CommonConstants.achieved[locale]}
              </Text>
              <Comment
                type={'text'}
                isDisabled={isDisabled}
                value={achieved}
                onChange={setAchieved}
                handleSave={handleSaveAchieved}
                placeholder={CommonConstants.placeholder.target[locale]}
              />
            </>
          )}
          <Text size={'sm'} weight={500}>
            {CommonConstants.comment[locale]}
          </Text>
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
          {performedEvaluation.midFinished && (
            <Accordion>
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
                      - {EvaluationConstants.title.MID[locale]}
                    </Text>
                  </Group>
                }
              >
                <PerformedView
                  comment={
                    actor === EVALUATION_ACTOR.MANAGER
                      ? performedKpi?.midFeedbackUser
                      : performedKpi?.midFeedbackManager
                  }
                />
              </Accordion.Item>
            </Accordion>
          )}
          {performedEvaluation.endFinished &&
            actor === EVALUATION_ACTOR.USER &&
            periodMode !== EVALUATION_PERIOD.MID && (
              <Accordion mt={10}>
                <Accordion.Item
                  label={
                    <Group>
                      <Text>
                        {CommonConstants.actor.manager[locale]} -{' '}
                        {EvaluationConstants.title.END[locale]}
                      </Text>
                    </Group>
                  }
                >
                  <PerformedView
                    title={CommonConstants.achieved[locale]}
                    rating={{
                      labels,
                      value: performedKpi?.ratingManager?.value
                    }}
                    comment={performedKpi?.achieved}
                  />
                  <PerformedView comment={performedKpi?.endFeedbackManager} />
                </Accordion.Item>
              </Accordion>
            )}
        </Grid.Col>
      )}

      <Divider hidden={!hasDivider} mb={20} mt={80} sx={{ width: '100%' }} />
    </React.Fragment>
  )
}

export default PerformedKpi
