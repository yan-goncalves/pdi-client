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
import {
  EVALUATION_MODEL_PERIOD,
  STATUS_EVALUATION
} from 'constants/evaluation'
import { useLocale } from 'contexts/LocaleProvider'
import Countdown from 'react-countdown'

export type EvaluationCardItemProps = {
  year: string
  period: EVALUATION_MODEL_PERIOD
  finished: boolean
}

const EvaluationCardItem = ({ year, period }: EvaluationCardItemProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()

  const validPeriods = (periods: string[]) => {
    return periods.includes(period)
  }

  return (
    <Card withBorder key={year} shadow={'sm'} py={25} px={25}>
      <Card.Section p={15}>
        <Grid justify={'space-between'} align={'center'}>
          <Grid.Col span={2} lg={2}>
            <Badge
              size={'xl'}
              color={STATUS_EVALUATION[period].color}
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
            <Tooltip label={'status'} color={STATUS_EVALUATION[period].color}>
              <Badge
                size={'md'}
                variant={'dot'}
                color={STATUS_EVALUATION[period].color}
              >
                {STATUS_EVALUATION[period].name[locale]}
              </Badge>
            </Tooltip>
          </Grid.Col>

          {/* <Grid.Col span={6} lg={7}>
                  <Slider
                    disabled
                    labelAlwaysOn
                    radius={'sm'}
                    value={index + Math.random() * 95}
                    label={'04/04'}
                    marks={[
                      { value: 0, label: '10/01' },
                      { value: 100, label: '30/06' }
                    ]}
                    classNames={{
                      root: classes.root,
                      dragging: classes.dragging,
                      thumb: classes.thumb,
                      track: classes.track,
                      bar: classes.bar,
                      markLabel: classes.markLabel,
                      label: classes.label
                    }}
                    thumbChildren={
                      <IconStar
                        fill={theme.colors.blue[1]}
                        color={theme.colors.blue[9]}
                      />
                    }
                  />
                </Grid.Col> */}
        </Grid>
      </Card.Section>
      <Divider m={5} style={{ borderTopColor: theme.colors.gray[2] }} />
      <Card.Section p={20}>
        <Group mb={15} style={{ justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 500 }}>
            {STATUS_EVALUATION['midYear'].name[locale]}
          </Text>
          <Group>
            {validPeriods(['free', 'midYear']) && (
              <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                <ActionIcon variant={'light'} color={'cyan'}>
                  <IconEdit size={20} />
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
              <ActionIcon variant={'light'} color={'violet'}>
                <IconSearch size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
        <Group style={{ justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 500 }}>
            {STATUS_EVALUATION['endYear'].name[locale]}
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
                  <Tooltip color={'cyan'} label={CommonConstants.edit[locale]}>
                    <ActionIcon variant={'light'} color={'cyan'}>
                      <IconEdit size={20} />
                    </ActionIcon>
                  </Tooltip>
                )}
                <Tooltip color={'violet'} label={CommonConstants.view[locale]}>
                  <ActionIcon variant={'light'} color={'violet'}>
                    <IconSearch size={20} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        </Group>
      </Card.Section>
    </Card>
  )
}

export default EvaluationCardItem
