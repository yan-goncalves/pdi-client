import {
  Accordion,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core'
import { IconSocial, TablerIconProps } from '@tabler/icons'
import ContentBase from 'components/ContentBase'
import TeamMemberCardItem from 'components/TeamMemberCardItem'
import { DepartmentIcon } from 'constants/department'
import { useSession } from 'next-auth/react'
import { ComponentType } from 'react'
import { TeamMember } from 'types/collection/Team'
import { useStyles } from './styles'

export type TeamMembersTemplateProps = {
  [key in string]: {
    name: string
    members: TeamMember[]
  }
}

const TeamMembersTemplate = (items: TeamMembersTemplateProps) => {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { data: session } = useSession()

  const getMembers = (departmentKey: string, isManager = false) => (
    <Grid key={departmentKey} gutter={20} justify={'flex-start'} align={'stretch'}>
      {isManager && (
        <Grid.Col>
          <Group>
            <IconSocial />
            <Title order={4}>{items[departmentKey].name}</Title>
          </Group>
        </Grid.Col>
      )}
      {items[departmentKey].members.map((props) => (
        <Grid.Col span={6} xs={5} sm={3} lg={2} key={`${props.id}-${props.username}`}>
          <TeamMemberCardItem {...props} />
        </Grid.Col>
      ))}
    </Grid>
  )

  const renderLabel = (Icon: ComponentType<TablerIconProps>, label: string) => {
    return (
      <Group>
        <Icon />
        <Text>{label}</Text>
      </Group>
    )
  }

  return (
    <ContentBase>
      {session?.user.info.access_role === 'Director' ? (
        <Accordion
          p={20}
          classNames={{
            item: classes.item,
            itemTitle: classes.itemTitle,
            itemOpened: classes.itemOpened,
            content: classes.content
          }}
        >
          {Object.keys(items).map((departmentKey) => (
            <Accordion.Item
              key={departmentKey}
              color={theme.colors.blue[3]}
              label={renderLabel(DepartmentIcon[departmentKey], items[departmentKey].name)}
            >
              {getMembers(departmentKey)}
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        Object.keys(items).map((departmentKey) => getMembers(departmentKey))
      )}
    </ContentBase>
  )
}

export default TeamMembersTemplate
