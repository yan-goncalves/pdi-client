import { initializeApollo } from 'graphql/client'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import TeamMembersTemplate, { TeamMembersTemplateProps } from 'templates/Team'
import { GetTeamMembers } from 'types/collection/Team'

const PageTeamList = ({ items }: TeamMembersTemplateProps) => {
  return <TeamMembersTemplate items={items} />
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

  return {
    props: {
      items: [...team]
    }
  }
}

export default PageTeamList
