import { ROLES } from 'constants/role'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import EvaluationListTemplate, { EvaluationListTemplateProps } from 'templates/EvaluationList'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'

const PageEvaluationList = ({ items }: EvaluationListTemplateProps) => {
  return <EvaluationListTemplate items={items} />
}

export const getServerSideProps: GetServerSideProps<EvaluationListTemplateProps> = async ({
  req,
  locale
}) => {
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
    data: { evaluations }
  } = await apolloClient.query<GetEvaluationModelsType>({
    query: GET_EVALUATION_MODELS,
    context: {
      headers: {
        locale
      }
    }
  })

  if (!evaluations) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      items: [...evaluations]
    }
  }
}

export default PageEvaluationList
