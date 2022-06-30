import { gql } from '@apollo/client'

export const GET_HOME_PAGE = gql`
  query GetHomePage {
    homePage {
      title
      description

      hero

      button {
        label
      }
    }
  }
`
