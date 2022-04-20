import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/EvaluationGoals'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import { GetEvaluationGoalsType } from 'types/queries/collection/EvaluationGoal'
import {
  EvaluationModelType,
  GetEvaluationModelProps
} from 'types/queries/collection/EvaluationModel'

const EvaluationPage = ({
  evaluationModel
}: {
  evaluationModel: EvaluationModelType
}) => {
  useEffect(() => {
    if (evaluationModel) {
      console.log('EVALUATION MODEL', { ...evaluationModel })
    }
  }, [evaluationModel])

  return <div>EvaluationPage</div>
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  locale,
  params
}) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { evaluationModels }
  } = await apolloClient.query<GetEvaluationModelProps>({
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
      manager: session?.user.manager.username
    }
  })

  if (!evaluationGoals) {
    return {
      notFound: true
    }
  }

  const evaluationModel = evaluationModels[0]
  evaluationModel.goals = evaluationGoals

  return {
    props: {
      evaluationModel
    }
  }
}

export default EvaluationPage
