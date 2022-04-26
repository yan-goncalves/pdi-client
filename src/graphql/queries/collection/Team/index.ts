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
          department {
            data {
              attributes {
                key
                name
              }
            }
          }
          info {
            data {
              attributes {
                name
                lastname
                access_role
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
