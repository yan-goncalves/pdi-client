import { Badge, DefaultMantineColor, Grid, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import { FeedbackType } from 'types/collection/Feedback'
import { GoalType } from 'types/collection/Goal'
import { SkillType } from 'types/collection/Skill'

export type EvaluationItemProps = {
  children?: React.ReactNode
  sectionTitle?: string
  sectionColor?: DefaultMantineColor
  title?: string
  item: SkillType | GoalType | FeedbackType
  type: 'Question' | 'Skill' | 'Goal' | 'Feedback'
}

const EvaluationItem = ({
  sectionTitle,
  sectionColor,
  title,
  item,
  type
}: EvaluationItemProps) => {
  const DynamicComponent = dynamic<{ item: typeof item }>(
    () => import(`components/Performed/${type}`),
    { ssr: true }
  )

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
      <Grid.Col p={10}>
        <DynamicComponent item={item} />
      </Grid.Col>
    </Grid>
  )
}

export default EvaluationItem
