import { EVALUATION_ACTOR, useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS, GET_GOALS } from 'graphql/queries/collection/Goals'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import GoalTemplate from 'templates/Goal'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType, GetGoalsType, GoalType } from 'types/collection/Goal'
import { GetUserType, UserType } from 'types/collection/User'

export interface GoalPageProps {
  evaluation: EvaluationModelType
  user: UserType
  goals: GoalType[]
}

const GoalPage = ({ user, evaluation, goals }: GoalPageProps) => {
  const { setEvaluationModel, setAppraisee } = useEvaluation()

  useEffect(() => {
    if (user) {
      setAppraisee(user)
    }
  }, [user])

  useEffect(() => {
    if (evaluation) {
      setEvaluationModel(evaluation)
    }
  }, [evaluation])

  return <GoalTemplate actor={EVALUATION_ACTOR.MANAGER} goals={goals} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { user }
  } = await apolloClient.query<GetUserType>({
    query: GET_USER,
    variables: {
      input: {
        username: params?.username,
        loadRelations: true
      }
    }
  })

  const {
    data: { evaluation }
  } = await apolloClient.query<GetEvaluationModelType>({
    query: GET_EVALUATION_MODEL,
    variables: {
      year: Number(params?.year)
    }
  })

  const {
    data: { goals }
  } = await apolloClient.query<GetGoalsType>({ query: GET_GOALS })

  const {
    data: { evaluationGoals }
  } = await apolloClient.query<GetEvaluationGoalsType>({
    query: GET_EVALUATION_GOALS,
    variables: {
      idEvaluation: evaluation.id,
      idUser: user.id
    }
  })
  evaluation.goals = evaluationGoals

  return {
    props: {
      goals,
      evaluation,
      user
    }
  }
}

export default GoalPage
