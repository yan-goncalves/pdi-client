import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers {
    users: usersPermissionsUsers {
      data {
        attributes {
          username
          email
          info {
            data {
              attributes {
                name
                lastname
                access_role
              }
            }
          }
          department {
            data {
              attributes {
                key
                name
              }
            }
          }
        }
      }
    }
  }
`
export const GET_USER = gql`
  query GetUser($username: String!) {
    users: usersPermissionsUsers(filters: { username: { eq: $username } }) {
      data {
        id
        attributes {
          username
          email
          manager {
            data {
              id
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
          department {
            data {
              attributes {
                key
                name
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
