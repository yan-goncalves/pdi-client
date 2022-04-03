import { initializeApollo } from 'graphql/client'
import { GET_SIGNIN_PAGE } from 'graphql/queries/SignInPage'
import { GetSignInPage } from 'graphql/queries/SignInPage/__generated__/GetSignInPage'
import { GetStaticProps } from 'next'
import SignInTemplate, { SignInTemplateProps } from 'templates/SignIn'

const SignIn = (props: SignInTemplateProps) => {
  return <SignInTemplate {...props} />
}

export const getStaticProps: GetStaticProps<SignInTemplateProps> = async ({
  locale
}) => {
  const apolloClient = initializeApollo()

  const {
    data: { signInPage }
  } = await apolloClient.query<GetSignInPage>({
    query: GET_SIGNIN_PAGE,
    variables: {
      locale
    },
    fetchPolicy: 'no-cache'
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
