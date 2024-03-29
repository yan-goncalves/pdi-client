import { ROLES } from 'constants/role'
import { useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_USERS } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import ReportUserListTemplate, { ReportUserListProps } from 'templates/Report/ReportUserList'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType } from 'types/collection/Goal'
import { GetUsersType } from 'types/collection/User'

const ReportYear = ({
  users,
  year,
  usersGoals,
  evaluationModel
}: ReportUserListProps & { evaluationModel: EvaluationModelType }) => {
  const { setEvaluationModel } = useEvaluation()

  useEffect(() => {
    if (evaluationModel) {
      setEvaluationModel(evaluationModel)
    }
  }, [evaluationModel])

  return <ReportUserListTemplate users={users} year={year} usersGoals={usersGoals} />
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

  const { usersGoals }: Pick<ReportUserListProps, 'usersGoals'> = { usersGoals: {} }
  for (const user of team) {
    const {
      data: { evaluationGoals }
    } = await apolloClient.query<GetEvaluationGoalsType>({
      query: GET_EVALUATION_GOALS,
      variables: {
        idEvaluation: evaluation.id,
        idUser: user.id
      }
    })

    if (!evaluationGoals) {
      return {
        notFound: true
      }
    }

    if (!Array.isArray(usersGoals[user.id])) usersGoals[user.id] = []

    usersGoals[user.id].push(...evaluationGoals)
  }

  return {
    props: {
      users: team.filter((user) => !user.username.includes('pdi')),
      year: params?.year,
      evaluationModel: evaluation,
      usersGoals
    }
  }
}

export default ReportYear
