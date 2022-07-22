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
import { IconCheck } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_EVALUATION_RESULT_CONCEPTS } from 'graphql/queries/collection/EvaluationResultConcept'
import { useEffect, useState } from 'react'
import {
  EvaluationResultConceptType,
  GetEvaluationResultConceptsType
} from 'types/collection/EvaluationResultConcept'

type AppraiseeConceptType = {
  concept: string
  description: string
  color: DefaultMantineColor
}

const EvaluationResult = () => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { performedEvaluation } = useEvaluation()
  const [appraiseeConcept, setAppraiseeConcept] = useState<AppraiseeConceptType>()
  const [concepts, setConcepts] = useState<EvaluationResultConceptType[]>([])
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false)

  const { data, loading, error, refetch } = useQuery<GetEvaluationResultConceptsType>(
    GET_EVALUATION_RESULT_CONCEPTS,
    {
      skip: !performedEvaluation.endFinished,
      context: {
        headers: {
          locale
        }
      }
    }
  )

  useEffect(() => {
    const abortController = new AbortController()

    if (error) {
      console.log('ERROR ON GETTING EVALUATION RESULT CONCEPTS', { ...error })
    } else if (data && !loading) {
      setConcepts(data.concepts)
    }

    return () => {
      abortController.abort()
    }
  }, [data, loading, error])

  useEffect(() => {
    refetch()
  }, [locale])

  useEffect(() => {
    if (concepts.length) {
      concepts.map(({ concept, description, color, min, max }) => {
        const grade = performedEvaluation.grade || 0
        if (grade >= min && grade <= max) {
          setAppraiseeConcept({ concept, description, color })
          return
        }
      })
    }
  }, [concepts])

  return (
    <Group m={25} mt={50} sx={{ justifyContent: 'center' }}>
      <Card withBorder sx={{ width: !match ? '70%' : '100%' }}>
        {performedEvaluation.endFinished && (
          <>
            <Card.Section p={25}>
              <Text size={'xl'} weight={500}>
                {CommonConstants.result.title[locale]}
              </Text>
            </Card.Section>
            <Divider mx={-20} />
          </>
        )}
        <Card.Section p={25}>
          {!performedEvaluation.endFinished ? (
            <Group spacing={15} px={50} py={30} direction={'column'} align={'center'}>
              <IconCheck size={50} color={theme.colors.green[6]} />
              <Text align={'center'} size={'xl'} weight={500}>
                {CommonConstants.result.finished.title[locale]}
              </Text>
              <Text align={'center'} size={'lg'}>
                {CommonConstants.result.finished.description[locale]}
              </Text>
            </Group>
          ) : (
            <Grid justify={'center'}>
              <Grid.Col span={5}>
                <Group
                  direction={'column'}
                  align={'center'}
                  sx={{ height: '100%', justifyContent: 'center' }}
                >
                  <Text
                    weight={900}
                    color={!appraiseeConcept ? undefined : appraiseeConcept.color}
                    sx={{ fontSize: !match ? 100 : 60 }}
                  >
                    {!appraiseeConcept ? (
                      <Skeleton height={30} radius={'xl'} />
                    ) : (
                      appraiseeConcept.concept
                    )}
                  </Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Divider orientation={'vertical'} />
              </Grid.Col>
              <Grid.Col span={5}>
                <Group
                  direction={'column'}
                  align={'center'}
                  sx={{ height: '100%', justifyContent: 'center' }}
                >
                  <Text weight={900} sx={{ fontSize: !match ? 100 : 60 }}>
                    {!appraiseeConcept ? (
                      <Skeleton height={30} radius={'xl'} />
                    ) : (
                      performedEvaluation.grade
                    )}
                  </Text>
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
