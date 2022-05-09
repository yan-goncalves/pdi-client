import { Badge, DefaultMantineColor, Grid, Title } from '@mantine/core'

export type EvaluationItemProps = {
  children?: React.ReactNode
  sectionTitle?: string
  sectionColor?: DefaultMantineColor
  title?: string
}

const EvaluationItem = ({ sectionTitle, sectionColor, title }: EvaluationItemProps) => {
  return (
    <Grid mt={15} mb={15} gutter={'xl'}>
      {sectionTitle && (
        <Grid.Col>
          <Badge size={'lg'} color={sectionColor}>
            {sectionTitle}
          </Badge>
        </Grid.Col>
      )}
      {title && (
        <Grid.Col>
          <Title p={10} order={4}>
            {title}
          </Title>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default EvaluationItem
