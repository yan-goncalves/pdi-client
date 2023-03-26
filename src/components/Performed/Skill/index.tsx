import { useMutation } from '@apollo/client'
import { Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { Rating } from '@mui/material'
import { IconStar } from '@tabler/icons'
import Comment from 'components/Comment'
import HistoricEvaluation from 'components/HistoricEvaluation'
import { CommonConstants } from 'constants/common'
import { EVALUATION_PERIOD } from 'constants/evaluation'
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

export type PerformedSkillProps = {
  skill: SkillType
  performed?: PerformedSkillType
  actor: EVALUATION_ACTOR
}

export type PerformedSkillCommentType =
  | 'midFeedbackManager'
  | 'endFeedbackManager'
  | 'midFeedbackUser'
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
    mode,
    isSaving,
    setIsSaving
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
    onError: (e) => console.log('ERROR ON CREATING PERFORMED SKILL', { ...e })
  })
  const [update] = useMutation<UpdatePerformedSkillType>(UPDATE_PERFORMED_SKILL, {
    onCompleted: ({ updated }) => updatePerformedEvaluation(updated),
    onError: (e) => console.log('ERROR ON UPDATING PERFORMED SKILL', { ...e })
  })

  useLayoutEffect(() => {
    if (mode === EVALUATION_MODE.VIEW) {
      setIsDisabled(true)
    }
  }, [actor, mode])

  useEffect(() => {
    if (periodMode && actor) {
      let _commentField: PerformedSkillCommentType
      const isMid = periodMode === EVALUATION_PERIOD.MID
      if (actor === EVALUATION_ACTOR.MANAGER) {
        _commentField = isMid ? 'midFeedbackManager' : 'endFeedbackManager'
      } else {
        _commentField = isMid ? 'midFeedbackUser' : 'endFeedbackUser'
      }
      setCommentField(_commentField)
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
    if (rating > -1) {
      setIsRated(true)
    } else {
      setIsRated(false)
    }
  }, [rating])

  useEffect(() => {
    if (hover > -1 || rating > -1) {
      setIsRated(true)
    } else {
      setIsRated(false)
    }
  }, [hover])

  const updatePerformedEvaluation = async (skill: PerformedSkillType) => {
    const skillIndex = performedEvaluation.skills?.findIndex((s) => s.id === skill.id)
    const skills = performedEvaluation.skills?.map((currSkill) => {
      return currSkill.id === skill.id ? { ...currSkill, ...skill } : { ...currSkill }
    })
    setPerformedEvaluation((pe) => ({
      ...pe,
      skills: skillIndex < 0 ? [...pe.skills, skill] : skills
    }))

    setIsSaving(false)
  }

  const handleSave = async (
    field: PerformedSkillCommentType | PerformedSkillRatingType,
    value: number | string
  ) => {
    setIsSaving(true)
    await handleCreateUpdate(field, value)
  }

  const handleCreateUpdate = async (
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
    setHover(-1)
    await handleSave(ratingField, newRating || -1)
  }

  const handleSaveComment = async () => {
    await handleSave(commentField, comment || '')
  }

  return (
    <Grid p={10}>
      {mode === EVALUATION_MODE.EDIT && (
        <>
          {periodMode !== EVALUATION_PERIOD.MID && (
            <Grid.Col span={12} xs={3} xl={2}>
              <Group align={'center'} direction={'column'} spacing={'xs'}>
                <Title order={6}>{CommonConstants.rating.title[locale]}</Title>
                <Group
                  sx={{
                    cursor: !isLocaleLoading && !isDisabled && !isSaving ? 'auto' : 'not-allowed'
                  }}
                >
                  <Rating
                    icon={
                      <IconStar size={30} fill={theme.colors.yellow[6]} style={{ padding: 2 }} />
                    }
                    emptyIcon={<IconStar size={30} style={{ padding: 2 }} />}
                    disabled={isSaving || isLocaleLoading}
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
        </>
      )}
      <HistoricEvaluation
        manager={{
          midYear: performed?.midFeedbackManager || '',
          endYear: performed?.endFeedbackManager || '',
          rating: performed?.ratingManager?.value || -1
        }}
        user={{
          midYear: performed?.midFeedbackUser || '',
          endYear: performed?.endFeedbackUser || '',
          rating: performed?.ratingUser?.value || -1
        }}
      />
    </Grid>
  )
}

export default PerformedSkill
