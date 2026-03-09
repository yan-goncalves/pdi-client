import { useMutation, useQuery } from '@apollo/client'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  DefaultMantineColor,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { Rating, Typography } from '@mui/material'
import {
  IconAlertTriangle,
  IconCheck,
  IconChecks,
  IconClock,
  IconEdit,
  IconScale,
  IconTrash
} from '@tabler/icons'
import { CalibrationModal } from 'components/CalibrationModal'
import { CALIBRATION_TRANSLATIONS } from 'constants/calibration'
import { CommonConstants } from 'constants/common'
import { EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import {
  EVALUATION_APPROVAL_STATUS,
  EVALUATION_APPROVAL_STATUS_LABEL,
  EVALUATION_APPROVAL_TRANSLATIONS
} from 'constants/evaluation-approval'
import { GET_EVALUATION_RESULT_CONCEPTS } from 'graphql/queries/collection/EvaluationResultConcept'
import {
  GET_PERFORMED_EVALUATION_APPROVALS,
  GET_PERFORMED_EVALUATION_GRADE
} from 'graphql/queries/collection/PerformedEvaluation'
import { GET_CALIBRATION } from 'graphql/queries/calibration'
import { DELETE_CALIBRATION } from 'graphql/mutations/calibration'
import { useEvaluationApproval } from 'hooks/useEvaluationApproval'
import React, { useEffect, useMemo, useState } from 'react'
import {
  EvaluationResultConceptType,
  GetEvaluationResultConceptsType
} from 'types/collection/EvaluationResultConcept'
import { GetPerformedEvaluationType } from 'types/collection/PerformedEvaluation'
import { Calibration } from 'types/calibration'
import {
  GET_EVALUATION_APPROVAL,
  GET_EVALUATION_APPROVALS
} from 'graphql/queries/collection/EvaluationApproval'

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
  const { performedEvaluation, setPerformedEvaluation, ratings, periodMode, mode } = useEvaluation()
  const [appraiseeConcept, setAppraiseeConcept] = useState<AppraiseeConceptType>()
  const [concepts, setConcepts] = useState<EvaluationResultConceptType[]>([])
  const [calibration, setCalibration] = useState<Calibration | null>(null)
  const [finalGradeModified, setFinalGradeModified] = useState(false)
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false)

  const { data: approvalData, refetch: refetchApproval } = useQuery<GetPerformedEvaluationType>(
    GET_PERFORMED_EVALUATION_APPROVALS,
    {
      variables: {
        id: performedEvaluation.id
      },
      skip: !performedEvaluation.id
    }
  )

  // Check if evaluation is approved and grab approval object
  const { isApproved, approval } = useEvaluationApproval(
    periodMode,
    approvalData?.performedEvaluation
  )
  const shouldShowGrade = actor === EVALUATION_ACTOR.MANAGER || isApproved

  // Calibration state
  const [modalOpened, setModalOpened] = useState(false)
  const [deleteConfirmOpened, setDeleteConfirmOpened] = useState(false)

  // Fetch calibration data
  // Allow users to fetch calibration when evaluation is approved to show final grade
  const {
    data: calibrationData,
    loading: loadingCalibration,
    refetch: refetchCalibration
  } = useQuery<{ calibration: Calibration }>(GET_CALIBRATION, {
    variables: { idPerformedEvaluation: performedEvaluation.id },
    skip:
      typeof performedEvaluation.grade !== 'number' ||
      periodMode !== EVALUATION_PERIOD.END ||
      (actor === EVALUATION_ACTOR.USER && !isApproved)
  })

  const grade = useMemo(() => {
    const performedGrade = performedEvaluation.grade || 0
    if (!calibration) {
      return performedGrade
    }

    return performedGrade + (calibration.calibrationValue || 0)
  }, [calibration, performedEvaluation.grade])

  // Delete calibration mutation
  const [deleteCalibration, { loading: deleting }] = useMutation(DELETE_CALIBRATION, {
    onCompleted: () => {
      refetchCalibration()
      refetchGrade()
      setCalibration(null)
      setFinalGradeModified(false)
    },
    onError: (error) => {
      showNotification({
        title: CALIBRATION_TRANSLATIONS.error.title[locale],
        message: error.message,
        color: 'red'
      })
    }
  })

  const handleDeleteCalibration = () => {
    deleteCalibration({ variables: { idPerformedEvaluation: performedEvaluation.id } })
    showNotification({
      color: 'green',
      message: (
        <Group>
          <IconChecks size={22} color={theme.colors.green[9]} />
          <Typography py={0.5} color={theme.colors.green[9]} fontSize={'sm'}>
            {CALIBRATION_TRANSLATIONS.success.deletedMessage[locale]}
          </Typography>
        </Group>
      ),
      radius: 'md',
      autoClose: 1500,
      styles: {
        root: {
          backgroundColor: theme.colors.green[0],
          borderColor: theme.colors.green[2],
          alignItems: 'flex-start',
          '&::before': { backgroundColor: theme.colors.green[9] }
        },
        closeButton: {
          color: theme.colors.green[7],
          '&:hover': { backgroundColor: theme.colors.green[2] }
        }
      }
    })
    setDeleteConfirmOpened(false)
  }

  const canEditCalibration =
    actor === EVALUATION_ACTOR.MANAGER &&
    periodMode === EVALUATION_PERIOD.END &&
    mode === EVALUATION_MODE.EDIT

  const getStatusColor = (status?: string) => {
    switch (status) {
      case EVALUATION_APPROVAL_STATUS.PENDING:
        return 'yellow'
      case EVALUATION_APPROVAL_STATUS.APPROVED:
        return 'green'
      case EVALUATION_APPROVAL_STATUS.REJECTED:
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case EVALUATION_APPROVAL_STATUS.PENDING:
        return EVALUATION_APPROVAL_STATUS.PENDING
      case EVALUATION_APPROVAL_STATUS.APPROVED:
        return EVALUATION_APPROVAL_STATUS.APPROVED
      case EVALUATION_APPROVAL_STATUS.REJECTED:
        return EVALUATION_APPROVAL_STATUS.REJECTED
      default:
        return EVALUATION_APPROVAL_STATUS.NOT_FINISHED
    }
  }

  const {
    loading,
    data,
    refetch: refetchGrade
  } = useQuery<GetPerformedEvaluationType>(GET_PERFORMED_EVALUATION_GRADE, {
    variables: {
      id: performedEvaluation.id
    }
  })

  const {
    data: dataConcepts,
    loading: loadingConcepts,
    error: errorConcepts,
    refetch: refetchConcepts
  } = useQuery<GetEvaluationResultConceptsType>(GET_EVALUATION_RESULT_CONCEPTS, {
    context: {
      headers: {
        locale
      }
    }
  })

  useEffect(() => {
    if (calibrationData && calibrationData.calibration) {
      setCalibration(calibrationData.calibration)
    }
  }, [calibrationData])

  useEffect(() => {
    if (calibration && calibration.originalGrade !== performedEvaluation.grade) {
      setFinalGradeModified(true)
    }
  }, [calibration, performedEvaluation.grade])

  useEffect(() => {
    if (canEditCalibration && finalGradeModified) {
      const timeout = setTimeout(() => {
        deleteCalibration({ variables: { idPerformedEvaluation: performedEvaluation.id } })
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [canEditCalibration, finalGradeModified])

  useEffect(() => {
    refetchApproval()
  }, [calibration, performedEvaluation.endFinished, performedEvaluation.midFinished])

  useEffect(() => {
    refetchGrade()
    refetchCalibration()
  }, [])

  useEffect(() => {
    if (data) {
      setPerformedEvaluation((pe) => ({
        ...pe,
        grade: data.performedEvaluation.grade || 0.0
      }))
    }
  }, [data])

  useEffect(() => {
    if (typeof performedEvaluation.grade === 'number') {
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
  }, [dataConcepts, loadingConcepts, errorConcepts, performedEvaluation.grade])

  useEffect(() => {
    refetchConcepts()
  }, [locale])

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

  if (loading || loadingConcepts || loadingCalibration) {
    return (
      <Stack align="center" m={25} mt={50} spacing="md">
        <Card withBorder sx={{ width: !match ? '90%' : '100%', height: 400 }}>
          <>
            <Card.Section p={25} pt={5}>
              <Group position="apart" align="center">
                <Text size={'xl'} weight={500}>
                  {CommonConstants.result.title[locale]}
                </Text>
              </Group>
            </Card.Section>
            <Divider mx={-20} />
          </>
          <Card.Section p={25}>
            <Grid justify="center" sx={{ width: '100%', marginTop: 20 }}>
              {[0, 1, 2].map((index) => (
                <React.Fragment key={index}>
                  <Grid.Col span={3}>
                    <Skeleton height={!match ? 40 : 20} radius={!match ? 'lg' : 'md'} />
                    <Skeleton
                      width={'100%'}
                      mt={30}
                      height={!match ? 150 : 100}
                      radius={!match ? 'lg' : 'md'}
                    />
                  </Grid.Col>
                  {index < 2 && (
                    <Grid.Col
                      span={1}
                      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Divider orientation={'vertical'} />
                    </Grid.Col>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </Card.Section>
        </Card>
      </Stack>
    )
  }

  return (
    <Stack align="center" m={25} mt={50} spacing="md">
      <Card withBorder sx={{ width: !match ? '90%' : '100%' }}>
        {(performedEvaluation.endFinished ||
          (actor === EVALUATION_ACTOR.MANAGER &&
            periodMode === EVALUATION_PERIOD.END &&
            appraiseeConcept)) && (
          <>
            <Card.Section p={25} pt={5}>
              <Group position="apart" align="center">
                <Text size={'xl'} weight={500}>
                  {CommonConstants.result.title[locale]}
                </Text>
                {!calibration &&
                  periodMode === EVALUATION_PERIOD.END &&
                  actor === EVALUATION_ACTOR.MANAGER &&
                  appraiseeConcept &&
                  canEditCalibration && (
                    <Button
                      size="sm"
                      variant="light"
                      leftIcon={<IconScale size={18} />}
                      onClick={() => setModalOpened(true)}
                    >
                      {CALIBRATION_TRANSLATIONS.calibrate[locale]}
                    </Button>
                  )}
              </Group>
            </Card.Section>
            <Divider mx={-20} />
          </>
        )}
        <Card.Section p={25}>
          {periodMode === EVALUATION_PERIOD.MID ? (
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
          ) : !shouldShowGrade && actor === EVALUATION_ACTOR.USER ? (
            <Grid justify={'center'}>
              <Grid.Col span={12}>
                <Group spacing={15} px={50} py={30} direction={'column'} align={'center'}>
                  <IconClock size={50} color={theme.colors.blue[6]} />
                  <Text align={'center'} size={'xl'} weight={500} color={theme.colors.blue[7]}>
                    {locale === 'br'
                      ? 'Avaliação Pendente de Aprovação'
                      : 'Evaluation Pending Approval'}
                  </Text>
                  <Text
                    align={'center'}
                    size={'md'}
                    color={theme.colors.gray[6]}
                    sx={{ maxWidth: 400 }}
                  >
                    {locale === 'br'
                      ? 'Sua avaliação está aguardando aprovação do departamento de Recursos Humanos. Você será notificado quando estiver disponível.'
                      : 'Your evaluation is awaiting approval from the Human Resources department. You will be notified when it becomes available.'}
                  </Text>
                </Group>
              </Grid.Col>
            </Grid>
          ) : (
            <Grid justify={'center'}>
              {!appraiseeConcept ? (
                <Grid.Col span={12}>
                  <Group spacing={15} px={50} py={30} direction={'column'} align={'center'}>
                    <IconAlertTriangle size={50} color={theme.colors.orange[6]} />
                    <Text align={'center'} size={'xl'} weight={500} color={theme.colors.orange[7]}>
                      {CommonConstants.result.incomplete.title[locale]}
                    </Text>
                    <Text
                      align={'center'}
                      size={'md'}
                      color={theme.colors.gray[6]}
                      sx={{ maxWidth: 400 }}
                    >
                      {CommonConstants.result.incomplete.message[locale]}
                    </Text>
                  </Group>
                </Grid.Col>
              ) : (
                <>
                  {/* Concept Column */}
                  <Grid.Col
                    span={
                      periodMode === EVALUATION_PERIOD.END && actor === EVALUATION_ACTOR.MANAGER
                        ? 4
                        : 5
                    }
                  >
                    <Group
                      spacing={5}
                      direction={'column'}
                      align={'center'}
                      sx={{ height: '100%', justifyContent: 'flex-start' }}
                    >
                      {loading ||
                      loadingConcepts ||
                      typeof performedEvaluation.grade === 'undefined' ? (
                        <>
                          <Skeleton height={!match ? 100 : 60} radius={!match ? 'lg' : 'md'} />
                          <Skeleton
                            mt={10}
                            height={!match ? 40 : 20}
                            radius={!match ? 'lg' : 'md'}
                          />
                        </>
                      ) : (
                        <>
                          <Badge size={'lg'} color={'cyan'} p={12}>
                            {CommonConstants.result.concept[locale]}
                          </Badge>
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

                  {/* Divider */}
                  <Grid.Col span={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Divider orientation={'vertical'} />
                  </Grid.Col>

                  {/* Grade Column */}
                  <Grid.Col span={actor === EVALUATION_ACTOR.MANAGER ? 3 : 4}>
                    <Group
                      spacing={5}
                      direction={'column'}
                      align={'center'}
                      sx={{ height: '100%', justifyContent: 'flex-start' }}
                    >
                      {loading ||
                      loadingConcepts ||
                      !appraiseeConcept ||
                      typeof performedEvaluation.grade === 'undefined' ? (
                        <>
                          <Skeleton height={!match ? 100 : 60} radius={!match ? 'lg' : 'md'} />
                          <Skeleton
                            mt={10}
                            height={!match ? 40 : 20}
                            radius={!match ? 'lg' : 'md'}
                          />
                        </>
                      ) : (
                        <>
                          <Badge size={'lg'} color={'cyan'} p={12}>
                            {CommonConstants.result.grade[locale]}
                          </Badge>
                          <Text weight={900} sx={{ fontSize: !match ? 80 : 40 }}>
                            {calibration
                              ? calibration.finalGrade.toFixed(2)
                              : performedEvaluation.grade?.toFixed(2)}
                          </Text>
                          <Rating
                            readOnly
                            precision={0.1}
                            value={grade}
                            max={ratings.length}
                            size={!match ? 'large' : 'medium'}
                          />

                          {finalGradeModified && (
                            <Box
                              mt={15}
                              px={2.5}
                              py={5}
                              sx={(theme) => ({
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                border: `1px solid ${
                                  theme.colorScheme === 'dark'
                                    ? theme.colors.blue[4]
                                    : theme.colors.blue[3]
                                }`,
                                borderRadius: theme.radius.md,
                                backgroundColor:
                                  theme.colorScheme === 'dark'
                                    ? theme.colors.blue[1]
                                    : theme.colors.blue[0],
                                width: '100%'
                              })}
                            >
                              <Loader size={'xs'} color={'blue'} />
                              <Typography
                                fontSize={13}
                                fontStyle={'italic'}
                                color={theme.colors.blue[7]}
                              >
                                {CALIBRATION_TRANSLATIONS.finalGradeModified[locale]}
                              </Typography>
                            </Box>
                          )}

                          {/* Calibration box below grade */}
                          {!finalGradeModified &&
                            calibration &&
                            periodMode === EVALUATION_PERIOD.END &&
                            actor === EVALUATION_ACTOR.MANAGER && (
                              <Stack
                                spacing={16}
                                mt={15}
                                p={12}
                                sx={(theme) => ({
                                  border: `1px solid ${
                                    theme.colorScheme === 'dark'
                                      ? theme.colors.dark[4]
                                      : theme.colors.gray[3]
                                  }`,
                                  borderRadius: theme.radius.md,
                                  backgroundColor:
                                    theme.colorScheme === 'dark'
                                      ? theme.colors.dark[6]
                                      : theme.colors.gray[0],
                                  width: '100%',
                                  maxWidth: 240,
                                  height: 100
                                })}
                              >
                                <Group sx={{ width: '100%', justifyContent: 'space-between' }}>
                                  <Badge size="sm" color="blue" sx={{ alignSelf: 'center' }}>
                                    <Group spacing={4}>
                                      <IconScale size={12} />
                                      <span>{CALIBRATION_TRANSLATIONS.title[locale]}</span>
                                    </Group>
                                  </Badge>
                                  {canEditCalibration && !finalGradeModified && (
                                    <Group spacing={4} position="center">
                                      <Tooltip
                                        label={CALIBRATION_TRANSLATIONS.editCalibration[locale]}
                                      >
                                        <ActionIcon
                                          size="sm"
                                          color="blue"
                                          variant="light"
                                          onClick={() => setModalOpened(true)}
                                        >
                                          <IconEdit size={16} />
                                        </ActionIcon>
                                      </Tooltip>
                                      <Tooltip
                                        label={CALIBRATION_TRANSLATIONS.removeCalibration[locale]}
                                      >
                                        <ActionIcon
                                          size="sm"
                                          color="red"
                                          variant="light"
                                          onClick={() => setDeleteConfirmOpened(true)}
                                          loading={deleting}
                                        >
                                          <IconTrash size={16} />
                                        </ActionIcon>
                                      </Tooltip>
                                    </Group>
                                  )}
                                </Group>

                                {/* <Badge size='md' color="green" variant='light' sx={{ width: 'fit-content', alignSelf: 'center' }}> */}
                                <Group spacing={6} position="center" align="center">
                                  <Typography fontSize={18} fontWeight={600}>
                                    {calibration.originalGrade.toFixed(2)}
                                  </Typography>
                                  <Typography
                                    fontSize={18}
                                    fontWeight={700}
                                    color={calibration.calibrationValue >= 0 ? 'green' : 'red'}
                                  >
                                    {calibration.calibrationValue >= 0 ? '+' : ''}
                                    {calibration.calibrationValue.toFixed(2)}
                                  </Typography>
                                </Group>
                                {/* </Badge> */}
                              </Stack>
                            )}
                        </>
                      )}
                    </Group>
                  </Grid.Col>

                  {/* show approval status and comment (if exists) */}
                  {actor === EVALUATION_ACTOR.MANAGER && (
                    <>
                      <Grid.Col
                        span={1}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <Divider orientation={'vertical'} sx={{ margin: 0 }} />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Group
                          spacing={1}
                          direction={'column'}
                          align={'center'}
                          sx={{
                            height: '100%',
                            justifyContent: 'flex-start'
                          }}
                        >
                          <Badge size={'lg'} color={'cyan'} p={12}>
                            {CommonConstants.result.approval[locale]}
                          </Badge>
                          <Group
                            mt={30}
                            spacing={'xs'}
                            p={10}
                            align="center"
                            sx={{
                              justifyContent: 'flex-start',
                              borderRadius: theme.radius.md,
                              border: `1px solid ${
                                theme.colorScheme === 'dark'
                                  ? theme.colors.dark[4]
                                  : theme.colors.gray[3]
                              }`,
                              backgroundColor:
                                theme.colorScheme === 'dark'
                                  ? theme.colors.dark[6]
                                  : theme.colors.gray[0]
                            }}
                          >
                            <Text size="sm" weight={600}>
                              {EVALUATION_APPROVAL_TRANSLATIONS.statusLabel[locale]}:
                            </Text>
                            <Badge
                              size="lg"
                              color={getStatusColor(approval?.status)}
                              variant="light"
                            >
                              {
                                EVALUATION_APPROVAL_STATUS_LABEL[getStatusLabel(approval?.status)][
                                  locale
                                ]
                              }
                            </Badge>
                            {approval?.comment && (
                              <Box sx={{ width: '100%' }}>
                                <Text size="sm" weight={600}>
                                  {EVALUATION_APPROVAL_TRANSLATIONS.comment[locale]}:
                                </Text>
                                <Text
                                  mt={5}
                                  py={5}
                                  px={15}
                                  sx={{
                                    width: '100%',
                                    borderRadius: theme.radius.md,
                                    border: `1px solid ${theme.colors.gray[3]}`,
                                    backgroundColor: theme.white
                                  }}
                                >
                                  {approval.comment}
                                </Text>
                              </Box>
                            )}
                          </Group>
                        </Group>
                      </Grid.Col>
                    </>
                  )}
                </>
              )}
            </Grid>
          )}
        </Card.Section>
      </Card>
      {/* Calibration Modal */}
      {modalOpened && (
        <CalibrationModal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          idPerformedEvaluation={performedEvaluation.id}
          originalGrade={performedEvaluation.grade!}
          calibration={calibration}
          onSuccess={() => {
            refetchCalibration()
            refetchGrade()
          }}
        />
      )}
      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteConfirmOpened}
        onClose={() => setDeleteConfirmOpened(false)}
        title={<Text weight={700}>{CALIBRATION_TRANSLATIONS.removeCalibration[locale]}</Text>}
        centered
      >
        <Stack spacing="lg">
          <Text size="sm">{CALIBRATION_TRANSLATIONS.confirmDelete[locale]}</Text>
          <Group position="right" spacing="sm">
            <Button variant="default" onClick={() => setDeleteConfirmOpened(false)}>
              {CALIBRATION_TRANSLATIONS.cancel[locale]}
            </Button>
            <Button color="red" onClick={handleDeleteCalibration} loading={deleting}>
              {CALIBRATION_TRANSLATIONS.removeCalibration[locale]}
            </Button>
          </Group>
        </Stack>
      </Modal>{' '}
    </Stack>
  )
}

export default EvaluationResult
