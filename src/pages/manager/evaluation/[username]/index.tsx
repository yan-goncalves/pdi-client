import {
  Avatar,
  Group,
  Title,
  Text,
  useMantineTheme,
  Badge
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { FALLBACK_USER_PICTURE } from 'components/UserPicture'
import { EvaluationConstants } from 'constants/evaluation'
import { useLocale } from 'contexts/LocaleProvider'
import { initializeApollo } from 'graphql/client'
import { GET_EVALUATION_MODELS } from 'graphql/queries/collection/EvaluationModel'
import { GET_USER } from 'graphql/queries/collection/User'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'
import EvaluationListTemplate, {
  EvaluationListTemplateProps
} from 'templates/EvaluationList'
import { GetEvaluationModelsType } from 'types/collection/EvaluationModel'
import { GetUser, UserType } from 'types/collection/User'

export interface PageEvaluationListUserProps
  extends EvaluationListTemplateProps {
  user: UserType
}

const PageEvaluationList = ({ items, user }: PageEvaluationListUserProps) => {
  const theme = useMantineTheme()
  const { locale } = useLocale()
  const match = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false)

  return (
    <EvaluationListTemplate
      items={items}
      title={
        <Group sx={{ justifyContent: 'space-between' }}>
          <Title p={20} order={!match ? 3 : 6}>
            {`${EvaluationConstants.contentTitle.team[locale]}`}
          </Title>
          <Group mr={25}>
            <Avatar
              size={!match ? 'sm' : 'xs'}
              src={
                !user.picture?.url
                  ? FALLBACK_USER_PICTURE
                  : `${process.env.NEXT_PUBLIC_API_URL}${user.picture.url}`
              }
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

export const getServerSideProps: GetServerSideProps<
  EvaluationListTemplateProps
> = async ({ req, params }) => {
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

  const {
    data: { user }
  } = await apolloClient.query<GetUser>({
    query: GET_USER,
    variables: {
      username: params?.username
    }
  })

  if (!user || !user[0]) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      items: [...evaluationModels],
      user: user[0]
    }
  }
}

export default PageEvaluationList
