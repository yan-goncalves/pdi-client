import { ROLES } from 'constants/role'
import { initializeApollo } from 'graphql/client'
import { GetDepartments } from 'graphql/queries/collection/Department'
import { GET_USERS } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import ReportUserListTemplate, { ReportUserListProps } from 'templates/Report/ReportUserList'
import { GetDepartmentsType } from 'types/collection/Department'
import { GetUsersType } from 'types/collection/User'
import { orderMembersByDepartments } from 'utils/helpers'

const ReportYear = ({ users, year }: ReportUserListProps) => {
  return <ReportUserListTemplate users={users} year={year} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale, params }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { users }
  } = await apolloClient.query<GetUsersType>({
    query: GET_USERS
  })

  if (!users) {
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

  const team = users
    .filter(
      (user) => user.id !== session?.user.id && ![ROLES.ADMIN, ROLES.DIRECTOR].includes(user.role)
    )
    .sort((userA, userB) => {
      return userA.username > userB.username ? 1 : userA.username < userB.username ? -1 : 0
    })
  // const orderedTeams =
  orderMembersByDepartments(team, departments)

  return {
    props: {
      users: team,
      year: params?.year
    }
  }
}

export default ReportYear
