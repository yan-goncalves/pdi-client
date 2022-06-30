import { gql } from '@apollo/client'

export const GET_SIGNIN_PAGE = gql`
  query GetSignInPage {
    signInPage {
      title
      caption
      logo
      usernameTextField {
        labelPlaceholder
      }
      passwordTextField {
        labelPlaceholder
      }
      button {
        label
        loadingLabel
      }
    }
  }
`
