import { EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { CREATE_PERFORMED_EVALUATION } from 'graphql/mutations/collection/PerformedEvaluation'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_PERFORMED_EVALUATION_RELATION } from 'graphql/queries/collection/PerformedEvaluation'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import PdiManagementTemplate from 'templates/Pdi'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import {
  CreatePerformedEvaluationType,
  GetPerformedEvaluationType,
  PerformedEvaluationType
} from 'types/collection/PerformedEvaluation'
import { GetUserType, UserType } from 'types/collection/User'

const EvaluationPage = ({
  user,
  evaluation,
  performed
}: {
  user: UserType
  evaluation: EvaluationModelType
  performed: PerformedEvaluationType
}) => {
  const {
    setEvaluationModel,
    setPerformedEvaluation,
    setAppraisee,
    setMode,
    mode,
    periodMode,
    setIsLocaleLoading
  } = useEvaluation()

  useEffect(() => {
    if (user) {
      setAppraisee(user)
    }
  }, [user])

  useEffect(() => {
    if (evaluation) {
      setEvaluationModel(evaluation)
      setMode(EVALUATION_MODE.EDIT)
      setIsLocaleLoading(false)
    }
  }, [evaluation])

  useEffect(() => {
    if (performed) {
      setPerformedEvaluation(performed)
    }
  }, [performed])

  return <PdiManagementTemplate />
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale, params }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { user },
    error: userError,
    errors: userErrors
  } = await apolloClient.query<GetUserType>({
    query: GET_USER,
    variables: {
      input: {
        username: params?.username,
        loadRelations: true
      }
    }
  })

  if (userError || userErrors) {
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

  let performed

  await apolloClient
    .query<GetPerformedEvaluationType>({
      query: GET_PERFORMED_EVALUATION_RELATION,
      variables: {
        idEvaluation: evaluation.id,
        idUser: user.id
      }
    })
    .then(({ data: { performedEvaluation } }) => (performed = performedEvaluation))
    .catch(async () => {
      const { data, errors } = await apolloClient.mutate<CreatePerformedEvaluationType>({
        mutation: CREATE_PERFORMED_EVALUATION,
        variables: {
          idEvaluation: evaluation.id,
          idUser: user.id
        }
      })

      if (errors) {
        return {
          notFound: true
        }
      }

      performed = data?.created
    })

  return {
    props: {
      user,
      evaluation,
      performed
    }
  }
}

export default EvaluationPage
