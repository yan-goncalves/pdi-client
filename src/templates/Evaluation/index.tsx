import { SimpleGrid, useMantineTheme } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import EvaluationCardItem, {
  EvaluationCardItemProps
} from 'components/EvaluationCardItem'
import { useStyles } from './styles'

export type EvaluationListTemplateProps = {
  items: EvaluationCardItemProps[]
}

const EvaluationListTemplate = ({ items }: EvaluationListTemplateProps) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()

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
