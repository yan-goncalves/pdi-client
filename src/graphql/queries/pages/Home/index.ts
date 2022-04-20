import { gql } from '@apollo/client'

export const GET_HOME_PAGE = gql`
  query GetHomePage($locale: I18NLocaleCode) {
    homePage(locale: $locale) {
      data {
        attributes {
          title
          description

          hero {
            data {
              attributes {
                url
                alternativeText
              }
            }
          }

          button {
            label
          }
        }
      }
    }
  }
`
