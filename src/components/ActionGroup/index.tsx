import { Button, Group, Loader, Sx, Title, useMantineTheme } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { IconChecks } from '@tabler/icons'
import { CommonConstants } from 'constants/common'
import { NotificationsConstants } from 'constants/notifications'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'

export type ActionGroupProps = {
  messages?: {
    saving: string
    saved: string
  }
  disabled: boolean
  handleSave: () => Promise<void>
  handleCancel: () => Promise<void> | void
  groupProps?: Sx
}

const ActionGroup = ({
  messages,
  disabled,
  handleSave,
  handleCancel,
  groupProps
}: ActionGroupProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const { isSaving, setIsSaving } = useEvaluation()
  const notifications = useNotifications()

  const handleAction = async () => {
    setIsSaving(true)
    notifications.showNotification({
      message: (
        <Title order={5} p={2}>
          <Group>
            <Loader size={'sm'} />
            {messages?.saving ?? NotificationsConstants.saving.answer[locale]}
          </Group>
        </Title>
      ),
      radius: 'md',
      autoClose: 850,
      styles: {
        root: {
          borderColor: theme.colors.blue[6],
          '&::before': { backgroundColor: theme.colors.blue[6] }
        }
      }
    })
    setTimeout(
      async () =>
        await handleSave().then(() => {
          // setSaving(false)
          setIsSaving(false)
          notifications.showNotification({
            message: (
              <Title order={5} p={2}>
                <Group>
                  <IconChecks size={22} color={theme.colors.green[9]} />
                  {messages?.saved ?? NotificationsConstants.saved.answer[locale]}
                </Group>
              </Title>
            ),
            color: 'green',
            radius: 'md',

            autoClose: 1500,
            styles: (theme) => ({
              root: {
                borderColor: theme.colors.green[6],
                '&::before': { backgroundColor: theme.colors.green[6] }
              }
            })
          })
        }),
      1000
    )
  }

  return (
    <Group sx={{ ...groupProps }}>
      <Button loading={isSaving} onClick={handleAction} disabled={disabled} sx={{ minWidth: 100 }}>
        {CommonConstants.save[`${isSaving}`][locale]}
      </Button>
      {!isSaving && (
        <Button color={'gray'} variant={'subtle'} onClick={handleCancel} sx={{ minWidth: 100 }}>
          {CommonConstants.cancel[locale]}
        </Button>
      )}
    </Group>
  )
}

export default ActionGroup
