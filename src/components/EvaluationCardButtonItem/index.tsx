import { Badge, Group, Title, Tooltip, useMantineTheme } from '@mantine/core'
import { Card } from '@nextui-org/react'
import { IconAlertTriangle } from '@tabler/icons'
import { useAppDispatch } from 'app/hooks'
import { EvaluationCardItemProps } from 'components/EvaluationCardItem'
import { EVALUATION_PERIOD, EvaluationConstants } from 'constants/evaluation'
import { GoalsConstants } from 'constants/goals'
import { useLocale } from 'contexts/LocaleProvider'
import { setLoadingOverlayVisibility } from 'features/LoadingOverlay/loading-overlay-slice'
import { useRouter } from 'next/router'
import { useCardStyles } from './styles'

export type EvaluationCardButtonItemProps = Pick<
  EvaluationCardItemProps,
  'year' | 'period' | 'totalWeight'
>

const EvaluationCardButtonItem = ({ year, period, totalWeight }: EvaluationCardButtonItemProps) => {
  const { push, asPath } = useRouter()
  const dispatch = useAppDispatch()
  const { locale } = useLocale()
  const theme = useMantineTheme()

  const handleClick = async () => {
    dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: true }))
    await push(`${asPath}/${year}`).then(() => {
      dispatch(setLoadingOverlayVisibility({ loadingOverlayVisible: false }))
    })
  }

  const isTotalWeightValid = typeof totalWeight === 'number'
  const totalWeightLess = isTotalWeightValid && totalWeight < 100
  const isCurrentYear = Number(year) === new Date().getFullYear()
  const isValidPeriod = [EVALUATION_PERIOD.MID, EVALUATION_PERIOD.END].includes(period)
  const badgeColor =
    isValidPeriod && totalWeightLess && isCurrentYear
      ? 'red'
      : EvaluationConstants.status['OUT'].color

  return (
    <div style={{ position: 'relative' }}>
      <Card
        isHoverable
        isPressable
        onClick={handleClick}
        className={useCardStyles()}
        style={{
          borderColor: totalWeightLess && isCurrentYear ? theme.colors.red[6] : theme.colors.gray[3]
        }}
      >
        <Card.Body>
          <Group direction={'column'} align={'center'} sx={{ gap: 1 }}>
            <Title
              py={isTotalWeightValid ? 0 : 5}
              order={1}
              sx={{ fontWeight: 900 }}
              align={'center'}
            >
              {year}
            </Title>
            {isTotalWeightValid && (
              <Badge size={'md'} color={badgeColor}>
                {GoalsConstants.totalWeight[locale]}: <strong>{totalWeight}</strong>/100
              </Badge>
            )}
          </Group>
        </Card.Body>
      </Card>

      {totalWeightLess && isCurrentYear && (
        <Tooltip
          label={GoalsConstants.totalWeightLess[locale]}
          color={'red'}
          sx={{
            position: 'absolute',
            top: '-8px',
            left: 'calc(100% - 16px)'
          }}
        >
          <IconAlertTriangle
            color={theme.colors.red[6]}
            style={{
              background: theme.white
            }}
          />
        </Tooltip>
      )}
    </div>
  )
}

export default EvaluationCardButtonItem
