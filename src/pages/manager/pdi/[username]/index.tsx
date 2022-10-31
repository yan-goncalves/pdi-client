import { Avatar, Group, Text, Title, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { CommonConstants } from 'constants/common'
import { useLocale } from 'contexts/LocaleProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import EvaluationCardListTemplate from 'templates/EvaluationCardList'
import { EvaluationListTemplateProps } from 'templates/EvaluationList'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'
import { GetUserType, UserType } from 'types/collection/User'

export interface PageYearListUserProps extends EvaluationListTemplateProps {
  user: UserType
}

const PageYearList = ({ items, user }: PageYearListUserProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <EvaluationCardListTemplate
      items={items}
      title={
        <Group sx={{ justifyContent: 'space-between' }}>
          <Title p={20} order={!match ? 3 : 6}>
            {`${CommonConstants.pdi.title[locale]}`}
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

  return {
    props: {
      items: [...evaluations],
      user
    }
  }
}

export default PageYearList
