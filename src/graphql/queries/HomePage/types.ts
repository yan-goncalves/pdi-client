import { gql } from '@apollo/client'

export const GET_HOME_PAGE = gql`
  query GetHomePage($locale: I18NLocaleCode) {
    homePage(locale: $locale) {
      title
      description

      hero {
        url
        alternativeText
      }

      button {
        label
      }
    }
  }
`
