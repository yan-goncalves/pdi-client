import { SimpleGrid } from '@mantine/core'
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
      <SimpleGrid
        pt={20}
        spacing={30}
        breakpoints={[
          {
            cols: 1,
            maxWidth: 'xs'
          },
          {
            cols: 2,
            minWidth: 'sm',
            maxWidth: 'lg'
          },
          {
            cols: 3,
            minWidth: 'lg'
          },
          {
            cols: 4,
            minWidth: 'xl'
          }
        ]}
      >
        {items.map((props) => (
          <EvaluationCardItem key={props.year} {...props} />
        ))}
      </SimpleGrid>
    </ContentBase>
  )
}

export default EvaluationListTemplate
