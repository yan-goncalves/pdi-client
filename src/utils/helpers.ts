import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { ROLES } from 'constants/role'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { TeamMembersTemplateProps } from 'templates/Team'
import { DepartmentType } from 'types/collection/Department'
import { GetTeamMembersType } from 'types/collection/Team'
import { UserType } from 'types/collection/User'
import { BaseType } from 'types/common'

export const getMembersRecursively = async (
  member: UserType,
  apolloClient: ApolloClient<NormalizedCacheObject | null>,
  team: UserType[]
) => {
  if (member.role !== ROLES.USER) {
    const { data } = await apolloClient.query<GetTeamMembersType>({
      query: GET_TEAM_MEMBERS,
      variables: {
        id: member.id
      }
    })

    const ordered = await Promise.all(
      data.team.map(
        async (dataMember) => await getMembersRecursively(dataMember, apolloClient, team)
      )
    )
    team.push(...ordered)
  }

  return member
}

export const orderMembersByDepartments = (team: UserType[], departments: DepartmentType[]) => {
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
    .filter((member) => ![ROLES.ADMIN, ROLES.DIRECTOR].includes(member.role))
    .map((member) => {
      const key = member.department.key

      if (typeof ordered[key] === 'undefined') {
        ordered[key] = {
          name: departments.find((department) => department.key === key)!.name,
          members: []
        }
      }
      ordered[key].members.push(member)
      ordered[key] = {
        ...ordered[key],
        members: ordered[key].members.sort((userA, userB) => {
          return userA.username > userB.username ? 1 : userA.username < userB.username ? -1 : 0
        })
      }
    })

  return ordered
}

export const sortById = (baseA: BaseType, baseB: BaseType, order: 'ASC' | 'DESC' = 'ASC') => {
  const a_id = Number(baseA.id)
  const b_id = Number(baseB.id)

  const greater = order === 'ASC' ? 1 : -1
  const less = order === 'ASC' ? -1 : 1

  return a_id > b_id ? greater : a_id < b_id ? less : 0
}
