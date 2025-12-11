import { useMutation, useQuery } from '@apollo/client'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Stack,
  Text,
  Tooltip
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { IconEdit, IconScale, IconTrash } from '@tabler/icons'
import { CalibrationModal } from 'components/CalibrationModal'
import { CALIBRATION_TRANSLATIONS } from 'constants/calibration'
import { EVALUATION_PERIOD } from 'constants/evaluation'
import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { DELETE_CALIBRATION } from 'graphql/mutations/calibration'
import { GET_CALIBRATION } from 'graphql/queries/calibration'
import { useState } from 'react'
import { Calibration } from 'types/calibration'

type CalibrationSectionProps = {
  idPerformedEvaluation: number
  originalGrade: number
  actor: EVALUATION_ACTOR
}

export function CalibrationSection({
  idPerformedEvaluation,
  originalGrade,
  actor
}: CalibrationSectionProps) {
  const { locale } = useLocale()
  const notifications = useNotifications()
  const { periodMode } = useEvaluation()
  const [modalOpened, setModalOpened] = useState(false)

  const { data, loading, refetch } = useQuery<{ calibration: Calibration | null }>(GET_CALIBRATION, {
    variables: { idPerformedEvaluation },
    skip: !idPerformedEvaluation
  })

  const [deleteCalibration, { loading: deleting }] = useMutation(DELETE_CALIBRATION)

  const calibration = data?.calibration

  // Only show calibration section for managers in END, OUT, or FREE periods
  const canViewCalibration =
    actor === EVALUATION_ACTOR.MANAGER &&
    (periodMode === EVALUATION_PERIOD.END ||
      periodMode === EVALUATION_PERIOD.OUT ||
      periodMode === EVALUATION_PERIOD.FREE)

  // Can edit only in END period
  const canEditCalibration = periodMode === EVALUATION_PERIOD.END

  if (!canViewCalibration) {
    return null
  }

  const handleDelete = async () => {
    if (!confirm(CALIBRATION_TRANSLATIONS.removeCalibration[locale] + '?')) {
      return
    }

    try {
      await deleteCalibration({
        variables: { idPerformedEvaluation }
      })

      notifications.showNotification({
        title: 'Sucesso',
        message: CALIBRATION_TRANSLATIONS.calibrationDeleteSuccess[locale],
        color: 'green'
      })

      refetch()
    } catch (error: any) {
      notifications.showNotification({
        title: 'Erro',
        message: error?.message || CALIBRATION_TRANSLATIONS.calibrationDeleteError[locale],
        color: 'red'
      })
    }
  }

  return (
    <>
      <Card withBorder>
        <Card.Section p={15}>
          <Group position="apart">
            <Group spacing="xs">
              <IconScale size={20} />
              <Text size="md" weight={500}>
                {CALIBRATION_TRANSLATIONS.title[locale]}
              </Text>
            </Group>
            {calibration ? (
              <Badge size="sm" color="green">{CALIBRATION_TRANSLATIONS.calibrated[locale]}</Badge>
            ) : (
              <Badge size="sm" color="gray">{CALIBRATION_TRANSLATIONS.notCalibrated[locale]}</Badge>
            )}
          </Group>
        </Card.Section>

        <Divider />

        <Card.Section p={15}>
          {calibration ? (
            <Stack spacing="sm">
              <Group grow>
                <div>
                  <Text size="xs" color="dimmed">
                    {CALIBRATION_TRANSLATIONS.originalGrade[locale]}
                  </Text>
                  <Text size="lg" weight={600}>
                    {calibration.originalGrade.toFixed(2)}
                  </Text>
                </div>

                <div>
                  <Text size="xs" color="dimmed">
                    {CALIBRATION_TRANSLATIONS.calibrationValue[locale]}
                  </Text>
                  <Text
                    size="lg"
                    weight={600}
                    color={calibration.calibrationValue >= 0 ? 'green' : 'red'}
                  >
                    {calibration.calibrationValue >= 0 ? '+' : ''}
                    {calibration.calibrationValue.toFixed(2)}
                  </Text>
                </div>

                <div>
                  <Text size="xs" color="dimmed">
                    {CALIBRATION_TRANSLATIONS.finalGrade[locale]}
                  </Text>
                  <Text size="lg" weight={600} color="blue">
                    {calibration.finalGrade.toFixed(2)}
                  </Text>
                </div>
              </Group>

              <div>
                <Text size="xs" color="dimmed" mb={4}>
                  {CALIBRATION_TRANSLATIONS.comment[locale]}
                </Text>
                <Text size="sm">{calibration.comment}</Text>
              </div>

              <Group position="apart" align="center">
                <Text size="xs" color="dimmed">
                  {CALIBRATION_TRANSLATIONS.calibratedBy[locale]} {calibration.manager.info?.name}{' '}
                  {CALIBRATION_TRANSLATIONS.calibratedAt[locale]}{' '}
                  {new Date(calibration.createdAt).toLocaleDateString(locale)}
                </Text>

                {canEditCalibration && (
                  <Group spacing="xs">
                    <Tooltip label={CALIBRATION_TRANSLATIONS.editCalibration[locale]}>
                      <ActionIcon
                        size="sm"
                        color="blue"
                        variant="light"
                        onClick={() => setModalOpened(true)}
                        loading={loading}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={CALIBRATION_TRANSLATIONS.removeCalibration[locale]}>
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="light"
                        onClick={handleDelete}
                        loading={deleting}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                )}
              </Group>
            </Stack>
          ) : (
            <Stack spacing="sm">
              <Text size="sm" color="dimmed">
                {CALIBRATION_TRANSLATIONS.calibrationInfo[locale]}
              </Text>
              {canEditCalibration && (
                <Group position="left">
                  <Button
                    size="sm"
                    leftIcon={<IconScale size={16} />}
                    onClick={() => setModalOpened(true)}
                    loading={loading}
                  >
                    {CALIBRATION_TRANSLATIONS.calibrate[locale]}
                  </Button>
                </Group>
              )}
            </Stack>
          )}
        </Card.Section>
      </Card>

      <CalibrationModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        idPerformedEvaluation={idPerformedEvaluation}
        originalGrade={originalGrade}
        calibration={calibration}
        onSuccess={() => refetch()}
      />
    </>
  )
}

