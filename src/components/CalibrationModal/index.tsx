import { useMutation } from '@apollo/client'
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Textarea,
  useMantineTheme
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { Typography } from '@mui/material'
import { IconChecks, IconX } from '@tabler/icons'
import { CALIBRATION_TRANSLATIONS } from 'constants/calibration'
import { useLocale } from 'contexts/LocaleProvider'
import { CREATE_CALIBRATION, UPDATE_CALIBRATION } from 'graphql/mutations/calibration'
import { useEffect, useState } from 'react'
import { Calibration, CreateCalibrationInput, UpdateCalibrationInput } from 'types/calibration'

type CalibrationModalProps = {
  opened: boolean
  onClose: () => void
  idPerformedEvaluation: number
  originalGrade: number
  calibration?: Calibration | null
  onSuccess?: () => void
}

export function CalibrationModal({
  opened,
  onClose,
  idPerformedEvaluation,
  originalGrade,
  calibration,
  onSuccess
}: CalibrationModalProps) {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const notifications = useNotifications()
  const [calibrationValue, setCalibrationValue] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [finalGrade, setFinalGrade] = useState<number>(originalGrade)

  const [createCalibration, { loading: creating }] = useMutation(CREATE_CALIBRATION)
  const [updateCalibration, { loading: updating }] = useMutation(UPDATE_CALIBRATION)

  const loading = creating || updating

  // Calcula min e max baseado na nota original para garantir que a nota final fique entre 0.0 e 3.0
  const minCalibration = -originalGrade // Para nota final = 0.0
  const maxCalibration = Math.round((3.0 - originalGrade) * 100) / 100 // Para nota final = 3.0

  useEffect(() => {
    if (calibration) {
      setCalibrationValue(calibration.calibrationValue)
      setComment(calibration.comment)
      setFinalGrade(calibration.finalGrade)
    } else {
      setCalibrationValue(0)
      setComment('')
      setFinalGrade(originalGrade)
    }
  }, [calibration, originalGrade])

  useEffect(() => {
    const calculated = Math.max(0.0, Math.min(3.0, originalGrade + calibrationValue))
    setFinalGrade(calculated)
  }, [calibrationValue, originalGrade])

  const handleSave = async () => {
    if (calibrationValue < minCalibration || calibrationValue > maxCalibration) {
      notifications.showNotification({
        color: 'red',
        message: (
          <Group>
            <IconX size={16} color={theme.colors.red[9]} />
            <Typography py={0.5} color={theme.colors.red[9]} fontSize={15}>
              {CALIBRATION_TRANSLATIONS.validationCalibrationRange[locale]}
            </Typography>
          </Group>
        ),
        radius: 'md',
        autoClose: 850,
        styles: {
          root: {
            backgroundColor: theme.colors.red[0],
            borderColor: theme.colors.red[2],
            alignItems: 'flex-start',
            '&::before': { backgroundColor: theme.colors.red[9] }
          },
          closeButton: {
            color: theme.colors.red[7],
            '&:hover': { backgroundColor: theme.colors.red[2] }
          }
        }
      })
      return
    }

    if (finalGrade < 0.0 || finalGrade > 3.0) {
      notifications.showNotification({
        color: 'red',
        message: (
          <Group>
            <IconX size={16} color={theme.colors.red[9]} />
            <Typography py={0.5} color={theme.colors.red[9]} fontSize={15}>
              {CALIBRATION_TRANSLATIONS.validationFinalGradeRange[locale]}
            </Typography>
          </Group>
        ),
        radius: 'md',
        autoClose: 850,
        styles: {
          root: {
            backgroundColor: theme.colors.red[0],
            borderColor: theme.colors.red[2],
            alignItems: 'flex-start',
            '&::before': { backgroundColor: theme.colors.red[9] }
          },
          closeButton: {
            color: theme.colors.red[7],
            '&:hover': { backgroundColor: theme.colors.red[2] }
          }
        }
      })
      return
    }

    try {
      if (calibration) {
        // Update existing calibration
        const input: UpdateCalibrationInput = {
          idPerformedEvaluation,
          calibrationValue,
          comment
        }

        await updateCalibration({
          variables: { input }
        })
      } else {
        // Create new calibration
        const input: CreateCalibrationInput = {
          idPerformedEvaluation,
          calibrationValue,
          comment
        }

        await createCalibration({
          variables: { input }
        })
      }

      notifications.showNotification({
        color: 'green',
        message: (
          <Group>
            <IconChecks size={16} color={theme.colors.green[9]} />
            <Typography py={0.5} color={theme.colors.green[9]} fontSize={15}>
              {CALIBRATION_TRANSLATIONS.calibrationSuccess[locale]}
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

      onSuccess?.()
      onClose()
    } catch (error: any) {
      notifications.showNotification({
        color: 'red',
        message: (
          <Group>
            <IconX size={16} color={theme.colors.red[9]} />
            <Typography py={0.5} color={theme.colors.red[9]} fontSize={15}>
              {error?.message || CALIBRATION_TRANSLATIONS.calibrationError[locale]}
            </Typography>
          </Group>
        ),
        radius: 'md',
        autoClose: 850,
        styles: {
          root: {
            backgroundColor: theme.colors.red[0],
            borderColor: theme.colors.red[2],
            alignItems: 'flex-start',
            '&::before': { backgroundColor: theme.colors.red[9] }
          },
          closeButton: {
            color: theme.colors.red[7],
            '&:hover': { backgroundColor: theme.colors.red[2] }
          }
        }
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        calibration
          ? CALIBRATION_TRANSLATIONS.editCalibration[locale]
          : CALIBRATION_TRANSLATIONS.title[locale]
      }
      size="lg"
      centered
    >
      <Stack spacing="md">
        <Text size="sm" color="dimmed">
          {CALIBRATION_TRANSLATIONS.calibrationInfo[locale]}
        </Text>

        <Group grow align="flex-start">
          {/* Original Grade - Read-only box */}
          <Stack spacing={4}>
            <Text size="sm" weight={500}>
              {CALIBRATION_TRANSLATIONS.originalGrade[locale]}
            </Text>
            <Box
              sx={(theme) => ({
                padding: '8px 12px',
                border: `1px solid ${
                  theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
                }`,
                borderRadius: theme.radius.sm,
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                textAlign: 'center'
              })}
            >
              <Text size="md" weight={600}>
                {originalGrade.toFixed(2)}
              </Text>
            </Box>
          </Stack>

          {/* Calibration Value - Editable input */}
          <NumberInput
            label={CALIBRATION_TRANSLATIONS.calibrationValue[locale]}
            value={calibrationValue}
            onChange={(value) => setCalibrationValue(value || 0)}
            precision={2}
            min={minCalibration}
            max={maxCalibration}
            step={0.1}
            required
          />

          {/* Final Grade - Read-only box */}
          <Stack spacing={4}>
            <Text size="sm" weight={500}>
              {CALIBRATION_TRANSLATIONS.finalGrade[locale]}
            </Text>
            <Box
              sx={(theme) => ({
                padding: '8px 12px',
                border: `1px solid ${
                  theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4]
                }`,
                borderRadius: theme.radius.sm,
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
                textAlign: 'center'
              })}
            >
              <Text size="md" weight={600} color="blue">
                {finalGrade.toFixed(2)}
              </Text>
            </Box>
          </Stack>
        </Group>

        <Textarea
          label={CALIBRATION_TRANSLATIONS.comment[locale]}
          placeholder={CALIBRATION_TRANSLATIONS.commentPlaceholder[locale]}
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
          minRows={4}
          required
          error={
            comment.length > 0 && comment.length < 10
              ? CALIBRATION_TRANSLATIONS.validationMinComment[locale]
              : undefined
          }
        />

        <Group position="right" mt="md">
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            {CALIBRATION_TRANSLATIONS.cancel[locale]}
          </Button>
          <Button onClick={handleSave} disabled={loading || comment?.length < 10} loading={loading}>
            {CALIBRATION_TRANSLATIONS.save[locale]}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
