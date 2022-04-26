import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { TeamMembersTemplateProps } from 'templates/Team'
import { AccessRoleType } from 'types/auth'
import { GetTeamMembers, TeamMember } from 'types/collection/Team'

export const isManager = (access_role: AccessRoleType) => {
  return access_role !== 'User'
}

export const getMembersRecursively = async (
  member: TeamMember,
  apolloClient: ApolloClient<NormalizedCacheObject | null>,
  team: TeamMember[]
) => {
  if (isManager(member.info!.access_role)) {
    const { data } = await apolloClient.query<GetTeamMembers>({
      query: GET_TEAM_MEMBERS,
      variables: {
        idManager: member.id
      }
    })

    const ordered = await Promise.all(
      data.team.map(
        async (dataMember) =>
          await getMembersRecursively(dataMember, apolloClient, team)
      )
    )
    team.push(...ordered)
  }

  return member
}

export const orderMembersByDepartments = (team: TeamMember[]) => {
  const ordered: TeamMembersTemplateProps = {}

  team.map((member) => {
    const key = member.department.key
    const name = member.department.name
    if (typeof ordered[key] === 'undefined') {
      ordered[key] = {
        name,
        members: []
      }
    }
    ordered[key].members.push(member)
  })

  return ordered
}
