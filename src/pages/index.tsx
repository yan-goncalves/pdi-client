import { initializeApollo } from 'graphql/client'
import { GET_HOME_PAGE } from 'graphql/queries/pages/Home'
import { GetStaticProps } from 'next'
import HomeTemplate, { HomeTemplateProps } from 'templates/Home'
import { HomePageProps } from 'types/queries/pages'

const Home = (props: HomeTemplateProps) => {
  return <HomeTemplate {...props} />
}

export const getStaticProps: GetStaticProps<HomeTemplateProps> = async ({
  locale
}) => {
  const apolloClient = initializeApollo()

  const {
    data: { homePage }
  } = await apolloClient.query<HomePageProps>({
    query: GET_HOME_PAGE,
    variables: {
      locale
    }
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
