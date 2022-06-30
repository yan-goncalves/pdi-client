import { gql } from '@apollo/client'
import { FRAGMENT_USER_MODEL } from 'graphql/fragments'

export const GET_TEAM_MEMBERS = gql`
  ${FRAGMENT_USER_MODEL}
  query GetTeamMembers($id: Int) {
    team(id: $id) {
      ...FragmentUserModel
    }
  }
`
