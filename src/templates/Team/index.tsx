import { Grid, SimpleGrid } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import TeamMemberCardItem from 'components/TeamMemberCardItem'
import { TeamMember } from 'types/collection/Team'

export type TeamMembersTemplateProps = {
  items: TeamMember[]
}

const TeamMembersTemplate = ({ items }: TeamMembersTemplateProps) => {
  return (
    <ContentBase>
      <Grid justify={'flex-start'}>
        {items.map((props) => (
          <Grid.Col
            span={6}
            xs={5}
            sm={3}
            key={`${props.id}-${props.username}`}
          >
            <TeamMemberCardItem {...props} />
          </Grid.Col>
        ))}
      </Grid>
    </ContentBase>
  )
}

export default TeamMembersTemplate
