import { gql } from '@apollo/client'

export const GET_NOT_FOUND_PAGE = gql`
  query GetNotFoundPage($locale: I18NLocaleCode) {
    notFoundPage(locale: $locale) {
      data {
        attributes {
          message
          button {
            label
          }
        }
      }
    }
  }
`
