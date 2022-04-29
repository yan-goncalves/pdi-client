import { gql } from '@apollo/client'

export const GetDepartments = gql`
  query GetDepartments($locale: I18NLocaleCode) {
    departments(locale: $locale) {
      data {
        attributes {
          key
          name
        }
      }
    }
  }
`
