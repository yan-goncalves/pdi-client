import { gql } from '@apollo/client'

export const GET_SIGNIN_PAGE = gql`
  query GetSignInPage($locale: I18NLocaleCode) {
    signInPage(locale: $locale) {
      data {
        attributes {
          title
          caption
          logo {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }
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
    }
  }
`
