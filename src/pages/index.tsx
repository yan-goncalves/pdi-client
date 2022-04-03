import { initializeApollo } from 'graphql/client'
import { GetHomePage, GET_HOME_PAGE } from 'graphql/queries/HomePage'
import { GetStaticProps } from 'next'
import HomeTemplate, { HomeTemplateProps } from 'templates/Home'

const Home = (props: HomeTemplateProps) => {
  return <HomeTemplate {...props} />
}

export const getStaticProps: GetStaticProps<HomeTemplateProps> = async ({
  locale
}) => {
  const apolloClient = initializeApollo()

  const {
    data: { homePage }
  } = await apolloClient.query<GetHomePage>({
    query: GET_HOME_PAGE,
    variables: {
      locale
    },
    fetchPolicy: 'no-cache'
  })

  if (!homePage) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      info: {
        title: homePage.title,
        description: homePage.description,
        button: homePage.button
      },
      hero: {
        ...homePage.hero
      }
    }
  }
}

export default Home
