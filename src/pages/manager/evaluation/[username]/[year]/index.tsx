import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { ROLES } from 'constants/role'
import { initializeApollo } from 'graphql/client'
import { CREATE_PERFORMED_EVALUATION } from 'graphql/mutations/collection/PerformedEvaluation'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_PERFORMED_EVALUATION_RELATION } from 'graphql/queries/collection/PerformedEvaluation'
import { GET_RATINGS } from 'graphql/queries/collection/Rating'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import EvaluationTemplate from 'templates/Evaluation'
import { EvaluationModelType, GetEvaluationModelType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType } from 'types/collection/Goal'
import {
  CreatePerformedEvaluationType,
  GetPerformedEvaluationType,
  PerformedEvaluationType
} from 'types/collection/PerformedEvaluation'
import { GetRatings, RatingType } from 'types/collection/Rating'
import { GetUserType, UserType } from 'types/collection/User'

const EvaluationPage = ({
  user,
  evaluation,
  performed,
  ratings,
  canOnlyCalibrate = false
}: {
  user: UserType
  evaluation: EvaluationModelType
  performed: PerformedEvaluationType
  ratings: RatingType[]
  canOnlyCalibrate?: boolean
}) => {
  const {
    setEvaluationModel,
    setPerformedEvaluation,
    setRatings,
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
      const checkMode = periodMode !== evaluation.period ? EVALUATION_MODE.VIEW : mode
      setEvaluationModel(evaluation)
      setMode(checkMode)
      setIsLocaleLoading(false)
    }
  }, [evaluation])

  useEffect(() => {
    if (performed) {
      setPerformedEvaluation(performed)
    }
  }, [performed])

  useEffect(() => {
    if (ratings) {
      setRatings(ratings)
    }
  }, [ratings])

  return <EvaluationTemplate actor={EVALUATION_ACTOR.MANAGER} canOnlyCalibrate={canOnlyCalibrate} />
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

  // Check if current user can access this evaluation
  // Only allow if:
  // 1. User is the direct manager of the employee
  // 2. User is sabrinavelasques (can only calibrate, not edit)
  // 3. User has DIRECTOR role (can only calibrate, not edit)
  const isDirectManager = session?.user?.id === user.manager?.id
  const isSabrina = session?.user?.username === 'sabrinavelasques'
  const isDirector = session?.user?.role === ROLES.DIRECTOR

  // Sabrina and DIRECTOR can access any evaluation, but only calibrate if not direct manager
  const canAccess = isDirectManager || isSabrina || isDirector
  const canOnlyCalibrate = !isDirectManager && (isSabrina || isDirector)

  if (!canAccess) {
    const rewriteLocale = locale === 'en' ? '/en' : ''
    return {
      redirect: {
        destination: `${rewriteLocale}/manager/evaluation`,
        permanent: false
      }
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

  evaluation.goals = evaluationGoals
  evaluation.sections = evaluation.sections?.filter(
    (section) => section.visibility[user.role] === true
  )

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
      const { data } = await apolloClient.mutate<CreatePerformedEvaluationType>({
        mutation: CREATE_PERFORMED_EVALUATION,
        variables: {
          idEvaluation: evaluation.id,
          idUser: user.id
        }
      })

      if (!data?.created) {
        return {
          notFound: true
        }
      }

      performed = data?.created
    })

  const {
    data: { ratings }
  } = await apolloClient.query<GetRatings>({
    query: GET_RATINGS,
    context: {
      headers: {
        locale
      }
    }
  })

  return {
    props: {
      user,
      evaluation,
      performed,
      ratings,
      canOnlyCalibrate // Pass flag to indicate if user can only calibrate (not edit)
    }
  }
}

export default EvaluationPage
