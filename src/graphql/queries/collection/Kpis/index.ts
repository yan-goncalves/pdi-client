import { gql } from '@apollo/client'

export const GET_KPIS = gql`
  query GetKpis {
    kpis {
      id
      name
      target
      weight
    }
  }
`
