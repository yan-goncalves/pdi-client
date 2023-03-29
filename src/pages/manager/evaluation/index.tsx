import { initializeApollo } from 'graphql/client'
import { GetDepartments } from 'graphql/queries/collection/Department'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import TeamMembersTemplate, { TeamMembersTemplateProps } from 'templates/Team'
import { GetDepartmentsType } from 'types/collection/Department'
import { GetTeamMembersType } from 'types/collection/Team'
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

  const {
    data: { team }
  } = await apolloClient.query<GetTeamMembersType>({
    query: GET_TEAM_MEMBERS
  })

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
