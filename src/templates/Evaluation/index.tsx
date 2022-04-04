import { Card, SimpleGrid } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import ContentTitle from 'components/ContentHeader'

const EvaluationListTemplate = () => {
  return (
    <ContentBase>
      <ContentTitle title={'Minhas avaliações'} />
      <SimpleGrid
        pt={20}
        breakpoints={[
          {
            cols: 2,
            maxWidth: 'xs'
          },
          {
            cols: 3,
            minWidth: 'sm',
            maxWidth: 'lg'
          },
          {
            cols: 4,
            minWidth: 'lg'
          }
        ]}
      >
        {['2022', '2021', '2020'].map((year) => (
          <Card key={year} radius={'md'} shadow={'sm'} p={20}>
            <Card.Section p={20}>{year}</Card.Section>
          </Card>
        ))}
      </SimpleGrid>
    </ContentBase>
  )
}

export default EvaluationListTemplate
