import { Badge, DefaultMantineColor, Grid, Skeleton, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useEvaluation } from 'contexts/EvaluationProvider'

export type EvaluationItemProps = {
  sectionTitle?: string
  sectionColor?: DefaultMantineColor
  title?: string
}

const EvaluationItem = ({ sectionTitle, sectionColor, title }: EvaluationItemProps) => {
  const theme = useMantineTheme()
  const { isLocaleLoading } = useEvaluation()
  const isMobile = useMediaQuery(`(max-width:  ${theme.breakpoints.sm}px)`)

  return (
    <Grid mt={15} mb={15} gutter={'xl'}>
      {sectionTitle && (
        <Grid.Col>
          <Skeleton
            visible={isLocaleLoading}
            height={26}
            radius={'md'}
            width={!isLocaleLoading ? 'auto' : 200}
          >
            <Badge
              size={'lg'}
              color={sectionColor}
              p={12}
              sx={{
                backgroundColor: !isLocaleLoading ? undefined : theme.colors.gray[2],
                color: !isLocaleLoading ? sectionColor : theme.colors.gray[4]
              }}
            >
              {sectionTitle}
            </Badge>
          </Skeleton>
        </Grid.Col>
      )}
      <Grid.Col>
        {isLocaleLoading ? (
          <Skeleton
            visible={isLocaleLoading}
            height={50}
            radius={'md'}
            width={!isMobile ? '70%' : 'auto'}
          />
        ) : (
          <Title
            p={10}
            order={4}
            sx={{
              color: !isLocaleLoading ? theme.black : theme.colors.gray[4]
            }}
          >
            {title}
          </Title>
        )}
      </Grid.Col>
    </Grid>
  )
}

export default EvaluationItem
