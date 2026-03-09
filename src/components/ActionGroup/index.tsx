import { Button, Group, Loader, Sx, Title, useMantineTheme } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { darken, lighten, Typography } from '@mui/material'
import { IconChecks } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { NotificationsConstants } from 'constants/notifications'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { useCallback } from 'react'

export type ActionGroupProps = {
  messages?: {
    saving: string
    saved: string
  }
  disabled: boolean
  handleSave: () => Promise<void>
  handleCancel: () => Promise<void> | void
  groupProps?: Sx
  showNotifications?: boolean
}

const ActionGroup = ({
  messages,
  disabled,
  handleSave,
  handleCancel,
  groupProps,
  showNotifications = true
}: ActionGroupProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { isSaving, setIsSaving } = useEvaluation()
  const notifications = useNotifications()

  const handleAction = async () => {
    setIsSaving(true)
    showNotificationOnSaving()
    await handleSave()
    showNotificationOnFinish()
    setIsSaving(false)
  }

  const showNotificationOnSaving = useCallback(() => {
    if (!showNotifications) {
      return
    }

    notifications.showNotification({
      color: 'blue',
      message: (
        <Group>
          <IconChecks size={16} color={theme.colors.blue[9]} />
          <Typography py={0.5} color={theme.colors.blue[9]} fontSize={15}>
            {NotificationsConstants.saving.answer[locale]}
          </Typography>
        </Group>
      ),
      radius: 'md',
      autoClose: 850,
      styles: {
        root: {
          backgroundColor: theme.colors.blue[0],
          borderColor: theme.colors.blue[2],
          alignItems: 'flex-start',
          '&::before': { backgroundColor: theme.colors.blue[9] }
        },
        closeButton: {
          color: theme.colors.blue[7],
          '&:hover': { backgroundColor: theme.colors.blue[2] }
        }
      }
    })
  }, [notifications, theme, locale, showNotifications])

  const showNotificationOnFinish = useCallback(() => {
    if (!showNotifications) {
      return
    }
    notifications.showNotification({
      color: 'green',
      message: (
        <Group>
          <IconChecks size={16} color={theme.colors.green[9]} />
          <Typography py={0.5} color={theme.colors.green[9]} fontSize={15}>
            {NotificationsConstants.saved.answer[locale]}
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
  }, [notifications, theme, locale, showNotifications])

  return (
    <Group sx={{ ...groupProps }}>
      <Button loading={isSaving} onClick={handleAction} disabled={disabled} sx={{ minWidth: 100 }}>
        {CommonConstants.save[`${isSaving}`][locale]}
      </Button>
      {!isSaving && (
        <Button color={'red'} variant={'subtle'} onClick={handleCancel} sx={{ minWidth: 100 }}>
          {CommonConstants.cancel[locale]}
        </Button>
      )}
    </Group>
  )
}

export default ActionGroup
