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
import { CommonConstants } from 'constants/common'
import { EvaluationConstants, EvaluationPeriod } from 'constants/evaluation'
import { useLocale } from 'contexts/LocaleProvider'
import Countdown from 'react-countdown'
import LoadingOverlay from 'components/LoadingOverlay'
import { EvaluationModeType, useEvaluation } from 'contexts/EvaluationProvider'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'app/hooks'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'

export type EvaluationCardItemProps = {
  year: string
  period: EvaluationPeriod
  finished: boolean
}

const EvaluationCardItem = ({ year, period }: EvaluationCardItemProps) => {
  const theme = useMantineTheme()
  const { push, asPath } = useRouter()
  const { locale } = useLocale()
  const { setMode, setPeriodMode } = useEvaluation()
  const dispatch = useAppDispatch()

  const validPeriods = (periods: string[]) => {
    return periods.includes(period)
  }

  const handleClick = async (
    periodMode: EvaluationPeriod,
    action: EvaluationModeType
  ) => {
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
    <Card
      withBorder
      key={year}
      shadow={'sm'}
      py={25}
      px={25}
      sx={{ height: '100%' }}
    >
      <Card.Section p={15}>
        <Grid justify={'space-between'} align={'center'}>
          <Grid.Col span={2} lg={2}>
            <Badge
              size={'xl'}
              color={EvaluationConstants.status[period].color}
              variant={period !== 'out' ? 'filled' : undefined}
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
            <Tooltip
              label={'status'}
              color={EvaluationConstants.status[period].color}
            >
              <Badge
                size={'md'}
                variant={'dot'}
                color={EvaluationConstants.status[period].color}
              >
                {EvaluationConstants.status[period].name[locale]}
              </Badge>
            </Tooltip>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Divider m={5} style={{ borderTopColor: theme.colors.gray[2] }} />
      <Card.Section p={20}>
        {validPeriods(['out']) ? (
          <Group mb={15} style={{ justifyContent: 'space-between' }}>
            <Text color={'gray'} style={{ fontWeight: 500 }}>
              {EvaluationConstants.description.finished[locale]}
            </Text>
            <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
              <ActionIcon
                variant={'light'}
                color={'violet'}
                onClick={() => handleClick(EvaluationPeriod.out, 'view')}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ) : (
          <>
            <Group mb={15} style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500 }}>
                {EvaluationConstants.status['midYear'].name[locale]}
              </Text>
              <Group>
                {validPeriods(['free', 'midYear']) && (
                  <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                    <ActionIcon
                      variant={'light'}
                      color={'cyan'}
                      onClick={() =>
                        handleClick(EvaluationPeriod.midYear, 'edit')
                      }
                    >
                      <IconEdit size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
                  <ActionIcon
                    variant={'light'}
                    color={'violet'}
                    onClick={() =>
                      handleClick(EvaluationPeriod.midYear, 'view')
                    }
                  >
                    <IconSearch size={20} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>
            <Group style={{ justifyContent: 'space-between' }}>
              <Text style={{ fontWeight: 500 }}>
                {EvaluationConstants.status['endYear'].name[locale]}
              </Text>
              <Group>
                {validPeriods(['midYear']) ? (
                  <Tooltip color={'gray'} label={CommonConstants.soon[locale]}>
                    <Badge color={'gray'}>
                      <Countdown date={Date.now() + Math.random() * 99999999} />
                    </Badge>
                  </Tooltip>
                ) : (
                  <>
                    {validPeriods(['free', 'endYear']) && (
                      <Tooltip
                        color={'cyan'}
                        label={CommonConstants.edit[locale]}
                      >
                        <ActionIcon
                          variant={'light'}
                          color={'cyan'}
                          onClick={() =>
                            handleClick(EvaluationPeriod.endYear, 'edit')
                          }
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                      </Tooltip>
                    )}
                    <Tooltip
                      color={'violet'}
                      label={CommonConstants.view[locale]}
                    >
                      <ActionIcon
                        variant={'light'}
                        color={'violet'}
                        onClick={() =>
                          handleClick(EvaluationPeriod.endYear, 'view')
                        }
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
