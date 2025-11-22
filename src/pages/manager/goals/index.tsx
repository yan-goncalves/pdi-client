import { initializeApollo } from 'graphql/client'
import { GetDepartments } from 'graphql/queries/collection/Department'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import TeamMembersTemplate, { TeamMembersTemplateProps } from 'templates/Team'
import { GetDepartmentsType } from 'types/collection/Department'
import { GetTeamMembersType } from 'types/collection/Team'
import { GetUserType } from 'types/collection/User'
import { getMembersRecursively, orderMembersByDepartments } from 'utils/helpers'

const PageTeamList = (props: TeamMembersTemplateProps) => {
  return <TeamMembersTemplate {...props} />
}

export const getServerSideProps: GetServerSideProps<TeamMembersTemplateProps> = async ({
  req,
  locale
}) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  let team

  if (session?.user.username === 'sabrinavelasques') {
    const { data: director } = await apolloClient.query<GetUserType>({
      query: GET_USER,
      variables: {
        input: {
          username: 'marcomarelli'
        }
      }
    })
    const { data } = await apolloClient.query<GetTeamMembersType>({
      query: GET_TEAM_MEMBERS,
      variables: {
        id: director.user.id
      }
    })
    team = data.team
  } else {
    const { data } = await apolloClient.query<GetTeamMembersType>({
      query: GET_TEAM_MEMBERS
    })
    team = data.team
  }

  if (!team) {
    return {
      notFound: true
    }
  }

  const {
    data: { departments }
  } = await apolloClient.query<GetDepartmentsType>({
    query: GetDepartments,
    context: {
      headers: {
        locale
      }
    }
  })

  for (const member of team) {
    await getMembersRecursively(member, apolloClient, team)
  }

  const orderedTeams = orderMembersByDepartments(team, departments)

  return {
    props: orderedTeams
  }
}

export default PageTeamList
