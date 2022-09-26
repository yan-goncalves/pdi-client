import { Text, useMantineTheme } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'
import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'

export type DashboardProps = {
  actor: EVALUATION_ACTOR
}

const Dashboard = ({ actor }: DashboardProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <IconAlertTriangle size={36} color={theme.colors.gray[6]} />
      <Text size={'lg'} color={theme.colors.gray[6]}>
        {locale === 'br' ? 'Página em desenvolvimento' : 'Page under construction'}
      </Text>
    </div>
  )
}

export default Dashboard
