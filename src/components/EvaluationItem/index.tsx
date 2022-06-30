import { Badge, DefaultMantineColor, Grid, Group, Title, useMantineTheme } from '@mantine/core'
import { Loading } from '@nextui-org/react'
import { CommonConstants } from 'constants/common'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'

export type EvaluationItemProps = {
  sectionTitle?: string
  sectionColor?: DefaultMantineColor
  title?: string
}

const EvaluationItem = ({ sectionTitle, sectionColor, title }: EvaluationItemProps) => {
  const theme = useMantineTheme()
  const { isLocaleLoading } = useEvaluation()
  const { locale } = useLocale()

  return (
    <Grid mt={15} mb={15} gutter={'xl'}>
      {sectionTitle && (
        <Grid.Col>
          <Badge
            size={!isLocaleLoading ? 'lg' : 'md'}
            color={sectionColor}
            p={!isLocaleLoading ? undefined : 12}
            sx={{
              backgroundColor: !isLocaleLoading ? undefined : theme.colors.gray[2],
              color: !isLocaleLoading ? sectionColor : theme.colors.gray[4]
            }}
          >
            {!isLocaleLoading ? (
              sectionTitle
            ) : (
              <Group>
                <Loading size={'xs'} color={'currentColor'} /> {CommonConstants.loading[locale]}
              </Group>
            )}
          </Badge>
        </Grid.Col>
      )}
      {title && (
        <Grid.Col>
          <Title
            p={10}
            order={4}
            sx={{
              color: !isLocaleLoading ? theme.black : theme.colors.gray[4]
            }}
          >
            {!isLocaleLoading ? (
              title
            ) : (
              <Group>
                <Loading size={'xs'} color={'currentColor'} /> {CommonConstants.loading[locale]}
              </Group>
            )}
          </Title>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default EvaluationItem
