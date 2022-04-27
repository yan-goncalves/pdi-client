import { initializeApollo } from 'graphql/client'
import { GET_SIGNIN_PAGE } from 'graphql/queries/pages/SignIn'
import { GetStaticProps } from 'next'
import SignInTemplate, { SignInTemplateProps } from 'templates/SignIn'
import { SignInProps } from 'types/pages'

const SignIn = (props: SignInTemplateProps) => {
  return <SignInTemplate {...props} />
}

export const getStaticProps: GetStaticProps<SignInTemplateProps> = async ({
  locale
}) => {
  const apolloClient = initializeApollo()

  const {
    data: { signInPage }
  } = await apolloClient.query<SignInProps>({
    query: GET_SIGNIN_PAGE,
    variables: {
      locale
    }
  })

  if (!signInPage) {
    return {
      notFound: true
    }
  }

  return {
    props: { ...signInPage }
  }
}

export default SignIn
