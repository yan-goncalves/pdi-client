import { Avatar, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { GoalsConstants } from 'constants/goals'
import { EVALUATION_ACTOR } from 'contexts/EvaluationProvider'
import { useLocale } from 'contexts/LocaleProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GET_EVALUATION_GOALS } from 'graphql/queries/collection/Goals'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import EvaluationCardListTemplate from 'templates/EvaluationCardList'
import { EvaluationListTemplateProps } from 'templates/EvaluationList'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'
import { GetEvaluationGoalsType } from 'types/collection/Goal'
import { GetUserType, UserType } from 'types/collection/User'

export interface PageEvaluationListUserProps extends EvaluationListTemplateProps {
  user: UserType
}

const PageEvaluationList = ({ items, user }: PageEvaluationListUserProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <EvaluationCardListTemplate
      items={items}
      title={
        <Group sx={{ justifyContent: 'space-between' }}>
          <Title p={20} order={!match ? 3 : 6}>
            {`${GoalsConstants.title[EVALUATION_ACTOR.MANAGER][locale]}`}
          </Title>
          <Group mr={25}>
            <Avatar
              size={!match ? 'sm' : 'xs'}
              src={
                !user.picture
                  ? FALLBACK_USER_PICTURE
                  : `${process.env.NEXT_PUBLIC_API_URL}/${user.picture}`
              }
              sx={{ backgroundColor: theme.colors.gray[3] }}
            />
            <Text size={!match ? 'md' : 'xs'} weight={500}>
              {user.info.name} {user.info.lastname}
            </Text>
          </Group>
        </Group>
      }
    />
  )
}

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

  const mappedEvaluation = await Promise.all(
    evaluations.map(async (evaluation) => {
      const {
        data: { evaluationGoals }
      } = await apolloClient.query<GetEvaluationGoalsType>({
        query: GET_EVALUATION_GOALS,
        variables: {
          idEvaluation: evaluation.id,
          idUser: user.id
        }
      })
      const total = evaluationGoals
        .map(({ kpis }) => {
          return kpis
            .map(({ weight }) => weight)
            .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)
        })
        .reduce((prevWeight, currWeight) => prevWeight + currWeight, 0)

      return { ...evaluation, totalWeight: total }
    })
  )

  return {
    props: {
      items: [...mappedEvaluation],
      user
    }
  }
}

export default PageEvaluationList
