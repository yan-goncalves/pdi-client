import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import EvaluationListTemplate, {
  EvaluationListTemplateProps
} from 'templates/EvaluationList'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'

const PageEvaluationList = ({ items }: EvaluationListTemplateProps) => {
  return <EvaluationListTemplate items={items} />
}

export const getServerSideProps: GetServerSideProps<
  EvaluationListTemplateProps
> = async ({ req }) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

  const {
    data: { evaluationModels }
  } = await apolloClient.query<GetEvaluationModelsType>({
    query: GET_EVALUATION_MODELS
  })

  if (!evaluationModels) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      items: [...evaluationModels]
    }
  }
}

export default PageEvaluationList
