import { useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { CREATE_PERFORMED_EVALUATION } from 'graphql/mutations/collection/PerformedEvaluation'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/EvaluationGoal'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_PERFORMED_EVALUATION } from 'graphql/queries/collection/PerformedEvaluation'
import { GET_TEAM_MEMBERS } from 'graphql/queries/collection/Team'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import EvaluationTemplate from 'templates/Evaluation'
import { GetEvaluationGoalsType } from 'types/collection/EvaluationGoal'
import {
  EvaluationModelType,
  GetEvaluationModelType
} from 'types/collection/EvaluationModel'
import {
  CreatePerformedEvaluationType,
  GetPerformedEvaluationType,
  PerformedEvaluationType
} from 'types/collection/PerformedEvaluation'
import { GetTeamMembers } from 'types/collection/Team'
import { GetUser } from 'types/collection/User'

const EvaluationPage = ({
  evaluationModel,
  performedEvaluation
}: {
  evaluationModel: EvaluationModelType
  performedEvaluation: PerformedEvaluationType
}) => {
  const {
    setEvaluationModel,
    setPerformedEvaluation,
    setMode,
    mode,
    periodMode
  } = useEvaluation()

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

  return <EvaluationTemplate type={'manager'} />
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  params
}) => {
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

  if (!team || !team.some((member) => member.username === params?.username)) {
    const rewriteLocale = locale === 'en' ? 'en' : ''
    return {
      redirect: {
        destination: `manager/evaluation`,
        permanent: false
      }
    }
  }

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

  const {
    data: { evaluationGoals }
  } = await apolloClient.query<GetEvaluationGoalsType>({
    query: GET_EVALUATION_GOALS,
    variables: {
      year: params?.year,
      username: params?.username,
      manager: session?.user.username
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
    (section) => section.visibility[session!.user.info.access_role] === true
  )

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

  if (performedEvaluations.length === 0) {
    const { data, errors } =
      await apolloClient.mutate<CreatePerformedEvaluationType>({
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

    performedEvaluation = data.createPerformedEvaluation
  } else {
    performedEvaluation = performedEvaluations[0]
  }

  return {
    props: {
      evaluationModel,
      performedEvaluation
    }
  }
}

export default EvaluationPage
