import { Grid, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconSocial, TablerIconProps } from '@tabler/icons'
import Accordion from 'components/Accordion'
import ContentBase from 'components/ContentBase'
import LoadingOverlay from 'components/LoadingOverlay'
import TeamMemberCardItem from 'components/TeamMemberCardItem'
import { DepartmentIcon } from 'constants/department'
import { ROLES } from 'constants/role'
import { useSession } from 'next-auth/react'
import { ComponentType } from 'react'
import { UserType } from 'types/collection/User'

export type TeamMembersTemplateProps = {
  [key in string]: {
    name: string
    members: UserType[]
  }
}

const TeamMembersTemplate = (items: TeamMembersTemplateProps) => {
  const theme = useMantineTheme()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)
  const { data: session } = useSession()

  const getMembers = (departmentKey: string, isManager = false) => (
    <Grid key={departmentKey} gutter={!match ? 30 : 15} justify={'flex-start'} align={'stretch'}>
      {isManager && (
        <Grid.Col>
          <Group>
            <IconSocial />
            <Title order={4}>{items[departmentKey].name}</Title>
          </Group>
        </Grid.Col>
      )}
      {items[departmentKey].members.map((props) => (
        <Grid.Col span={6} sm={4} lg={3} xl={2} key={`${props.id}-${props.username}`}>
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

  if (!session) {
    return <LoadingOverlay />
  }

  return (
    <ContentBase>
      {[ROLES.ADMIN, ROLES.DIRECTOR].includes(session.user.role) ? (
        <Accordion>
          {Object.keys(items).map((departmentKey) => (
            <Accordion.Item
              m={10}
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
