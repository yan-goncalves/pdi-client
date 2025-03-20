import { ROLES } from 'constants/role'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_USERS } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import ReportUserListTemplate, { ReportUserListProps } from 'templates/Report/ReportUserList'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetUsersType } from 'types/collection/User'

const ReportYear = ({
  users,
  year,
  evaluationModel
}: ReportUserListProps & { evaluationModel: EvaluationModelType }) => {
  const { setEvaluationModel } = useEvaluation()

  useEffect(() => {
    if (evaluationModel) {
      setEvaluationModel(evaluationModel)
    }
  }, [evaluationModel])

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
    data: { evaluation },
    error: evaluationError,
    errors: evaluationErrors
  } = await apolloClient.query<GetEvaluationModelType>({
    query: GET_EVALUATION_MODEL,
    variables: {
      year: Number(params?.year)
    },
    context: {
      headers: {
        locale
      }
    }
  })

  if (!evaluation || evaluationError || evaluationErrors) {
    return {
      notFound: true
    }
  }

  const team = users
    .filter((user) => {
      return ![ROLES.ADMIN, ROLES.DIRECTOR].includes(user.role)
    })
    .filter((user) => {
      return !!user?.department
    })
    .sort((userA, userB) => {
      return userA.username > userB.username ? 1 : userA.username < userB.username ? -1 : 0
    })

  return {
    props: {
      users: team.filter((user) => !user.username.includes('pdi')),
      year: params?.year,
      evaluationModel: evaluation
    }
  }
}

export default ReportYear
