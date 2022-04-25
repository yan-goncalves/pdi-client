import { gql } from '@apollo/client'

export const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($idManager: ID!) {
    team: usersPermissionsUsers(
      filters: { manager: { id: { eq: $idManager } } }
    ) {
      data {
        id
        attributes {
          username
          info {
            data {
              attributes {
                name
                lastname
              }
            }
          }
          picture {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`
