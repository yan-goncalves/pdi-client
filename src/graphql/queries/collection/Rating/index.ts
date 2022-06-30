import { gql } from '@apollo/client'

export const GET_RATINGS = gql`
  query GetRatings {
    ratings {
      id
      value
      description
    }
  }
`
