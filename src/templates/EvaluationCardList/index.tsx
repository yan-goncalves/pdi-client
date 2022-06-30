import { Grid } from '@mantine/core'
import ContentBase from 'components/ContentBase'
import EvaluationCardButtonItem from 'components/EvaluationCardButtonItem'
import { EvaluationCardItemProps } from 'components/EvaluationCardItem'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'
import { GetUserType } from 'types/collection/User'

export type EvaluationListTemplateProps = {
  items: EvaluationCardItemProps[]
  title?: React.ReactNode
}

const EvaluationCardListTemplate = ({ items, title }: EvaluationListTemplateProps) => {
  return (
    <ContentBase title={title}>
      <Grid justify={'flex-start'}>
        {items.map((props) => (
          <Grid.Col xs={5} md={4} lg={3} xl={2} key={props.year}>
            <EvaluationCardButtonItem {...props} />
          </Grid.Col>
        ))}
      </Grid>
    </ContentBase>
  )
}

export default EvaluationCardListTemplate

export const getServerSideProps: GetServerSideProps<EvaluationListTemplateProps> = async ({
  req,
  params,
  locale
}) => {
  const session = await getSession({ req })
  const apolloClient = initializeApollo(null, session)

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

  const {
    data: { user },
    error,
    errors
  } = await apolloClient.query<GetUserType>({
    query: GET_USER,
    variables: {
      input: {
        username: params?.username
      }
    }
  })

  if (error || errors) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      items: [...evaluations],
      user
    }
  }
}
