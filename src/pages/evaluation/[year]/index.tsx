import { ROLES } from 'constants/role'
import { EVALUATION_ACTOR, EVALUATION_MODE, useEvaluation } from 'contexts/EvaluationProvider'
import { initializeApollo } from 'graphql/client'
import { CREATE_PERFORMED_EVALUATION } from 'graphql/mutations/collection/PerformedEvaluation'
import { GET_EVALUATION_MODEL } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_PERFORMED_EVALUATION_RELATION } from 'graphql/queries/collection/PerformedEvaluation'
import { GET_RATINGS } from 'graphql/queries/collection/Rating'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
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

const EvaluationPage = ({
  evaluation,
  performed,
  ratings
}: {
  evaluation: EvaluationModelType
  performed: PerformedEvaluationType
  ratings: RatingType[]
}) => {
  const { data: session } = useSession()

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
    if (session?.user) {
      setAppraisee(session.user)
    }
  }, [session])

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

  return <EvaluationTemplate actor={EVALUATION_ACTOR.USER} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale, params }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  if (session?.user.role === ROLES.DIRECTOR) {
    const rewriteLocale = locale === 'en' ? '/en' : ''
    return {
      redirect: {
        destination: `${rewriteLocale}/manager/evaluation`,
        permanent: false
      }
    }
  }

  const {
    data: { evaluation }
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

  if (!evaluation) {
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
      idUser: session?.user.id
    }
  })

  if (!evaluationGoals) {
    return {
      notFound: true
    }
  }

  evaluation.goals = evaluationGoals
  evaluation.sections = evaluation.sections?.filter(
    (section) => section.visibility[session!.user.role] === true
  )

  let performed

  await apolloClient
    .query<GetPerformedEvaluationType>({
      query: GET_PERFORMED_EVALUATION_RELATION,
      variables: {
        idEvaluation: evaluation.id,
        idUser: session?.user.id
      }
    })
    .then(({ data: { performedEvaluation } }) => (performed = performedEvaluation))
    .catch(async () => {
      const { data, errors } = await apolloClient.mutate<CreatePerformedEvaluationType>({
        mutation: CREATE_PERFORMED_EVALUATION,
        variables: {
          idEvaluation: evaluation.id,
          idUser: session?.user.id
        }
      })

      if (errors) {
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
      evaluation,
      performed,
      ratings
    }
  }
}

export default EvaluationPage
