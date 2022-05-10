import { useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { CREATE_PERFORMED_EVALUATION } from 'graphql/mutations/collection/PerformedEvaluation'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/EvaluationGoal'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_PERFORMED_EVALUATION } from 'graphql/queries/collection/PerformedEvaluation'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import EvaluationTemplate from 'templates/Evaluation'
import { GetEvaluationGoalsType } from 'types/collection/EvaluationGoal'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import {
  CreatePerformedEvaluationType,
  GetPerformedEvaluationType,
  PerformedEvaluationType
} from 'types/collection/PerformedEvaluation'
import { GetUser, UserType } from 'types/collection/User'

const EvaluationPage = ({
  evaluationModel,
  performedEvaluation,
  user
}: {
  evaluationModel: EvaluationModelType
  performedEvaluation: PerformedEvaluationType
  user: UserType
}) => {
  const { setEvaluationModel, setPerformedEvaluation, setAppraisee, setMode, mode, periodMode } =
    useEvaluation()

  useEffect(() => {
    if (evaluationModel) {
      const checkMode = periodMode !== evaluationModel.period ? 'view' : mode
      setEvaluationModel(evaluationModel)
      setMode(checkMode)
    }
  }, [evaluationModel])

  useEffect(() => {
    if (performedEvaluation) {
      setPerformedEvaluation(performedEvaluation)
    }
  }, [performedEvaluation])

  useEffect(() => {
    if (user) {
      setAppraisee(user)
    }
  }, [user])

  return <EvaluationTemplate type={'manager'} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale, params }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { users }
  } = await apolloClient.query<GetUser>({
    query: GET_USER,
    variables: {
      username: params?.username
    }
  })

  if (!users.length) {
    return {
      notFound: true
    }
  }
  const user = users[0]

  const {
    data: { evaluationModels }
  } = await apolloClient.query<GetEvaluationModelType>({
    query: GET_EVALUATION_MODEL,
    variables: {
      year: params?.year,
      locale: locale
    }
  })

  if (!evaluationModels.length) {
    return {
      notFound: true
    }
  }

  // const manager = session?.user.info.access_role === 'Director' ? user.manager.id : session?.user.id

  const {
    data: { evaluationGoals }
  } = await apolloClient.query<GetEvaluationGoalsType>({
    query: GET_EVALUATION_GOALS,
    variables: {
      year: params?.year,
      username: params?.username
      // manager: manager
    }
  })

  if (!evaluationGoals) {
    return {
      notFound: true
    }
  }

  const evaluationModel = evaluationModels[0]
  evaluationModel.goals = evaluationGoals
  evaluationModel.sections = evaluationModel.sections?.filter(
    (section) => section.visibility[user.info.access_role] === true
  )

  let performedEvaluation

  const {
    data: { performedEvaluations }
  } = await apolloClient.query<GetPerformedEvaluationType>({
    query: GET_PERFORMED_EVALUATION,
    variables: {
      idUser: user.id,
      idEvaluationModel: evaluationModel.id
    }
  })

  if (performedEvaluations.length == 0) {
    const { data, errors } = await apolloClient.mutate<CreatePerformedEvaluationType>({
      mutation: CREATE_PERFORMED_EVALUATION,
      variables: {
        idUser: user.id,
        idEvaluationModel: evaluationModel.id
      }
    })
    if (errors || !data) {
      return {
        notFound: true
      }
    }

    performedEvaluation = data.created
  } else {
    performedEvaluation = performedEvaluations[0]
  }

  return {
    props: {
      evaluationModel,
      performedEvaluation,
      user
    }
  }
}

export default EvaluationPage
