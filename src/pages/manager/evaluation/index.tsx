import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { initializeApollo } from 'graphql/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import TeamMembersTemplate, { TeamMembersTemplateProps } from 'templates/Team'
import { GetTeamMembers, TeamMember } from 'types/collection/Team'
import {
  getMembersRecursively,
  isManager,
  orderMembersByDepartments
} from 'utils/helpers'

const PageTeamList = (props: TeamMembersTemplateProps) => {
  return <TeamMembersTemplate {...props} />
}

export const getServerSideProps: GetServerSideProps<
  TeamMembersTemplateProps
> = async ({ req }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { team }
  } = await apolloClient.query<GetTeamMembers>({
    query: GET_TEAM_MEMBERS,
    variables: {
      idManager: session?.user.id
    }
  })

  if (!team) {
    return {
      notFound: true
    }
  }

  await Promise.all(
    team.map(async (member) => {
      await getMembersRecursively(member, apolloClient, team)
    })
  )

  return {
    props: orderMembersByDepartments(team)
  }
}

export default PageTeamList
