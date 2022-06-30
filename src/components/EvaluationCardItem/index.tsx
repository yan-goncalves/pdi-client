import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Grid,
  Group,
  Text,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { IconEdit, IconSearch } from '@tabler/icons'
import { useAppDispatch } from 'app/hooks'
import LoadingOverlay from 'components/LoadingOverlay'
import { CommonConstants } from 'constants/common'
import { EvaluationConstants, EVALUATION_PERIOD } from 'constants/evaluation'
import { ROLES } from 'constants/role'
import { EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Countdown from 'react-countdown'

export type EvaluationCardItemProps = {
  year: string
  period: EVALUATION_PERIOD
  // midFinished: boolean
  // endFinished: boolean
}

const EvaluationCardItem = ({ year, period }: EvaluationCardItemProps) => {
  const theme = useMantineTheme()
  const { data: session } = useSession()
  const { push, asPath } = useRouter()
  const { locale } = useLocale()
  const { setMode, setPeriodMode } = useEvaluation()
  const dispatch = useAppDispatch()

  const validPeriods = (periods: string[], validAccessRole = true) => {
    return !validAccessRole
      ? periods.includes(period)
      : periods.includes(period) && session?.user.role !== ROLES.DIRECTOR
  }

  const handleClick = async (periodMode: EVALUATION_PERIOD, action: EVALUATION_MODE) => {
    setMode(action)
    setPeriodMode(periodMode)

    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))
    await push(`${asPath}/${year}`).then(() => {
      dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: false }))
    })
  }

  if (!year || !period || !locale) {
    return <LoadingOverlay />
  }

  return (
    <Card withBorder key={year} py={25} px={25} sx={{ height: '100%' }}>
      <Card.Section p={15}>
        <Grid justify={'space-between'} align={'center'}>
          <Grid.Col span={2} lg={2}>
            <Badge
              size={'xl'}
              color={EvaluationConstants.status[period].color}
              variant={period !== EVALUATION_PERIOD.OUT ? 'filled' : undefined}
            >
              <strong>{year}</strong>
            </Badge>
          </Grid.Col>

          <Grid.Col
            span={5}
            xs={8}
            sm={6}
            lg={7}
            style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Tooltip label={'status'} color={EvaluationConstants.status[period].color}>
              <Badge size={'md'} variant={'dot'} color={EvaluationConstants.status[period].color}>
                {EvaluationConstants.status[period].name[locale]}
              </Badge>
            </Tooltip>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Card.Section>
        <Divider mx={-10} style={{ borderTopColor: theme.colors.gray[3] }} />
      </Card.Section>
      <Card.Section p={20}>
        {validPeriods([EVALUATION_PERIOD.OUT], session?.user.role !== ROLES.DIRECTOR) ? (
          <Group mb={15} style={{ justifyContent: 'space-between' }}>
            <Text color={'gray'} style={{ fontWeight: 500 }}>
              {EvaluationConstants.description.finished[locale]}
            </Text>
            <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
              <ActionIcon
                variant={'light'}
                color={'violet'}
                onClick={() => handleClick(EVALUATION_PERIOD.OUT, EVALUATION_MODE.VIEW)}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <>
            <Group mb={15} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500 }}>
                {EvaluationConstants.status[EVALUATION_PERIOD.MID].name[locale]}
              </Text>
              <Group>
                {validPeriods([EVALUATION_PERIOD.FREE, EVALUATION_PERIOD.MID]) && (
                  <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                    <ActionIcon
                      variant={'light'}
                      color={'cyan'}
                      onClick={() => handleClick(EVALUATION_PERIOD.MID, EVALUATION_MODE.EDIT)}
                    >
                      <IconEdit size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
                  <ActionIcon
                    variant={'light'}
                    color={'violet'}
                    onClick={() => handleClick(EVALUATION_PERIOD.MID, EVALUATION_MODE.VIEW)}
                  >
                    <IconSearch size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
            <Group style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500 }}>
                {EvaluationConstants.status[EVALUATION_PERIOD.END].name[locale]}
              </Text>
              <Group>
                {validPeriods([EVALUATION_PERIOD.MID], false) ? (
                  <Tooltip color={'gray'} label={CommonConstants.soon[locale]}>
                    <Badge color={'gray'}>
                      <Countdown date={Date.now() + Math.random() * 99999999} />
                    </Badge>
                  </Tooltip>
                ) : (
                  <>
                    {validPeriods([EVALUATION_PERIOD.FREE, EVALUATION_PERIOD.END]) && (
                      <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                        <ActionIcon
                          variant={'light'}
                          color={'cyan'}
                          onClick={() => handleClick(EVALUATION_PERIOD.END, EVALUATION_MODE.EDIT)}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
                      <ActionIcon
                        variant={'light'}
                        color={'violet'}
                        onClick={() => handleClick(EVALUATION_PERIOD.END, EVALUATION_MODE.VIEW)}
                      >
                        <IconSearch size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </>
                )}
              </Group>
            </Group>
          </>
        )}
      </Card.Section>
    </Card>
  )
}

export default EvaluationCardItem
