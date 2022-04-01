import { initializeApollo } from 'graphql/apollo'
import { GetStaticProps } from 'next'
import HomeTemplate, { HomeTemplateProps } from 'templates/Home'

const Home = (props: HomeTemplateProps) => {
  return <HomeTemplate {...props} />
}

export const getStaticProps: GetStaticProps<HomeTemplateProps> = async () => {
  const apolloClient = initializeApollo()

  return {
    props: {
      info: {
        title: 'TITULO',
        description: 'DESCRIÇÃO'
      },
      logo: {
        url: '/img/home.svg',
        alternativeText: 'colaboradora realizando avaliação de desempenho'
      }
    }
  }
}

export default Home
