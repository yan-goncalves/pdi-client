import { gql } from '@apollo/client'
import { FRAGMENT_USER_MODEL } from 'graphql/fragments'

export const LOGIN = gql`
  ${FRAGMENT_USER_MODEL}
  mutation LOGIN($identifier: String!, $password: String!) {
    signin(input: { identifier: $identifier, password: $password }) {
      jwt
      user {
        ...FragmentUserModel
      }
    }
  }
`
