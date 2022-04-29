import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { TeamMembersTemplateProps } from 'templates/Team'
import { DepartmentType } from 'types/collection/Department'
import { GetTeamMembers, TeamMember } from 'types/collection/Team'
import { AccessRoleType } from 'types/collection/User'

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

export const orderMembersByDepartments = (
  team: TeamMember[],
  departments: DepartmentType[]
) => {
  const ordered: TeamMembersTemplateProps = {}

  team
    .sort((memberA, memberB) => {
      const departmentA = memberA.department.name
      const departmentB = memberB.department.name
      if (departmentA > departmentB) {
        return 1
      } else if (departmentA < departmentB) {
        return -1
      }
      return 0
    })
    .map((member) => {
      const key = member.department.key

      if (typeof ordered[key] === 'undefined') {
        ordered[key] = {
          name: departments.find((department) => department.key === key)!.name,
          members: []
        }
      }
      ordered[key].members.push(member)
    })

  return ordered
}
