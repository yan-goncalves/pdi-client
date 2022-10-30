import { Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { CommonConstants } from 'constants/common'
import { useLocale } from 'contexts/LocaleProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { EvaluationListTemplateProps } from 'templates/EvaluationCardList'
import Report from 'templates/Report'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'

const ReportPage = ({ items }: EvaluationListTemplateProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <Report
      items={items}
      title={
        <Title p={20} order={!match ? 3 : 6}>
          {`${CommonConstants.reports.title[locale]}`}
        </Title>
      }
    />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
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

  return {
    props: {
      items: [...evaluations]
    }
  }
}

export default ReportPage
