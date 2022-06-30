import { gql } from '@apollo/client'
import { FRAGMENT_USER_MODEL } from 'graphql/fragments'

export const GET_USERS = gql`
  ${FRAGMENT_USER_MODEL}
  query GetUsers {
    users {
      ...FragmentUserModel
    }
  }
`
export const GET_USER = gql`
  ${FRAGMENT_USER_MODEL}
  query GetUser($input: GetUserInput!) {
    user(input: $input) {
      ...FragmentUserModel
    }
  }
`
