import { Grid, SimpleGrid } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import EvaluationCardItem, {
  EvaluationCardItemProps
} from 'components/EvaluationCardItem'

export type EvaluationListTemplateProps = {
  items: EvaluationCardItemProps[]
}

const EvaluationListTemplate = ({ items }: EvaluationListTemplateProps) => {
  return (
    <ContentBase>
      <Grid justify={'flex-start'}>
        {items.map((props) => (
          <Grid.Col xs={6} md={5} lg={4} xl={3} key={props.year}>
            <EvaluationCardItem {...props} />
          </Grid.Col>
        ))}
      </Grid>
    </ContentBase>
  )
}

export default EvaluationListTemplate
