import { useQuery } from '@apollo/client'
import {
  Badge,
  Box,
  DefaultMantineColor,
  Divider,
  Grid,
  Group,
  Skeleton,
  Stack,
  Text,
  useMantineTheme
} from '@mantine/core'
import { IconScale } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { EVALUATION_APPROVAL_TRANSLATIONS } from 'constants/evaluation-approval'
import { useLocale } from 'contexts/LocaleProvider'
import { GET_EVALUATION_RESULT_CONCEPTS } from 'graphql/queries/collection/EvaluationResultConcept'
import { GET_CALIBRATION } from 'graphql/queries/calibration'
import { useEffect, useState } from 'react'
import {
  EvaluationResultConceptType,
  GetEvaluationResultConceptsType
} from 'types/collection/EvaluationResultConcept'
import { PerformedEvaluationType } from 'types/collection/PerformedEvaluation'
import { Calibration } from 'types/calibration'

type AppraiseeConceptType = {
  concept: string
  description: string
  color: DefaultMantineColor
}

type ApprovalEvaluationInfoProps = {
  performedEvaluation: PerformedEvaluationType
}

const ApprovalEvaluationInfo = ({ performedEvaluation }: ApprovalEvaluationInfoProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const [appraiseeConcept, setAppraiseeConcept] = useState<AppraiseeConceptType>()
  const [concepts, setConcepts] = useState<EvaluationResultConceptType[]>([])
  const [loading, setLoading] = useState(true)
  const [calibration, setCalibration] = useState<Calibration | null>(null)

  // Fetch calibration data if evaluation is calibrated
  const { data: calibrationData, loading: loadingCalibration } = useQuery<{ calibration: Calibration }>(
    GET_CALIBRATION,
    {
      variables: { idPerformedEvaluation: performedEvaluation.id },
      skip: !performedEvaluation.isCalibrated || typeof performedEvaluation.grade !== 'number'
    }
  )

  const {
    data: dataConcepts,
    loading: loadingConcepts,
    error: errorConcepts
  } = useQuery<GetEvaluationResultConceptsType>(GET_EVALUATION_RESULT_CONCEPTS, {
    context: {
      headers: {
        locale
      }
    }
  })

  useEffect(() => {
    if (calibrationData?.calibration) {
      setCalibration(calibrationData.calibration)
    }
  }, [calibrationData])

  useEffect(() => {
    if (errorConcepts) {
      console.log('ERROR ON GETTING EVALUATION RESULT CONCEPTS', { ...errorConcepts })
      setLoading(false)
    } else if (dataConcepts && !loadingConcepts) {
      setConcepts(dataConcepts.concepts)
      setLoading(false)
    }
  }, [dataConcepts, loadingConcepts, errorConcepts])

  useEffect(() => {
    if (concepts.length && typeof performedEvaluation.grade === 'number') {
      // Usa a nota final (com calibração) se existir, senão usa a nota original
      const gradeToUse = calibration?.finalGrade ?? performedEvaluation.grade

      const concept = concepts.find((concept) => {
        const { min, max } = concept
        const grade = gradeToUse || 0
        if (grade >= min && grade <= max) {
          return concept
        }
      })

      if (concept) {
        setAppraiseeConcept(concept)
      }
    }
  }, [concepts, performedEvaluation.grade, calibration])

  const isLoading = loading || loadingConcepts || loadingCalibration

  return (
    <Box
      p="md"
      sx={{
        backgroundColor: theme.colors.gray[0],
        borderRadius: theme.radius.md
      }}
    >
      <Text size="sm" weight={600} mb="md">
        {EVALUATION_APPROVAL_TRANSLATIONS.evaluationInfo[locale]}
      </Text>

      {isLoading || !appraiseeConcept || typeof performedEvaluation.grade === 'undefined' ? (
        <Skeleton height={80} radius={theme.radius.md} />
      ) : (
        <Grid grow gutter="md">
          {/* Conceito */}
          <Grid.Col span={6}>
            <Stack spacing={4}>
              <Badge size="sm" color="blue" variant="light">
                {CommonConstants.result.concept[locale]}
              </Badge>
              <Text
                weight={700}
                color={appraiseeConcept.color}
                size="xl"
                align='center'
              >
                {appraiseeConcept.concept}
              </Text>
              <Text size="xs" color="dimmed" align='center'>
                {appraiseeConcept.description}
              </Text>
            </Stack>
          </Grid.Col>

          {/* Nota */}
          <Grid.Col span={6}>
            <Stack spacing={4}>
              <Badge size="sm" color="blue" variant="light">
                {CommonConstants.result.grade[locale]}
              </Badge>
              <Text weight={700} size="xl" align='center'>
                {calibration?.finalGrade ? calibration.finalGrade.toFixed(2) : performedEvaluation.grade?.toFixed(2)}
              </Text>
              {calibration && (
                <Text size="xs" color="dimmed" align='center'>
                  {EVALUATION_APPROVAL_TRANSLATIONS.finalGradeCalibrated[locale]}
                </Text>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      )}

      {/* Calibração */}
      {calibration && (
        <>
          <Divider my="md" />
          <Stack spacing="md">
            <Group>
              <IconScale size={18} color={theme.colors.blue[6]} />
              <Text size="sm" weight={600}>
                {EVALUATION_APPROVAL_TRANSLATIONS.calibration[locale]}
              </Text>
            </Group>

            <Group spacing="md">
              <Stack spacing={2}>
                <Text size="xs" color="dimmed">
                  {EVALUATION_APPROVAL_TRANSLATIONS.originalGrade[locale]}
                </Text>
                <Text weight={600}>
                  {calibration.originalGrade.toFixed(2)}
                </Text>
              </Stack>

              <Stack spacing={2}>
                <Text size="xs" color="dimmed">
                  {EVALUATION_APPROVAL_TRANSLATIONS.adjustment[locale]}
                </Text>
                <Text
                  weight={600}
                  color={
                    calibration.calibrationValue >= 0 ? 'green' : 'red'
                  }
                >
                  {calibration.calibrationValue >= 0 ? '+' : ''}
                  {calibration.calibrationValue.toFixed(2)}
                </Text>
              </Stack>

              <Text size="sm" weight={600}>
                =
              </Text>

              <Stack spacing={2}>
                <Text size="xs" color="dimmed">
                  {EVALUATION_APPROVAL_TRANSLATIONS.finalGrade[locale]}
                </Text>
                <Text weight={600} color="green">
                  {calibration.finalGrade.toFixed(2)}
                </Text>
              </Stack>
            </Group>

            {/* Comentário da calibração */}
            {calibration.comment && (
              <Box
                p="sm"
                sx={{
                  backgroundColor: theme.colors.gray[1],
                  borderLeft: `4px solid ${theme.colors.blue[6]}`,
                  borderRadius: theme.radius.sm
                }}
              >
                <Text size="xs" weight={600} mb={4}>
                  {EVALUATION_APPROVAL_TRANSLATIONS.calibrationComment[locale]}:
                </Text>
                <Text size="sm" color="dimmed">
                  {calibration.comment}
                </Text>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Box>
  )
}

export default ApprovalEvaluationInfo
