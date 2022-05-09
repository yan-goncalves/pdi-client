import { initializeApollo } from 'graphql/client'
import { GET_NOT_FOUND_PAGE } from 'graphql/queries/pages/404'
import { GetStaticProps } from 'next'
import { useEffect } from 'react'
import Template404, { Template404Props } from 'templates/404'
import { NotFoundProps } from 'types/pages'

const Page404 = (props: Template404Props) => {
  return <Template404 {...props} />
}

export const getStaticProps: GetStaticProps<Template404Props> = async ({ locale }) => {
  const apolloClient = initializeApollo()

  const {
    data: { notFoundPage }
  } = await apolloClient.query<NotFoundProps>({
    query: GET_NOT_FOUND_PAGE,
    variables: {
      locale
    }
  })

  return {
    props: {
      ...notFoundPage
    }
  }
}

export default Page404
