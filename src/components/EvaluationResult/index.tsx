import { useQuery } from '@apollo/client'
import {
  Card,
  DefaultMantineColor,
  Divider,
  Grid,
  Group,
  Skeleton,
  Text,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Rating } from '@mui/material'
import { IconCheck } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_EVALUATION_RESULT_CONCEPTS } from 'graphql/queries/collection/EvaluationResultConcept'
import { GET_PERFORMED_EVALUATION_GRADE } from 'graphql/queries/collection/PerformedEvaluation'
import { useEffect, useState } from 'react'
import {
  EvaluationResultConceptType,
  GetEvaluationResultConceptsType
} from 'types/collection/EvaluationResultConcept'
import { GetPerformedEvaluationType } from 'types/collection/PerformedEvaluation'

type AppraiseeConceptType = {
  concept: string
  description: string
  color: DefaultMantineColor
}

export type EvaluationResultProps = {
  actor: EVALUATION_ACTOR
}

const EvaluationResult = ({ actor }: EvaluationResultProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { performedEvaluation, setPerformedEvaluation, ratings, periodMode } = useEvaluation()
  const [appraiseeConcept, setAppraiseeConcept] = useState<AppraiseeConceptType>()
  const [grade, setGrade] = useState<number>()
  const [concepts, setConcepts] = useState<EvaluationResultConceptType[]>([])
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false)

  const {
    data: dataPerformed,
    loading: loadingPerformed,
    error: errorPerformed
  } = useQuery<GetPerformedEvaluationType>(GET_PERFORMED_EVALUATION_GRADE, {
    skip: !performedEvaluation.endFinished,
    variables: {
      id: performedEvaluation.id
    }
  })

  const {
    data: dataConcepts,
    loading: loadingConcepts,
    error: errorConcepts,
    refetch
  } = useQuery<GetEvaluationResultConceptsType>(GET_EVALUATION_RESULT_CONCEPTS, {
    skip: !performedEvaluation.endFinished,
    context: {
      headers: {
        locale
      }
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    if (errorPerformed) {
      console.log('ERROR ON GETTING PERFORMED EVALUATION', { ...errorPerformed })
    } else if (dataPerformed && !loadingPerformed) {
      setGrade(dataPerformed.performedEvaluation.grade)
      setPerformedEvaluation((pe) => ({
        ...pe,
        grade: dataPerformed.performedEvaluation.grade
      }))
    }

    return () => {
      abortController.abort()
    }
  }, [dataPerformed, loadingPerformed, errorPerformed])

  useEffect(() => {
    if (typeof grade === 'number') {
      const abortController = new AbortController()

      if (errorConcepts) {
        console.log('ERROR ON GETTING EVALUATION RESULT CONCEPTS', { ...errorConcepts })
      } else if (dataConcepts && !loadingConcepts) {
        setConcepts(dataConcepts.concepts)
      }

      return () => {
        abortController.abort()
      }
    }
  }, [dataConcepts, loadingConcepts, errorConcepts, grade])

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    if (concepts.length && typeof grade === 'number') {
      concepts.map(({ concept, description, color, min, max }) => {
        const grade = performedEvaluation.grade || 0
        if (grade >= min && grade <= max) {
          setAppraiseeConcept({ concept, description, color })
          return
        }
      })
    }
  }, [concepts, grade])

  return (
    <Group m={25} mt={50} sx={{ justifyContent: 'center' }}>
      <Card withBorder sx={{ width: !match ? '70%' : '100%' }}>
        {performedEvaluation.endFinished && (
          <>
            <Card.Section p={25} pt={5}>
              <Text size={'xl'} weight={500}>
                {CommonConstants.result.title[locale]}
              </Text>
            </Card.Section>
            <Divider mx={-20} />
          </>
        )}
        <Card.Section p={25}>
          {(periodMode === EVALUATION_PERIOD.MID || !performedEvaluation.endFinished) &&
          actor === EVALUATION_ACTOR.USER ? (
            <Group spacing={15} px={50} py={30} direction={'column'} align={'center'}>
              <IconCheck size={50} color={theme.colors.green[6]} />
              <Text align={'center'} size={'xl'} weight={500}>
                {CommonConstants.result.finished.title[locale]}
              </Text>
              <Text align={'center'} size={'lg'}>
                {periodMode === EVALUATION_PERIOD.MID
                  ? CommonConstants.result.finished.description.mid[locale]
                  : CommonConstants.result.finished.description.end[locale]}
              </Text>
            </Group>
          ) : (
            <Grid justify={'center'}>
              <Grid.Col span={5}>
                <Group
                  spacing={5}
                  direction={'column'}
                  align={'center'}
                  sx={{ height: '100%', justifyContent: 'center' }}
                >
                  {!appraiseeConcept || typeof grade === 'undefined' ? (
                    <>
                      <Skeleton height={!match ? 100 : 60} radius={!match ? 'lg' : 'md'} />
                      <Skeleton mt={10} height={!match ? 40 : 20} radius={!match ? 'lg' : 'md'} />
                    </>
                  ) : (
                    <>
                      <Text
                        weight={900}
                        color={!appraiseeConcept ? undefined : appraiseeConcept.color}
                        sx={{ fontSize: !match ? 100 : 60 }}
                      >
                        {appraiseeConcept.concept}
                      </Text>
                      <Text
                        align={'center'}
                        weight={700}
                        color={!appraiseeConcept ? undefined : appraiseeConcept.color}
                        mt={-20}
                        sx={{ fontSize: !match ? 20 : 14 }}
                      >
                        {appraiseeConcept.description}
                      </Text>
                    </>
                  )}
                </Group>
              </Grid.Col>
              <Grid.Col span={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider orientation={'vertical'} />
              </Grid.Col>
              <Grid.Col span={5}>
                <Group
                  spacing={5}
                  direction={'column'}
                  align={'center'}
                  sx={{ height: '100%', justifyContent: 'center' }}
                >
                  {!appraiseeConcept || typeof grade === 'undefined' ? (
                    <>
                      <Skeleton height={!match ? 100 : 60} radius={!match ? 'lg' : 'md'} />
                      <Skeleton mt={10} height={!match ? 40 : 20} radius={!match ? 'lg' : 'md'} />
                    </>
                  ) : (
                    <>
                      <Text weight={900} sx={{ fontSize: !match ? 80 : 40 }}>
                        {grade}
                      </Text>
                      <Rating
                        readOnly
                        precision={0.1}
                        value={2}
                        max={ratings.length}
                        size={!match ? 'large' : 'medium'}
                      />
                    </>
                  )}
                </Group>
              </Grid.Col>
            </Grid>
          )}
        </Card.Section>
      </Card>
    </Group>
  )
}

export default EvaluationResult
